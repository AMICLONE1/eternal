import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { isBookableDate, isValidSlotStart } from "@/lib/slots";
import { createBooking, SlotFullError } from "@/lib/store";
import { notifySalon } from "@/lib/notify";
import { rateLimitOk } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * POST /api/bookings (TRD §5)
 * 201 {reference} · 400 validation · 409 SLOT_FULL · 429 rate-limited
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimitOk(ip)) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Honeypot filled → pretend success, store nothing (TRD §5)
  if ((body as Record<string, unknown>).hp) {
    return NextResponse.json({ reference: "ETR-OK" }, { status: 201 });
  }

  if (!isBookableDate(input.date)) {
    return NextResponse.json(
      { error: "VALIDATION", issues: { date: ["Pick a date within the next 14 days"] } },
      { status: 400 }
    );
  }
  if (!isValidSlotStart(input.date, input.slot)) {
    return NextResponse.json(
      { error: "VALIDATION", issues: { slot: ["That time isn't available — pick another slot"] } },
      { status: 400 }
    );
  }

  try {
    const booking = await createBooking({
      name: input.name,
      phone: input.phone,
      services: input.services,
      date: input.date,
      slot: input.slot,
      note: input.note ?? "",
    });

    // Fire-and-forget: notification problems never block the booking (TRD §6)
    notifySalon(booking).catch((err) =>
      console.error(`[eternal] notify pipeline crashed for ${booking.reference}:`, err)
    );

    return NextResponse.json(
      {
        reference: booking.reference,
        date: booking.date,
        slot: booking.slot_start,
        slotEnd: booking.slot_end,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof SlotFullError) {
      return NextResponse.json({ error: "SLOT_FULL" }, { status: 409 });
    }
    console.error("[eternal] booking insert failed:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
