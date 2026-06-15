/**
 * Self-serve manage links (cancel / reschedule).
 *
 * The link a guest receives is `/manage?ref=ETR-XXXXXX&t=<token>` where the
 * token is an HMAC of the booking id under a server-only secret. It's:
 *   - unguessable (you can't forge it without MANAGE_SECRET), and
 *   - stateless (no extra DB column — derived from data we already store),
 * so anyone holding the link can manage that one booking and no other, and
 * references can't be enumerated.
 *
 * Server-only: never import into a client component.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { cleanEnv } from "./env";
import { SITE_URL } from "./site";

/** Stable per-deployment secret. In prod set MANAGE_SECRET; otherwise we
 *  derive one from the Supabase service key (also secret + stable) so the
 *  feature works without an extra env var, and warn if neither exists. */
function secret(): string {
  const explicit = cleanEnv(process.env.MANAGE_SECRET);
  if (explicit) return explicit;
  const derived = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (derived) return `eternal-manage:${derived}`;
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[eternal] MANAGE_SECRET not set and no service key to derive from — manage links will not verify.",
    );
  }
  return "eternal-dev-secret-do-not-use-in-prod";
}

/** Deterministic token for a booking id (hex, 32 chars — 128 bits). */
export function manageToken(bookingId: string): string {
  return createHmac("sha256", secret()).update(bookingId).digest("hex").slice(0, 32);
}

/** Constant-time check that a token matches a booking id. */
export function verifyManageToken(bookingId: string, token: string): boolean {
  if (!token || token.length !== 32) return false;
  const expected = Buffer.from(manageToken(bookingId));
  const given = Buffer.from(token);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

/** Absolute, shareable manage URL for a booking. */
export function manageUrl(bookingId: string, reference: string): string {
  const t = manageToken(bookingId);
  return `${SITE_URL}/manage?ref=${encodeURIComponent(reference)}&t=${t}`;
}
