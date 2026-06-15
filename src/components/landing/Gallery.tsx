"use client";

import { useRef, useState, useCallback } from "react";
import { Reveal, CombStagger, CombTooth } from "../Reveal";
import { Artwork } from "../Artwork";

const TILES = [
  { seed: "gallery-1", tone: "plum" as const, label: "Layered cut, soft waves — her transformation", tall: true },
  { seed: "gallery-2", tone: "ivory" as const, label: "Skin ritual — glow facial in progress" },
  { seed: "gallery-3", tone: "gold" as const, label: "Balayage detail — hand-painted dimension", tall: true },
  { seed: "gallery-4", tone: "plum" as const, label: "Classic fade with sculpted beard — his look" },
  { seed: "gallery-5", tone: "gold" as const, label: "Bridal updo — the final pin" },
  { seed: "gallery-6", tone: "ivory" as const, label: "The atelier — chairs, mirrors, morning light", tall: true },
];

/** M9 — Before/After wipe with a draggable gold ə handle. */
function BeforeAfter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const updateFromX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  return (
    <div
      ref={trackRef}
      className="keyline relative aspect-[16/10] w-full touch-none select-none overflow-hidden"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateFromX(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && updateFromX(e.clientX)}
    >
      <Artwork
        seed="before"
        tone="ivory"
        label="Before — natural hair, unstyled"
        className="absolute inset-0 h-full w-full"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Artwork
          seed="after"
          tone="plum"
          label="After — finished colour and style"
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-[2px] bg-ivory/85 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-plum-ink">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-[2px] bg-plum-ink/75 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-ivory">
        After
      </span>

      {/* gold divider + miniature ə handle */}
      <div
        className="absolute inset-y-0 z-10 w-[2px] bg-gold"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      />
      <input
        type="range"
        min={4}
        max={96}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Reveal before and after"
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
      <div
        className="pointer-events-none absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-ivory font-display text-[20px] text-gold"
        style={{ left: `${pos}%`, top: "50%" }}
        aria-hidden="true"
      >
        ə
      </div>
    </div>
  );
}

/** §5.1-6: masonry gallery + before/after slider. */
export function Gallery() {
  return (
    <section className="border-y border-hairline bg-ivory-deep/50 py-[72px] md:py-[120px]">
      <div className="mx-auto max-w-[1240px] px-6">
        <Reveal>
          <p className="eyebrow mb-5 text-center">The Work</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-center font-display text-[30px] font-normal leading-[1.15] md:text-[48px]">
            Proof, in <span className="italic text-brand-purple">every strand</span>.
          </h2>
        </Reveal>

        <CombStagger className="mt-14 columns-2 gap-5 lg:columns-3 [&>*]:mb-5">
          {TILES.map((t) => (
            <CombTooth key={t.seed} className="break-inside-avoid">
              <div className="keyline sheen group relative">
                <Artwork
                  seed={t.seed}
                  tone={t.tone}
                  label={t.label}
                  scrim="bottom"
                  className={`w-full ${t.tall ? "aspect-[4/5]" : "aspect-square"}`}
                />
                {/* Caption fades up on hover — quiet editorial reveal. */}
                <p className="pointer-events-none absolute inset-x-4 bottom-3 z-3 translate-y-2 text-[12.5px] leading-snug text-ivory opacity-0 transition-all duration-500 ease-atelier group-hover:translate-y-0 group-hover:opacity-100">
                  {t.label}
                </p>
              </div>
            </CombTooth>
          ))}
        </CombStagger>

        <Reveal className="mt-14">
          <p className="eyebrow mb-5 text-center">Slide to see the change</p>
          <div className="mx-auto max-w-[860px]">
            <BeforeAfter />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
