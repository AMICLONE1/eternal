import Link from "next/link";
import { SALON, waChatLink } from "@/lib/salon";
import { Reveal } from "../Reveal";
import { PinIcon, PhoneIcon, ClockIcon, WhatsAppIcon } from "../icons";

/** §5.1-9: address, hours, phone, embedded map, parking note. */
export function VisitUs() {
  return (
    <section id="visit" className="mx-auto max-w-[1240px] px-6 py-[72px] md:py-[120px]">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Visit Us</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[30px] font-normal leading-[1.15] md:text-[48px]">
              Your chair is <span className="italic text-brand-purple">waiting</span>.
            </h2>
          </Reveal>

          <div className="mt-10 flex flex-col gap-7">
            <Reveal delay={0.12}>
              <div className="flex gap-4">
                <span className="mt-1 shrink-0 text-plum-ink"><PinIcon size={18} /></span>
                <div>
                  <h3 className="text-[13px] uppercase tracking-[0.18em]">Address</h3>
                  <p className="mt-1.5 text-plum-soft">
                    {SALON.address.line1}, {SALON.address.line2},<br />
                    {SALON.address.city}, {SALON.address.state} {SALON.address.pincode}
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-plum-soft">{SALON.parkingNote}</p>
                  <a
                    href={SALON.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="strand-link mt-2 inline-block text-[12.5px] uppercase tracking-[0.18em] text-brand-purple"
                  >
                    Get directions →
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex gap-4">
                <span className="mt-1 shrink-0 text-plum-ink"><ClockIcon size={18} /></span>
                <div>
                  <h3 className="text-[13px] uppercase tracking-[0.18em]">Hours</h3>
                  <dl className="mt-1.5">
                    {SALON.hoursDisplay.map((h) => (
                      <div key={h.days} className="flex gap-6 text-plum-soft">
                        <dt className="w-24 shrink-0">{h.days}</dt>
                        <dd>{h.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex gap-4">
                <span className="mt-1 shrink-0 text-plum-ink"><PhoneIcon size={18} /></span>
                <div>
                  <h3 className="text-[13px] uppercase tracking-[0.18em]">Talk to us</h3>
                  <a href={`tel:${SALON.phoneE164}`} className="mt-1.5 block text-plum-soft hover:text-brand-purple">
                    {SALON.phoneDisplay}
                  </a>
                  <a
                    href={waChatLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 text-plum-soft hover:text-brand-purple"
                  >
                    <WhatsAppIcon size={16} /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <Link
                href="/book"
                className="snip-cta mt-2 inline-flex w-fit items-center gap-3 rounded-[2px] bg-brand-purple px-8 py-4 text-[13px] uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-brand-purple-deep"
              >
                Reserve Your Chair
              </Link>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="keyline h-[320px] overflow-hidden lg:h-full lg:min-h-[480px]">
            <iframe
              src={SALON.mapsEmbedUrl}
              title="Map — Eternal salon, Sector 25, Pradhikaran, Nigdi, Pune"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
