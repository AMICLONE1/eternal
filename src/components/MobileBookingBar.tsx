"use client";

/**
 * Slim sticky booking bar — mobile only. On a salon site "book" is the one
 * action that matters; on phones the FAB is easy to miss, so this gives a
 * persistent, thumb-reachable path once the user scrolls past the hero.
 * Hidden on the booking flow itself (it has its own sticky action bar) and
 * on desktop (sm+), where the header CTA is always visible.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScissorsIcon } from "./icons";

export function MobileBookingBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Reveal only after the hero is mostly scrolled away, so it doesn't
    // compete with the hero's own "Reserve Your Chair" button.
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/book")) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-ivory/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm transition-transform duration-500 ease-atelier sm:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/book"
        className="snip-cta flex items-center justify-center gap-2.5 rounded-[2px] bg-brand-purple py-3.5 text-[13px] uppercase tracking-[0.18em] text-ivory active:bg-brand-purple-deep"
      >
        <ScissorsIcon size={18} />
        Reserve Your Chair
      </Link>
    </div>
  );
}
