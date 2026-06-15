import { NextRequest, NextResponse } from "next/server";
import { getBookingByReference, cancelBooking } from "@/lib/store";
import { verifyManageToken } from "@/lib/manage-token";
import { rateLimitOk } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * POST /api/bookings/cancel  { reference, token }
 * Verifies the manage token, then cancels the booking (idempotent).
 * 200 ok · 400 bad input · 403 bad token · 404 unknown · 429 rate-limited
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (!rateLimitOk(ip)) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  let body: { reference?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const reference = typeof body.reference === "string" ? body.reference.trim() : "";
  const token = typeof body.token === "string" ? body.token : "";
  if (!reference || !token) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const booking = await getBookingByReference(reference);
  if (!booking) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  if (!verifyManageToken(booking.id, token)) {
    return NextResponse.json({ error: "BAD_TOKEN" }, { status: 403 });
  }

  if (booking.status !== "cancelled") {
    await cancelBooking(booking.id);
  }
  return NextResponse.json({ ok: true, status: "cancelled" }, { status: 200 });
}
