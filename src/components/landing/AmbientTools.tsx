/**
 * Ambient salon-tool line art — fine 1px strokes drifting very slowly behind
 * the hero (CSS keyframes, disabled under prefers-reduced-motion). Restraint
 * rule (Design Doc §3): this is ONE ambient motion; the hero sheen is the other.
 */

export function AmbientTools() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Open scissors — top right, behind the imagery */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        className="float-slow absolute -right-8 top-[8%] h-44 w-44 text-gold-soft opacity-50 md:right-[2%] md:h-56 md:w-56"
      >
        <circle cx="30" cy="30" r="13" stroke="currentColor" strokeWidth="1" />
        <path d="M41 41 L98 98" stroke="currentColor" strokeWidth="1" />
        <circle cx="30" cy="90" r="13" stroke="currentColor" strokeWidth="1" />
        <path d="M41 79 L98 22" stroke="currentColor" strokeWidth="1" />
        <circle cx="60" cy="60" r="2.5" fill="#C9A227" stroke="none" opacity="0.7" />
      </svg>

      {/* Comb — bottom left */}
      <svg
        viewBox="0 0 140 60"
        fill="none"
        className="float-slower absolute -left-10 bottom-[10%] h-24 w-56 text-gold-soft opacity-40 md:left-[1%]"
      >
        <path d="M8 14 H132 V24 H8 Z" stroke="currentColor" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${16 + i * 10} 24 V${46 + (i % 3) * 3}`} stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>

      {/* The ə thread — faint, center-left */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="float-slow absolute left-[42%] top-[64%] hidden h-28 w-28 text-gold-soft opacity-35 lg:block"
        style={{ animationDelay: "-6s" }}
      >
        <path
          d="M11 21 C 16 20, 28 20, 36 21 C 37 13, 30 8, 23 9.5 M 36 21 C 38 32, 31 40, 23 40 C 15.5 40, 10.5 34.5, 11 27.5 C 11.5 21.5, 17 17.5, 24 18.5"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
