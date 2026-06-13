/**
 * Editorial artwork placeholders — local SVG compositions in the Ivory
 * Atelier palette. Every slot is documented in docs/CONTENT_MAP.md so the
 * real photo shoot replaces these one-for-one with zero layout change
 * (Design Document §6: explicit dimensions everywhere, no CLS).
 */

type Tone = "plum" | "ivory" | "gold";

const TONES: Record<
  Tone,
  { from: string; to: string; shape: string; line: string }
> = {
  plum: { from: "#3D2A5C", to: "#241638", shape: "#7C4FB5", line: "#C9A227" },
  ivory: { from: "#F3EDE2", to: "#E6DCC8", shape: "#D9CDB8", line: "#C9A227" },
  gold: { from: "#E8D9A8", to: "#D4BC72", shape: "#C9A227", line: "#3D2A5C" },
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

export function Artwork({
  seed,
  tone = "plum",
  label,
  className = "",
}: {
  /** content-map slot id, e.g. "hero", "gallery-3" */
  seed: string;
  tone?: Tone;
  /** accessible description of what the real photo will show */
  label: string;
  className?: string;
}) {
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
