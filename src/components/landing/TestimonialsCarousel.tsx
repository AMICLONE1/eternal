"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../Reveal";
import { StarIcon } from "../icons";
import type { Review } from "@/lib/google-reviews";

export function TestimonialsCarousel({
  reviews,
  source,
  rating,
  total,
}: {
  reviews: Review[];
  /** "google" when live, "curated" when fallback */
  source: "google" | "curated";
  rating: number | null;
  total: number | null;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const review = reviews[index];

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-[72px] md:py-[120px]">
      <Reveal>
        <p className="eyebrow mb-3 text-center">Word of Mouth</p>
      </Reveal>

      {source === "google" && rating !== null && (
        <Reveal delay={0.05}>
          <p className="mb-2 flex items-center justify-center gap-2 text-center text-[13px] text-plum-soft">
            <span className="flex gap-0.5 text-gold" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={14} />
              ))}
            </span>
            <span className="font-medium text-plum-ink">{rating.toFixed(1)}</span>
            {total !== null && <span>· {total} Google reviews</span>}
          </p>
        </Reveal>
      )}

      <div className="relative mx-auto min-h-[300px] max-w-[760px] text-center md:min-h-[260px]">
        <span
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 font-display text-[120px] leading-none text-gold-soft"
          aria-hidden="true"
        >
          &ldquo;
        </span>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative pt-10"
          >
            <p className="font-display text-[22px] font-normal italic leading-[1.5] text-plum-ink md:text-[28px]">
              {review.quote}
            </p>
            <footer className="mt-6 flex flex-col items-center">
              <div className="mb-2 flex justify-center gap-1 text-gold" role="img" aria-label={`${review.rating} star rating`}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <StarIcon key={i} size={15} />
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                {review.avatar && (
                  <Image
                    src={review.avatar}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full"
                    unoptimized
                  />
                )}
                <p className="text-[14px] uppercase tracking-[0.18em]">{review.name}</p>
              </div>
              <p className="mt-1 text-[12.5px] text-plum-soft">{review.detail}</p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
        <div className="mt-6 flex justify-center" role="tablist" aria-label="Reviews">
          {reviews.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Review ${i + 1}`}
              onClick={() => setIndex(i)}
              // 24px hit target (a11y) wrapping an 8px visual dot.
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  i === index ? "bg-gold" : "bg-hairline group-hover:bg-gold-soft"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
