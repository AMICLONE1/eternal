"use client";

/**
 * Site-wide floating actions: a "Book Now" button stacked above a
 * "Chat on WhatsApp" button (FR-7). Hidden entirely on the booking flow
 * (/book) so they never overlap the sticky Continue/Review bar.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waChatLink } from "@/lib/salon";
import { WhatsAppIcon, ScissorsIcon } from "./icons";

export function FloatingActions() {
  const pathname = usePathname();

  // No floating buttons inside the booking flow — the wizard has its own
  // sticky action bar, and these would sit on top of it.
  if (pathname?.startsWith("/book")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <Link
        href="/book"
        aria-label="Book an appointment"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple text-ivory shadow-[0_4px_24px_rgba(124,79,181,0.4)] transition-transform duration-300 hover:scale-105"
      >
        <ScissorsIcon size={24} />
        <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-[2px] bg-plum-ink px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
          Book Now
        </span>
      </Link>

      <a
        href={waChatLink("Hi Eternal! I'd like to know more about your services.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Eternal on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple-deep text-ivory shadow-[0_4px_24px_rgba(46,31,71,0.35)] transition-transform duration-300 hover:scale-105"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  );
}
