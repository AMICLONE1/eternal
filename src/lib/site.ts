/**
 * Canonical site URL, hardened against malformed env values (BOM/whitespace
 * from the Vercel CLI on Windows) so new URL(SITE_URL) never throws at build.
 */
import { cleanEnv } from "./env";

// The live deployment. Swap to the custom domain (e.g. eternalforhimandher.com)
// once it's registered and connected in Vercel — and update NEXT_PUBLIC_SITE_URL
// to match. Kept as the fallback so links never point at an unresolvable host.
const FALLBACK = "https://eternalforhimandher.vercel.app";

function resolve(): string {
  const v = cleanEnv(process.env.NEXT_PUBLIC_SITE_URL);
  if (!v) return FALLBACK;
  try {
    return new URL(v).origin;
  } catch {
    return FALLBACK;
  }
}

export const SITE_URL = resolve();
