import { SALON } from "@/lib/salon";
import { cleanEnv } from "@/lib/env";
import { Reveal, CombStagger, CombTooth } from "../Reveal";
import { Artwork } from "../Artwork";

/**
 * §5.1-8: latest Instagram posts.
 *
 * Live mode (Behold.so): set BEHOLD_FEED_ID in the environment — the feed
 * JSON is fetched server-side and revalidated hourly, so no third-party
 * script ships to the browser and the tiles keep the Ivory Atelier styling.
 * Fallback mode: branded placeholder tiles linking to the profile.
 */

const PLACEHOLDERS = [
  { seed: "insta-1", tone: "plum" as const, label: "Instagram post — fresh balayage reveal" },
  { seed: "insta-2", tone: "gold" as const, label: "Instagram post — groom makeover backstage" },
  { seed: "insta-3", tone: "ivory" as const, label: "Instagram post — the atelier in morning light" },
  { seed: "insta-4", tone: "gold" as const, label: "Instagram post — bridal trial details" },
  { seed: "insta-5", tone: "plum" as const, label: "Instagram post — precision fade close-up" },
  { seed: "insta-6", tone: "ivory" as const, label: "Instagram post — spa ritual steam" },
];

interface BeholdPost {
  id: string;
  permalink: string;
  caption: string;
  imageUrl: string;
  isVideo: boolean;
}

async function fetchBeholdPosts(): Promise<BeholdPost[]> {
  const feedId = cleanEnv(process.env.BEHOLD_FEED_ID);
  if (!feedId) return [];
  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Behold feed responded ${res.status}`);
    const data = await res.json();
    const posts: unknown[] = Array.isArray(data) ? data : (data.posts ?? []);
    return posts
      .map((raw): BeholdPost | null => {
        const p = raw as {
          id?: string;
          permalink?: string;
          caption?: string;
          prunedCaption?: string;
          mediaUrl?: string;
          thumbnailUrl?: string;
          mediaType?: string;
          sizes?: Record<string, { mediaUrl?: string }>;
        };
        const imageUrl =
          p.sizes?.medium?.mediaUrl ??
          p.sizes?.small?.mediaUrl ??
          p.thumbnailUrl ??
          p.mediaUrl;
        if (!imageUrl || !p.permalink) return null;
        return {
          id: String(p.id ?? p.permalink),
          permalink: p.permalink,
          caption: (p.prunedCaption ?? p.caption ?? "Instagram post from Eternal").slice(0, 120),
          imageUrl,
          isVideo: p.mediaType === "VIDEO" || p.mediaType === "REELS",
        };
      })
      .filter((p): p is BeholdPost => p !== null)
      .slice(0, 6);
  } catch (err) {
    console.warn(
      "[eternal] Behold feed unavailable, showing placeholder tiles:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

export async function InstagramStrip() {
  const posts = await fetchBeholdPosts();

  return (
    <section className="border-y border-hairline bg-ivory-deep/50 py-[72px] md:py-[100px]">
      <div className="mx-auto max-w-[1240px] px-6">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">On Instagram</p>
              <h2 className="font-display text-[26px] font-normal md:text-[36px]">
                Between appointments
              </h2>
            </div>
            <a
              href={SALON.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="strand-link text-[13px] uppercase tracking-[0.18em] text-brand-purple"
            >
              @{SALON.instagram} →
            </a>
          </div>
        </Reveal>

        {posts.length > 0 ? (
          <CombStagger className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
            {posts.map((p) => (
              <CombTooth key={p.id}>
                <a
                  href={p.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.caption}
                  className="keyline sheen relative block aspect-square overflow-hidden bg-ivory-deep"
                >
                  {/* third-party CDN host varies per post — plain img, fixed
                      square box, lazy: no CLS, no remotePatterns lockstep */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={p.caption}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {p.isVideo && (
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-plum-ink/55 text-[10px] text-ivory"
                    >
                      ▶
                    </span>
                  )}
                </a>
              </CombTooth>
            ))}
          </CombStagger>
        ) : (
          <CombStagger className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
            {PLACEHOLDERS.map((p) => (
              <CombTooth key={p.seed}>
                <a
                  href={SALON.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.label}
                  className="keyline sheen block"
                >
                  <Artwork seed={p.seed} tone={p.tone} label={p.label} sizes="(max-width: 768px) 33vw, 16vw" className="aspect-square w-full" />
                </a>
              </CombTooth>
            ))}
          </CombStagger>
        )}
      </div>
    </section>
  );
}
