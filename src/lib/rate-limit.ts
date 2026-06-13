/**
 * Per-IP rate limit: 5 bookings / hour (TRD §5).
 * In-memory sliding window — adequate for a single Vercel region at salon
 * volume; swap for Upstash Redis if traffic ever justifies it.
 */
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

const globalForRl = globalThis as unknown as { __eternalHits?: Map<string, number[]> };
const hits = (globalForRl.__eternalHits ??= new Map());

export function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t: number) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
