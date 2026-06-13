import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { Artwork } from "@/components/Artwork";
import { Reveal } from "@/components/Reveal";
import { EternalUnderline } from "@/components/EternalLine";
import { SALON } from "@/lib/salon";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eternalforhimandher.com";

export const metadata: Metadata = {
  title: "About Us — The Story of Eternal",
  description:
    "Who we are and why Eternal exists: a premium unisex salon in Pradhikaran, Nigdi, Pune, built on one belief — beauty that lasts, for him and for her, in equal measure.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Eternal — For Him & Her",
    description:
      "The story and philosophy behind Nigdi's premium unisex salon.",
    url: `${SITE_URL}/about`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: "About Eternal — For Him & Her",
      url: `${SITE_URL}/about`,
      description:
        "The story, philosophy and journey of Eternal, a premium unisex salon in Pradhikaran, Nigdi, Pune.",
      mainEntity: { "@id": `${SITE_URL}/#salon` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About Us", item: `${SITE_URL}/about` },
      ],
    },
  ],
};

/* Journey chapters — replace the copy with the client's real history when it
   arrives; the structure (Eternal Line with gold nodes) stays. */
const JOURNEY = [
  {
    title: "A question, asked in a chair",
    text: "Eternal began with a simple observation: in most salons, one half of the room is an afterthought. Men's grooming squeezed into a corner, or women's artistry behind a partition. We wanted one room, one standard, one welcome — for him and for her, equally.",
  },
  {
    title: "The atelier takes shape",
    text: "We chose Pradhikaran deliberately. Nigdi deserved the kind of salon people were driving into the city for — the calm, the craft, the unhurried appointment — minutes from home instead of an hour away.",
  },
  {
    title: "Craft before everything",
    text: "Every stylist at Eternal trains across both halves of the menu. Precision barbering informs how we cut layers; bridal artistry sharpens how we sculpt a beard. The craft compounds, and our guests feel it.",
  },
  {
    title: "Today — and what stays the same",
    text: "The tools get better, the menu grows, the chairs fill. What doesn't change is the promise in our name: work that holds up after the photographs, the kind of finish you stop noticing because it simply becomes you. Eternally yours.",
  },
];

const VALUES = [
  {
    title: "One standard, two chairs",
    text: "Unisex isn't a tagline here; it's the founding idea. The same products, the same patience, the same price honesty — whoever is in the chair.",
  },
  {
    title: "Time, respected",
    text: "Appointments that start when they're booked. A consultation before every first cut. No rushing the last client of the day.",
  },
  {
    title: "Beauty that lasts",
    text: "We'd rather give you a cut that grows out gracefully over eight weeks than a style that survives one wash. Lasting is the brand.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* ——— Editorial opening ——— */}
        <section className="px-6 pb-16 pt-36 md:pb-24 md:pt-44">
          <div className="mx-auto max-w-[1240px]">
            <p className="eyebrow mb-5 text-gold">About Eternal · Nigdi, Pune</p>
            <h1 className="font-display text-[40px] leading-[1.08] text-plum-ink md:max-w-[16ch] md:text-[64px]">
              One room. One standard.{" "}
              <em className="text-brand-purple">For him</em> and{" "}
              <em className="text-brand-purple">for her</em>.
            </h1>
            <EternalUnderline className="mt-6 h-7 w-[220px] md:w-[300px]" />
          </div>
        </section>

        {/* ——— Who we are ——— */}
        <section className="border-y border-hairline bg-ivory-deep/60 px-6 py-16 md:py-24">
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 md:grid-cols-2">
            <Reveal>
              <Artwork
                seed="about-page-portrait"
                tone="plum"
                label="The Eternal atelier — a styling chair before a warm, gold-lit mirror"
                className="sheen aspect-[4/5] w-full"
              />
            </Reveal>
            <div>
              <Reveal>
                <h2 className="font-display text-[30px] leading-snug text-plum-ink md:text-[40px]">
                  Who we are
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-6 text-[15.5px] font-light leading-[1.8] text-plum-soft md:text-[17px]">
                  Eternal is a premium unisex salon at Plot No. 7, Sector 25,
                  Pradhikaran — built for the people of Nigdi, Akurdi and the
                  wider PCMC who believe good grooming is not an indulgence,
                  it&apos;s upkeep of the self. Haircuts and hot-towel shaves,
                  colour and keratin, skin rituals and bridal mornings: all of
                  it under one roof, held to one uncompromising standard.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 text-[15.5px] font-light leading-[1.8] text-plum-soft md:text-[17px]">
                  The name is the promise. We are not chasing this season&apos;s
                  filter. We are after the kind of finish that still looks
                  deliberate weeks later — beauty that lasts,{" "}
                  <em className="font-display text-plum-ink">eternally yours</em>.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ——— The journey ——— */}
        <section className="px-6 py-16 md:py-28">
          <div className="mx-auto max-w-[840px]">
            <Reveal>
              <p className="eyebrow mb-4 text-gold">The journey</p>
              <h2 className="font-display text-[30px] text-plum-ink md:text-[44px]">
                How Eternal came to be
              </h2>
            </Reveal>
            <ol className="relative mt-14 border-l border-gold-soft pl-8 md:pl-12">
              {JOURNEY.map((step, i) => (
                <li key={step.title} className="relative pb-12 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[37px] top-1 h-3 w-3 rounded-full border border-gold bg-ivory md:-left-[53px]"
                  >
                    <span className="absolute inset-[2.5px] rounded-full bg-gold" />
                  </span>
                  <Reveal delay={i * 0.06}>
                    <h3 className="font-display text-[22px] text-plum-ink md:text-[26px]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[58ch] text-[15px] font-light leading-[1.8] text-plum-soft md:text-[16px]">
                      {step.text}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ——— What we stand for ——— */}
        <section className="border-y border-hairline bg-ivory-deep/60 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[1240px]">
            <Reveal>
              <p className="eyebrow mb-4 text-gold">What we stand for</p>
            </Reveal>
            <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="border-t border-gold-soft pt-6">
                    <h3 className="font-display text-[22px] text-plum-ink">{v.title}</h3>
                    <p className="mt-3 text-[15px] font-light leading-[1.8] text-plum-soft">
                      {v.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ——— CTA ——— */}
        <section className="px-6 py-20 text-center md:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-[18ch] font-display text-[30px] leading-snug text-plum-ink md:text-[44px]">
              The rest of the story is written{" "}
              <em className="text-brand-purple">in the chair</em>.
            </h2>
            <Link
              href="/book"
              className="snip-cta mt-10 inline-flex items-center gap-2.5 rounded-[2px] bg-brand-purple px-9 py-4 text-[13px] uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-brand-purple-deep"
            >
              Reserve Your Chair
            </Link>
            <p className="mt-6 text-[13px] font-light tracking-wide text-plum-soft">
              {SALON.address.line1}, {SALON.address.line2}, {SALON.address.city} ·{" "}
              {SALON.phoneDisplay}
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
