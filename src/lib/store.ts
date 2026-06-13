/**
 * Booking persistence (TRD §2–§4).
 *
 * Three tiers, picked automatically from configuration:
 *   1. Prisma → Supabase Postgres (DATABASE_URL set) — schema lives in prisma/schema.prisma
 *   2. Supabase REST via service-role key (no direct DB password yet)
 *   3. In-memory store (no credentials) — dev fallback with identical semantics
 *
 * In development a failing DB call falls back to memory with a loud console
 * warning; in production it throws so a booking is never silently dropped
 * (PRD §7 reliability).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { cleanEnv } from "./env";
import { SALON } from "./salon";
import { getService } from "./services";
import { slotEndFor } from "./slots";

export interface BookingRecord {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  services: {
    slug: string;
    name: string;
    price: number | null;
    duration_min: number;
    category: string;
  }[];
  category: "him" | "her" | "mixed";
  date: string;
  slot_start: string;
  slot_end: string;
  note: string;
  status: string;
  wa_notified: boolean;
  created_at: string;
}

export class SlotFullError extends Error {
  constructor() {
    super("SLOT_FULL");
    this.name = "SlotFullError";
  }
}

/* ---------------- tier 1: Prisma ---------------- */
const globalForDb = globalThis as unknown as {
  __eternalPrisma?: PrismaClient;
  __eternalBookings?: BookingRecord[];
};

function prisma(): PrismaClient | null {
  const url = cleanEnv(process.env.DATABASE_URL);
  if (!url) return null;
  return (globalForDb.__eternalPrisma ??= new PrismaClient({ datasourceUrl: url }));
}

/** "HH:mm" → Date for a Postgres `time` column (Prisma maps time on 1970-01-01 UTC) */
function hhmmToDate(t: string) {
  return new Date(`1970-01-01T${t}:00.000Z`);
}
function dateToHHmm(d: Date) {
  return d.toISOString().slice(11, 16);
}
function ymdToDate(d: string) {
  return new Date(`${d}T00:00:00.000Z`);
}

/* ---------------- tier 2: Supabase REST ---------------- */
function supabase(): SupabaseClient | null {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/* ---------------- tier 3: in-memory (dev) ---------------- */
const memory = (globalForDb.__eternalBookings ??= []);

function devFallback<T>(scope: string, err: unknown, fallback: () => T): T {
  if (process.env.NODE_ENV === "production") throw err;
  console.warn(
    `[eternal] ${scope} failed — falling back to in-memory store (run "npx prisma db push" or supabase schema to fix):`,
    err instanceof Error ? err.message : err,
  );
  return fallback();
}

function makeReference(id: string) {
  return `ETR-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

function buildRecord(input: {
  name: string;
  phone: string;
  services: string[];
  date: string;
  slot: string;
  note: string;
}): Omit<BookingRecord, "created_at"> {
  const services = input.services.map((slug) => {
    const s = getService(slug)!;
    return {
      slug: s.slug,
      name: s.name,
      price: s.price,
      duration_min: s.durationMin,
      category: s.category,
    };
  });
  const cats = new Set(services.map((s) => s.category).filter((c) => c !== "everyone"));
  const category = cats.size === 1 ? ([...cats][0] as "him" | "her") : "mixed";
  const totalDuration = services.reduce((sum, s) => sum + s.duration_min, 0);
  const id = crypto.randomUUID();
  return {
    id,
    reference: makeReference(id),
    customer_name: input.name,
    phone: input.phone,
    services,
    category,
    date: input.date,
    slot_start: input.slot,
    slot_end: slotEndFor(input.slot, totalDuration),
    note: input.note,
    status: "pending",
    wa_notified: false,
  };
}

function memoryCounts(date: string) {
  const counts: Record<string, number> = {};
  for (const b of memory) {
    if (b.date === date && b.status !== "cancelled") {
      counts[b.slot_start] = (counts[b.slot_start] ?? 0) + 1;
    }
  }
  return counts;
}

/** Count of active bookings per slot start ("HH:mm") for a date. */
export async function bookedCountsForDate(date: string): Promise<Record<string, number>> {
  const db = prisma();
  if (db) {
    try {
      const rows = await db.booking.findMany({
        where: { date: ymdToDate(date), status: { not: "cancelled" } },
        select: { slotStart: true },
      });
      const counts: Record<string, number> = {};
      for (const row of rows) {
        const start = dateToHHmm(row.slotStart);
        counts[start] = (counts[start] ?? 0) + 1;
      }
      return counts;
    } catch (err) {
      return devFallback("Prisma availability query", err, () => memoryCounts(date));
    }
  }

  const sb = supabase();
  if (sb) {
    const { data, error } = await sb
      .from("bookings")
      .select("slot_start")
      .eq("date", date)
      .neq("status", "cancelled");
    if (error) {
      return devFallback(
        "Supabase availability query",
        new Error(error.message),
        () => memoryCounts(date),
      );
    }
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const start = String(row.slot_start).slice(0, 5);
      counts[start] = (counts[start] ?? 0) + 1;
    }
    return counts;
  }

  return memoryCounts(date);
}

/**
 * Insert a booking with a capacity re-check (race-condition guard, TRD §4).
 * Throws SlotFullError when the slot is at capacity.
 */
export async function createBooking(input: {
  name: string;
  phone: string;
  services: string[];
  date: string;
  slot: string;
  note: string;
}): Promise<BookingRecord> {
  // Capacity re-check right before insert (all tiers).
  const counts = await bookedCountsForDate(input.date);
  if ((counts[input.slot] ?? 0) >= SALON.slotCapacity) throw new SlotFullError();

  const record = buildRecord(input);

  const db = prisma();
  if (db) {
    try {
      const created = await db.booking.create({
        data: {
          id: record.id,
          reference: record.reference,
          customerName: record.customer_name,
          phone: record.phone,
          services: record.services,
          category: record.category,
          date: ymdToDate(record.date),
          slotStart: hhmmToDate(record.slot_start),
          slotEnd: hhmmToDate(record.slot_end),
          note: record.note,
          status: record.status,
          source: "website",
          waNotified: false,
        },
        select: { createdAt: true },
      });
      return { ...record, created_at: created.createdAt.toISOString() };
    } catch (err) {
      return devFallback("Prisma insert", err, () => memoryInsert(record));
    }
  }

  const sb = supabase();
  if (sb) {
    const row = {
      id: record.id,
      reference: record.reference,
      customer_name: record.customer_name,
      phone: record.phone,
      services: record.services,
      category: record.category,
      date: record.date,
      slot_start: record.slot_start,
      slot_end: record.slot_end,
      note: record.note,
      status: record.status,
      source: "website",
      wa_notified: false,
    };
    let { data, error } = await sb
      .from("bookings")
      .insert(row)
      .select("reference, created_at")
      .single();
    if (error && /reference/i.test(error.message)) {
      // Table created from the legacy schema.sql where `reference` is a
      // DB-generated column — let the database compute it instead.
      const withoutRef: Partial<typeof row> = { ...row };
      delete withoutRef.reference;
      ({ data, error } = await sb
        .from("bookings")
        .insert(withoutRef)
        .select("reference, created_at")
        .single());
    }
    if (error) {
      return devFallback("Supabase insert", new Error(error.message), () =>
        memoryInsert(record),
      );
    }
    return {
      ...record,
      reference: data?.reference ?? record.reference,
      created_at: data?.created_at ?? new Date().toISOString(),
    };
  }

  return memoryInsert(record);
}

function memoryInsert(record: Omit<BookingRecord, "created_at">): BookingRecord {
  const full: BookingRecord = { ...record, created_at: new Date().toISOString() };
  memory.push(full);
  console.info(`[eternal] booking stored in memory: ${full.reference}`);
  return full;
}

export async function markWaNotified(id: string) {
  const db = prisma();
  if (db) {
    try {
      await db.booking.update({ where: { id }, data: { waNotified: true } });
      return;
    } catch {
      // fall through to memory below (dev) — flag is non-critical
    }
  }
  const sb = supabase();
  if (sb) {
    await sb.from("bookings").update({ wa_notified: true }).eq("id", id);
    return;
  }
  const b = memory.find((x) => x.id === id);
  if (b) b.wa_notified = true;
}
