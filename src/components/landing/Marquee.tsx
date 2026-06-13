import { SparkleIcon } from "../icons";

const ITEMS = [
  "Signature Haircuts",
  "Global Colour",
  "Bridal Artistry",
  "Royal Shaves",
  "Keratin Rituals",
  "Spa Therapies",
  "Groom Makeovers",
  "Skin & Glow",
];

/** M8 — slow 40s uppercase marquee with gold ✦ separators; pauses on hover. */
export function Marquee() {
  const row = (
    <>
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-7 text-[12px] uppercase tracking-[0.3em] text-plum-soft">
            {item}
          </span>
          <SparkleIcon size={14} />
        </span>
      ))}
    </>
  );
  return (
    <div
      className="marquee overflow-hidden border-y border-hairline bg-ivory-deep/60 py-4"
      aria-label="Our services"
    >
      <div className="marquee-track">
        <div className="flex items-center">{row}</div>
        <div className="flex items-center" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}
