"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ScissorsIcon } from "./icons";

const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/#for-him", label: "For Him" },
  { href: "/#for-her", label: "For Her" },
  { href: "/about", label: "About Us" },
  { href: "/#visit", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      // Hide when scrolling down past the header height; show on any scroll up.
      // Never hide while the mobile menu is open or near the top of the page.
      if (!open) {
        if (y > lastY && y > 120) setHidden(true);
        else if (y < lastY) setHidden(false);
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || open
          ? "border-b border-hairline bg-ivory/95 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-6">
        <Link href="/" aria-label="Eternal — home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="strand-link text-[13px] font-normal uppercase tracking-[0.18em] text-plum-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="snip-cta hidden items-center gap-2.5 rounded-[2px] bg-brand-purple-deep px-6 py-3 text-[12.5px] font-normal uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-brand-purple sm:inline-flex"
          >
            <ScissorsIcon size={16} />
            Book Now
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-px w-6 bg-plum-ink transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span className={`block h-px w-6 bg-plum-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span
              className={`block h-px w-6 bg-plum-ink transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-b border-hairline bg-ivory transition-[max-height] duration-500 lg:hidden ${
          open ? "max-h-[420px]" : "max-h-0 border-b-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-5" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-[14px] uppercase tracking-[0.18em] text-plum-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex w-fit items-center gap-2.5 rounded-[2px] bg-brand-purple-deep px-6 py-3 text-[12.5px] uppercase tracking-[0.18em] text-ivory"
          >
            <ScissorsIcon size={16} />
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
