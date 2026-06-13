/**
 * Zod schemas — single source of truth for the booking payload,
 * used by both the wizard (client) and /api/bookings (server). TRD §1, §5.
 */
import { z } from "zod";
import { SERVICES } from "./services";

const serviceSlugs = new Set(SERVICES.map((s) => s.slug));

/** Accepts 9812345678, 09812345678, +919812345678, 919812345678 */
export const indianMobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(
    z
      .string()
      .regex(/^(\+91|91|0)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
  )
  .transform((v) => `+91${v.replace(/^(\+91|91|0)/, "")}`);

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name")
    .max(80, "That name looks too long"),
  phone: indianMobile,
  services: z
    .array(z.string().refine((s) => serviceSlugs.has(s), "Unknown service"))
    .min(1, "Pick at least one service")
    .max(8, "Up to 8 services per booking"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  slot: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time slot"),
  note: z.string().trim().max(300, "Keep the note under 300 characters").optional().default(""),
  /** honeypot — must stay empty (bot heuristic, TRD §5) */
  hp: z.literal("").or(z.literal(undefined)).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
