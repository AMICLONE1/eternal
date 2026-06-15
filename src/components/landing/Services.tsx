"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  SERVICES,
  formatDuration,
  formatPrice,
  servicesByCategory,
  type Category,
} from "@/lib/services";
import { ServiceIcon, ClockIcon } from "../icons";
import { Reveal, CombStagger, CombTooth } from "../Reveal";
import { MenuOverlay } from "./MenuOverlay";

const TABS: Category[] = ["him", "her", "everyone"];

/**
 * §5.1-4: tabbed services with duotone icons; FR-9 deep-links into /book.
 * The grid shows only featured picks (6 per tab) so the landing page stays
 * short; the complete 45-service menu opens in MenuOverlay.
 */
export function Services() {
  const [tab, setTab] = useState<Category>("him");
  const [menuOpen, setMenuOpen] = useState(false);
  const services = servicesByCategory(tab).filter((s) => s.featured);

  return (
    <section
      id="services"
      className="border-y border-hairline bg-ivory-deep/50 py-[72px] md:py-[120px]"
    >
      <div className="mx-auto max-w-[1240px] px-6">
        <Reveal>
          <p className="eyebrow mb-5 text-center">The Menu</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-center font-display text-[30px] font-normal leading-[1.15] md:text-[48px]">
            Crafted for <span className="italic text-brand-purple">him</span>,
            curated for <span className="italic text-brand-purple">her</span>.
          </h2>
        </Reveal>

        {/* anchor targets for nav */}
        <span id="for-him" className="sr-only" />
        <span id="for-her" className="sr-only" />

        <Reveal delay={0.15}>
          <div
            role="tablist"
            aria-label="Service categories"
            className="mt-10 flex justify-center gap-2"
          >
            {TABS.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={tab === c}
                onClick={() => setTab(c)}
                className={`rounded-[2px] border px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 sm:px-7 ${
                  tab === c
                    ? "border-brand-purple bg-brand-purple text-ivory"
                    : "border-hairline bg-ivory text-plum-soft hover:border-gold-soft"
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Mobile (<sm): compact rows — keeps the section short on phones.
            sm+: the spacious editorial cards. */}
        <CombStagger key={tab} className="mt-9 flex flex-col gap-3 sm:hidden">
          {services.map((s) => (
            <CombTooth key={s.slug}>
              <Link
                href={`/book?service=${s.slug}`}
                className="keyline flex items-center gap-3.5 border border-hairline bg-ivory p-3.5 active:bg-ivory-deep/60"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ivory-deep text-plum-ink">
                  <ServiceIcon name={s.icon} size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[18px] font-medium leading-tight text-plum-ink">
                    {s.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[12px] uppercase tracking-[0.1em] text-plum-soft">
                    <ClockIcon size={13} />
                    {formatDuration(s.durationMin)}
                  </span>
                </span>
                <span className="flex flex-none flex-col items-end">
                  <span className="font-display text-[19px] leading-none text-plum-ink">
                    {formatPrice(s.price)}
                  </span>
                  <span className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-brand-purple">
                    Book →
                  </span>
                </span>
              </Link>
            </CombTooth>
          ))}
        </CombStagger>

        <CombStagger
          key={`${tab}-grid`}
          className="mt-12 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <CombTooth key={s.slug}>
              <article className="keyline group flex h-full flex-col border border-hairline bg-ivory p-7 transition-[transform,border-color,box-shadow] duration-300 ease-atelier hover:-translate-y-1 hover:border-gold-soft hover:shadow-[0_18px_40px_-24px_rgba(46,31,71,0.45)]">
                <div className="flex items-start justify-between">
                  <span className="text-plum-ink">
                    <ServiceIcon name={s.icon} size={28} />
                  </span>
                  <span className="font-display text-[22px] text-plum-ink">
                    {formatPrice(s.price)}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[22px] font-medium leading-snug">
                  {s.name}
                </h3>
                {s.description && (
                  <p className="mt-2 text-[14.5px] text-plum-soft">{s.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="flex items-center gap-1.5 text-[12.5px] uppercase tracking-[0.12em] text-plum-soft">
                    <ClockIcon size={15} />
                    {formatDuration(s.durationMin)}
                  </span>
                  <Link
                    href={`/book?service=${s.slug}`}
                    className="strand-link text-[12.5px] uppercase tracking-[0.18em] text-brand-purple"
                  >
                    Book this →
                  </Link>
                </div>
              </article>
            </CombTooth>
          ))}
        </CombStagger>

        <Reveal>
          <div className="mt-9 text-center md:mt-12">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex w-full items-center justify-center gap-3 rounded-[2px] border border-gold px-8 py-4 text-[12.5px] uppercase tracking-[0.18em] text-plum-ink transition-colors duration-300 hover:bg-gold-soft/40 sm:w-auto md:text-[13px]"
            >
              View the complete menu
              <span className="font-display text-[15px] text-gold">
                {SERVICES.length} services
              </span>
            </button>
            <p className="mt-5 text-[13.5px] text-plum-soft">
              Prices shown are indicative and will be confirmed at the salon.
            </p>
          </div>
        </Reveal>
      </div>

      <MenuOverlay
        open={menuOpen}
        tab={tab}
        onTabChange={setTab}
        onClose={() => setMenuOpen(false)}
      />
    </section>
  );
}
