/**
 * Canonical site URL, hardened against malformed env values.
 *
 * Some tooling (notably the Vercel CLI on Windows) can store env vars with a
 * leading UTF-8 BOM or stray whitespace, which makes `new URL(SITE_URL)` throw
 * "Invalid URL" during the build. Strip those before anyone uses the value.
 */
const FALLBACK = "https://eternalforhimandher.com";

// BOM (FEFF) + zero-width chars (200B-200D) + word-joiner (2060)
const INVISIBLE = /[\uFEFF\u200B-\u200D\u2060]/g;

function clean(raw: string | undefined): string {
  if (!raw) return FALLBACK;
  const trimmed = raw
    .replace(INVISIBLE, "")
    .trim()
    .replace(/^["']|["']$/g, "");
  try {
    return new URL(trimmed).origin;
  } catch {
    return FALLBACK;
  }
}

export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL);
