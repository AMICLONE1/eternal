"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../Reveal";
import { StarIcon } from "../icons";

/** Manual entries for Phase 1 (PRD §5.1-7); Google auto-sync is Phase 2. */
const REVIEWS = [
  {
    quote:
      "Walked in for a simple haircut, walked out feeling like a new person. The attention to detail here is something else.",
    name: "Rohan K.",
    detail: "Signature Haircut · Google review",
  },
  {
    quote:
      "My bridal trial was so thoughtful — they listened more than they talked. On the wedding day everything was exactly right.",
    name: "Sneha P.",
    detail: "Bridal Makeup · Google review",
  },
  {
    quote:
      "Finally a salon in Nigdi where men's grooming is taken as seriously as it should be. The royal shave is worth every rupee.",
    name: "Amit D.",
    detail: "Royal Shave · Google review",
  },
  {
    quote:
      "Booked online in under a minute, got a confirmation instantly. The keratin treatment has my hair behaving for the first time ever.",
    name: "Priya S.",
    detail: "Keratin Smoothening · Google review",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const review = REVIEWS[index];

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-[72px] md:py-[120px]">
      <Reveal>
        <p className="eyebrow mb-5 text-center">Word of Mouth</p>
      </Reveal>

      <div className="relative mx-auto min-h-[260px] max-w-[760px] text-center md:min-h-[230px]">
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
            <footer className="mt-6">
              <div className="mb-2 flex justify-center gap-1 text-gold" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={15} />
                ))}
              </div>
              <p className="text-[14px] uppercase tracking-[0.18em]">{review.name}</p>
              <p className="mt-1 text-[12.5px] text-plum-soft">{review.detail}</p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-2.5" role="tablist" aria-label="Reviews">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Review ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              i === index ? "bg-gold" : "bg-hairline hover:bg-gold-soft"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
