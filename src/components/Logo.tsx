/**
 * Eternal brand lockup — faithful to the client's logo (brand-assets/).
 *
 * The wordmark reads "eternal": the first three letters "ete" are gold and
 * set tight so the two rounded Quicksand "e"s + the "t" between them flow
 * into the brand's infinity loop; "rnal" continues in ink/ivory. A hairline
 * rule and the "FOR HIM & HER" descriptor sit beneath.
 *
 * Built from live text in the logo's rounded face (Quicksand) rather than a
 * traced path, so it stays razor-sharp at every size and the colour split is
 * exact. The client's original raster is kept in brand-assets/ for reference.
 */

const GOLD = "#E2A32D";

export function Logo({
  tone = "ink",
  className = "",
  withTagline = true,
}: {
  tone?: "ink" | "ivory";
  className?: string;
  withTagline?: boolean;
}) {
  const rest = tone === "ivory" ? "text-ivory" : "text-plum-ink";
  const tagline = tone === "ivory" ? "text-ivory/80" : "text-plum-soft";
  const rule = tone === "ivory" ? "bg-ivory/40" : "bg-hairline";
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className="font-brand text-[27px] font-semibold lowercase leading-none"
        style={{ fontFamily: "var(--font-brand)" }}
        aria-label="eternal"
      >
        <span className="tracking-[-0.06em]" style={{ color: GOLD }}>
          ete
        </span>
        <span className={`tracking-[0.01em] ${rest}`}>rnal</span>
      </span>
      {withTagline && (
        <>
          <span aria-hidden="true" className={`mt-[7px] block h-px w-full ${rule}`} />
          <span
            aria-hidden="true"
            className={`mt-[6px] block font-body text-[8px] font-normal uppercase tracking-[0.34em] ${tagline}`}
          >
            For Him &amp; Her
          </span>
        </>
      )}
    </span>
  );
}

/** Square brand tile (avatar form) — purple field, full lockup. */
export function LogoBadge({ size = 96, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-brand-purple ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Logo tone="ivory" className="scale-90" />
    </span>
  );
}
