"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BreezeHeadline } from "../Reveal";
import { EternalUnderline } from "../EternalLine";
import { Artwork } from "../Artwork";
import { ScissorsIcon } from "../icons";
import { AmbientTools } from "./AmbientTools";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pt-[72px]">
      <AmbientTools />
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="relative z-10">
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            For Him &amp; Her · Nigdi, Pune
          </motion.p>

          <BreezeHeadline
            text="Beauty that lasts, eternally yours."
            italicWords={["eternally"]}
            className="font-display text-[40px] font-normal leading-[1.08] md:text-[58px] lg:text-[72px]"
          />
          <EternalUnderline className="mt-3 h-7 w-[240px] md:w-[320px]" />

          <motion.p
            className="mt-7 max-w-[460px] text-plum-soft"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            A premium unisex salon in the heart of Pradhikaran — expert cuts,
            colour, skin and bridal artistry, in a chair that feels like it was
            kept just for you.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/book"
              className="snip-cta inline-flex items-center gap-3 rounded-[2px] bg-brand-purple px-8 py-4 text-[13px] uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-brand-purple-deep"
            >
              <ScissorsIcon size={18} />
              Reserve Your Chair
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center rounded-[2px] border border-gold px-8 py-4 text-[13px] uppercase tracking-[0.18em] text-plum-ink transition-colors duration-300 hover:bg-gold-soft/40"
            >
              View Services
            </Link>
          </motion.div>
        </div>

        {/* Hero imagery — content-map slot "hero". Slightly landscape so a
            wide photo fills cleanly; gentle portrait on small phones. */}
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="keyline sheen">
            <Artwork
              seed="hero"
              tone="plum"
              priority
              label="The Eternal salon floor — a styling chair before a gold-lit mirror"
              className="aspect-[5/4] w-full xs:aspect-[4/3] md:aspect-[16/11]"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden h-24 w-24 border border-gold-soft md:block" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
