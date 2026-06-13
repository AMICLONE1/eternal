/**
 * Slot engine (TRD §4).
 * Slots = working hours, minus past times (IST), minus a lead-time buffer.
 * Capacity per slot = SALON.slotCapacity (number of parallel chairs).
 */
import { SALON } from "./salon";

export interface Slot {
  /** "HH:mm" 24h start */
  start: string;
  end: string;
  available: boolean;
}

/** Current date+time in IST regardless of server timezone. */
export function nowIST(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SALON.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10),
  };
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function format12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Weekday (0=Sun) of a YYYY-MM-DD date, timezone-safe. */
export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** The next N bookable dates starting today (IST). */
export function bookableDates(): string[] {
  const { date } = nowIST();
  const start = new Date(`${date}T00:00:00Z`);
  const dates: string[] = [];
  for (let i = 0; i < SALON.bookingWindowDays; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function isBookableDate(date: string): boolean {
  return bookableDates().includes(date);
}

/**
 * All slot start times for a date from working hours alone (no bookings).
 * Returns [] when the salon is closed that weekday.
 */
export function rawSlotsForDate(date: string): { start: string; end: string }[] {
  const hours = SALON.workingHours[weekdayOf(date)];
  if (!hours) return [];
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const slots: { start: string; end: string }[] = [];
  for (let t = open; t + SALON.slotGranularityMin <= close; t += SALON.slotGranularityMin) {
    slots.push({ start: toHHMM(t), end: toHHMM(t + SALON.slotGranularityMin) });
  }
  return slots;
}

/**
 * Availability for a date given existing booking counts per slot start.
 * Past slots and slots inside the lead-time buffer are unavailable today.
 */
export function slotsWithAvailability(
  date: string,
  bookedCounts: Record<string, number>
): Slot[] {
  const now = nowIST();
  const cutoff = date === now.date ? now.minutes + SALON.leadTimeMin : -1;
  return rawSlotsForDate(date).map(({ start, end }) => ({
    start,
    end,
    available:
      toMinutes(start) > cutoff &&
      (bookedCounts[start] ?? 0) < SALON.slotCapacity,
  }));
}

/** Validates a candidate slot start for a date (exists + not past/lead-time). */
export function isValidSlotStart(date: string, start: string): boolean {
  const now = nowIST();
  if (date === now.date && toMinutes(start) <= now.minutes + SALON.leadTimeMin) {
    return false;
  }
  return rawSlotsForDate(date).some((s) => s.start === start);
}

/** slot_end for the salon's info = start + total duration of chosen services. */
export function slotEndFor(start: string, totalDurationMin: number): string {
  return toHHMM(toMinutes(start) + totalDurationMin);
}

export function formatDateLong(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T00:00:00Z`));
}
