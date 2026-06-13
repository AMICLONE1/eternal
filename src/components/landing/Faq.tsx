import { Reveal } from "../Reveal";
import { SALON } from "@/lib/salon";

/**
 * FAQ — answers real local-intent searches ("salon in Nigdi timings",
 * "unisex salon near me walk-in") and emits FAQPage JSON-LD for rich results.
 */
const FAQS = [
  {
    q: "Where exactly is Eternal salon located in Nigdi?",
    a: `Eternal is at ${SALON.address.line1}, ${SALON.address.line2}, ${SALON.address.city} ${SALON.address.pincode} — in Sector 25, Pradhikaran, a short ride from Akurdi railway station and Bhakti-Shakti Chowk. ${SALON.parkingNote}`,
  },
  {
    q: "Is Eternal a unisex salon?",
    a: "Yes — Eternal is built as a unisex salon from the ground up. Men's and women's services share the same floor, the same product standard and the same stylists, with a dedicated menu for him, for her, and for everyone.",
  },
  {
    q: "Do I need an appointment, or do you take walk-ins?",
    a: "Walk-ins are welcome whenever a chair is free, but we recommend booking online — it takes under a minute, you pick your exact time slot, and the salon receives your booking instantly on WhatsApp.",
  },
  {
    q: "What are Eternal's opening hours?",
    a: "We're open all seven days: Monday to Friday 10:00 am – 8:30 pm, Saturday 9:30 am – 9:00 pm, and Sunday 10:00 am – 8:00 pm.",
  },
  {
    q: "Do you do bridal and groom packages?",
    a: "Yes — signature bridal makeup, bridal trials, groom makeovers and pre-wedding rituals are our flagship services. These are designed on consultation, so book a visit or message us on WhatsApp and we'll plan your dates.",
  },
  {
    q: "How do I change or cancel my booking?",
    a: `Message us on WhatsApp at ${SALON.phoneDisplay} with your booking reference (ETR-XXXXXX) and we'll reschedule you to a slot that works — no charges, no fuss.`,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function Faq() {
  return (
    <section id="faq" className="px-6 py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[840px]">
        <Reveal>
          <p className="eyebrow mb-4 text-gold">Good to know</p>
          <h2 id="faq-heading" className="font-display text-[30px] text-plum-ink md:text-[44px]">
            Questions, answered
          </h2>
        </Reveal>
        <div className="mt-10">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i * 0.05, 0.25)}>
              <details className="faq-item group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-left font-body text-[16px] text-plum-ink transition-colors hover:text-brand-purple md:text-[17.5px] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="select-none text-[20px] font-light leading-none text-gold transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-6 text-[15px] font-light leading-[1.8] text-plum-soft">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
