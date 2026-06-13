import Link from "next/link";
import { Reveal } from "../Reveal";
import { EternalDivider } from "../EternalLine";
import { ScissorsIcon } from "../icons";
import { SALON } from "@/lib/salon";

/** Closing brand moment before the footer — deep plum, serif voice, one CTA. */
export function CtaBand() {
  return (
    <section className="bg-brand-purple-deep px-6 py-20 text-center md:py-28">
      <div className="mx-auto max-w-[760px]">
        <Reveal>
          <p className="eyebrow mb-5 text-gold">Open all seven days · {SALON.address.line2}</p>
          <h2 className="font-display text-[32px] leading-[1.15] text-ivory md:text-[50px]">
            Your chair is waiting,{" "}
            <em className="text-gold-soft">eternally patient</em>.
          </h2>
        </Reveal>
        <EternalDivider className="mt-8" />
        <Reveal delay={0.1}>
          <Link
            href="/book"
            className="snip-cta mt-9 inline-flex items-center gap-3 rounded-[2px] bg-gold px-9 py-4 text-[13px] uppercase tracking-[0.18em] text-plum-ink transition-colors duration-300 hover:bg-gold-soft"
          >
            <ScissorsIcon size={18} />
            Reserve Your Chair
          </Link>
          <p className="mt-7 text-[13px] font-light tracking-wide text-ivory/70">
            Booked in under a minute · We confirm on WhatsApp
          </p>
        </Reveal>
      </div>
    </section>
  );
}
