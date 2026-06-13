"use client";

/**
 * The complete service menu in a full-screen overlay — keeps the landing
 * page short (only featured services in the grid) while the whole menu is
 * one tap away. Slides up like a mirror panel (M10 family), locks body
 * scroll, closes on Esc / backdrop, and returns focus to the opener.
 */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CATEGORY_LABELS,
  formatDuration,
  formatPrice,
  groupedServices,
  servicesByCategory,
  type Category,
} from "@/lib/services";
import { ServiceIcon } from "../icons";

const TABS: Category[] = ["him", "her", "everyone"];
const EASE = [0.22, 1, 0.36, 1] as const;

export function MenuOverlay({
  open,
  tab,
  onTabChange,
  onClose,
}: {
  open: boolean;
  tab: Category;
  onTabChange: (c: Category) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* backdrop */}
          <button
            aria-label="Close menu"
            className="absolute inset-0 cursor-default bg-plum-ink/45 backdrop-blur-[2px]"
            onClick={onClose}
            tabIndex={-1}
          />
          {/* panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Complete service menu"
            tabIndex={-1}
            className="relative flex h-[92dvh] w-full max-w-[920px] flex-col border border-gold-soft bg-ivory outline-none md:h-[86vh]"
            initial={{ y: reduce ? 0 : 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : 32, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4 md:px-9">
              <div>
                <p className="eyebrow text-gold">The Complete Menu</p>
                <h3 className="mt-1 font-display text-[24px] leading-none text-plum-ink md:text-[30px]">
                  Every service, every price
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center border border-hairline text-[20px] font-light text-plum-ink transition-colors hover:border-gold hover:text-brand-purple"
                aria-label="Close the menu"
              >
                ×
              </button>
            </div>

            {/* tabs */}
            <div
              role="tablist"
              aria-label="Menu categories"
              className="flex gap-2 border-b border-hairline px-6 py-3 md:px-9"
            >
              {TABS.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={tab === c}
                  onClick={() => onTabChange(c)}
                  className={`rounded-[2px] border px-4 py-2 text-[11.5px] uppercase tracking-[0.16em] transition-colors duration-300 sm:px-6 ${
                    tab === c
                      ? "border-brand-purple bg-brand-purple text-ivory"
                      : "border-hairline bg-ivory text-plum-soft hover:border-gold-soft"
                  }`}
                >
                  {CATEGORY_LABELS[c]}
                  <span className="ml-2 text-[10px] opacity-70">
                    {servicesByCategory(c).length}
                  </span>
                </button>
              ))}
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8 md:px-9">
              {groupedServices(tab).map(({ group, services }) => (
                <div key={group}>
                  <h4 className="eyebrow sticky top-0 z-10 -mx-2 bg-ivory px-2 pb-3 pt-6 text-gold">
                    {group}
                  </h4>
                  <ul className="divide-y divide-hairline border-t border-hairline">
                    {services.map((s) => (
                      <li key={s.slug} className="flex items-center gap-4 py-4">
                        <span className="hidden text-plum-ink sm:block">
                          <ServiceIcon name={s.icon} size={24} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-body text-[15.5px] text-plum-ink">{s.name}</p>
                          {s.description && (
                            <p className="mt-0.5 truncate text-[13px] font-light text-plum-soft">
                              {s.description}
                            </p>
                          )}
                        </div>
                        <span className="hidden whitespace-nowrap text-[12px] uppercase tracking-[0.12em] text-plum-soft md:block">
                          {formatDuration(s.durationMin)}
                        </span>
                        <span className="w-[110px] whitespace-nowrap text-right font-display text-[18px] text-plum-ink">
                          {formatPrice(s.price)}
                        </span>
                        <Link
                          href={`/book?service=${s.slug}`}
                          className="snip-cta whitespace-nowrap rounded-[2px] border border-brand-purple px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] text-brand-purple transition-colors duration-300 hover:bg-brand-purple hover:text-ivory"
                        >
                          Book
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="pt-6 text-center text-[12.5px] font-light text-plum-soft">
                Prices are indicative and confirmed at the salon. Bridal &amp; groom
                packages are designed on consultation.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
