import { NextRequest, NextResponse } from "next/server";
import { bookedCountsForDate } from "@/lib/store";
import { isBookableDate, slotsWithAvailability } from "@/lib/slots";

export const dynamic = "force-dynamic";

/** GET /api/availability?date=YYYY-MM-DD → { slots: [{start, end, available}] } */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isBookableDate(date)) {
    return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });
  }
  try {
    const counts = await bookedCountsForDate(date);
    const slots = slotsWithAvailability(date, counts);
    return NextResponse.json(
      { date, slots },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=60" } }
    );
  } catch (err) {
    console.error("[eternal] availability error:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
