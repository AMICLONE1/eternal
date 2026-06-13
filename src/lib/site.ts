/**
 * Canonical site URL, hardened against malformed env values (BOM/whitespace
 * from the Vercel CLI on Windows) so new URL(SITE_URL) never throws at build.
 */
import { cleanEnv } from "./env";

const FALLBACK = "https://eternalforhimandher.com";

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
