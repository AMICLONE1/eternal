"use client";

/**
 * Motion primitives. Default feel per Design Document §3: 0.7s,
 * cubic-bezier(0.22, 1, 0.36, 1), 80ms stagger. framer-motion's
 * useReducedMotion handles the opacity-only fallback.
 */
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade-up reveal when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** M4 — Comb-teeth stagger: children rise 24px in quick 80ms succession. */
export function CombStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </motion.div>
  );
}

export function CombTooth({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/** M7 — Breeze reveal: words rise & settle with slight lateral drift. */
export function BreezeHeadline({
  text,
  italicWords = [],
  className = "",
  as: Tag = "h1",
}: {
  text: string;
  /** lowercase words rendered in serif italic (emotive words per type spec) */
  italicWords?: string[];
  className?: string;
  as?: "h1" | "h2";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = Tag === "h1" ? motion.h1 : motion.h2;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
    >
      {words.map((word, i) => {
        const clean = word.toLowerCase().replace(/[^a-zəA-Z]/g, "");
        const italic = italicWords.includes(clean);
        return (
          <motion.span
            key={`${word}-${i}`}
            className={`inline-block whitespace-pre ${italic ? "italic text-brand-purple" : ""}`}
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 28, x: reduce ? 0 : i % 2 ? 3 : -2 },
              show: {
                opacity: 1,
                y: 0,
                x: 0,
                transition: { duration: 0.8, ease: EASE },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
