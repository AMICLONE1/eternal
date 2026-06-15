/**
 * Editorial artwork slots. If a real photo exists for this seed (a file
 * named <seed>.jpg/.png/.webp/.avif dropped into public/photos/, picked up
 * by scripts/photo-manifest.mjs at build time) it is shown; otherwise a
 * designed SVG placeholder in the Ivory Atelier palette renders in its place.
 * Either way the box keeps the same dimensions — no layout shift, no CLS
 * (Design Document §6). See docs/CONTENT_MAP.md for the slot list.
 */
import Image from "next/image";
import { PHOTO_MANIFEST } from "@/lib/photo-manifest";

type Tone = "plum" | "ivory" | "gold";

const TONES: Record<
  Tone,
  { from: string; to: string; shape: string; line: string }
> = {
  plum: { from: "#3D2A5C", to: "#241638", shape: "#7C4FB5", line: "#C9A227" },
  ivory: { from: "#F3EDE2", to: "#E6DCC8", shape: "#D9CDB8", line: "#C9A227" },
  gold: { from: "#E8D9A8", to: "#D4BC72", shape: "#C9A227", line: "#3D2A5C" },
};

/** Warm ivory blur placeholder (1×1 #e6dcc8) — fades up before the real
 *  photo decodes. Pre-encoded so it works in client bundles too (no Buffer). */
const BLUR_DATA =
  "data:image/gif;base64,R0lGODlhAQABAPABAObcyAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

/** Readability scrims, anchored to the edge where overlaid text sits. */
const SCRIMS: Record<Exclude<Scrim, "none">, string> = {
  bottom: "bg-gradient-to-t from-plum-ink/55 via-plum-ink/10 to-transparent",
  top: "bg-gradient-to-b from-plum-ink/45 via-transparent to-transparent",
  full: "bg-plum-ink/30",
};

/** Deterministic pseudo-random from a string seed, so art varies per slot. */
function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Where overlaid text sits, so we lay a readability scrim from that edge. */
type Scrim = "none" | "bottom" | "top" | "full";

export function Artwork({
  seed,
  tone = "plum",
  label,
  className = "",
  priority = false,
  scrim = "none",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  /** content-map slot id, e.g. "hero", "gallery-3" */
  seed: string;
  tone?: Tone;
  /** accessible description of what the real photo will show */
  label: string;
  className?: string;
  /** eager-load + high priority (use for the hero / above-the-fold only) */
  priority?: boolean;
  /** dark gradient scrim for text legibility over the photo */
  scrim?: Scrim;
  /** responsive sizes hint; override when the slot isn't ~half the viewport */
  sizes?: string;
}) {
  // Real photo dropped into public/photos/<seed>.<ext>? Show it.
  const photo = PHOTO_MANIFEST[seed.toLowerCase()];
  if (photo) {
    return (
      <div className={`group/aw relative overflow-hidden ${className}`}>
        <Image
          src={photo}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA}
          // Unified warm "atelier" grade + a slow, quiet zoom on hover so the
          // amateur source photos read as one intentional, premium set.
          className="object-cover filter-[saturate(1.06)_contrast(1.04)_brightness(1.01)] transition-transform duration-1200 ease-atelier group-hover/aw:scale-[1.045]"
        />
        {scrim !== "none" && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${SCRIMS[scrim]}`}
          />
        )}
      </div>
    );
  }

  const t = TONES[tone];
  const h = hash(seed);
  const cx = 25 + (h % 50);
  const cy = 30 + ((h >> 3) % 40);
  const r1 = 28 + ((h >> 5) % 22);
  const rot = (h >> 7) % 360;
  const id = `aw-${seed.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div
      role="img"
      aria-label={label}
      className={`grain relative overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 100 125"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1.2">
            <stop offset="0%" stopColor={t.from} />
            <stop offset="100%" stopColor={t.to} />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor={t.shape} stopOpacity="0.55" />
            <stop offset="100%" stopColor={t.shape} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="125" fill={`url(#${id}-bg)`} />
        <circle cx={cx} cy={cy} r={r1} fill={`url(#${id}-glow)`} />
        <g transform={`rotate(${rot} 50 62)`} opacity="0.5">
          <circle cx="50" cy="62" r="34" fill="none" stroke={t.shape} strokeWidth="0.5" />
          <circle cx="50" cy="62" r="44" fill="none" stroke={t.shape} strokeWidth="0.35" opacity="0.6" />
        </g>
        {/* the ə motif, drawn large and cropped — the brand thread */}
        <path
          d="M28 56 C 40 53.5, 62 53.5, 76 56 C 78 41, 65 32, 52 35 M 76 56 C 80 77, 67 92, 51 92 C 36.5 92, 27 81.5, 28 68 C 29 56.5, 39 49, 53 51"
          fill="none"
          stroke={t.line}
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
          transform={`translate(${(h % 9) - 4} ${((h >> 4) % 9) - 4})`}
        />
      </svg>
    </div>
  );
}
