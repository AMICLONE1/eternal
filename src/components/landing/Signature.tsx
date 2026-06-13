import Link from "next/link";
import { Reveal } from "../Reveal";
import { Artwork } from "../Artwork";

const EXPERIENCES = [
  {
    seed: "signature-bridal",
    tone: "gold" as const,
    eyebrow: "The Bridal Edit",
    title: "Walk in a bride, leave a memory.",
    italic: "memory",
    body: "A complete pre-wedding journey — trials, skin rituals, the morning-of artistry — composed around your face, your outfit, your light. Booked on consultation so nothing is rushed.",
    cta: { label: "Enquire for your date", href: "/book?service=bridal-makeup" },
    label: "Bridal artistry — finishing touches before the ceremony",
  },
  {
    seed: "signature-groom",
    tone: "plum" as const,
    eyebrow: "The Groom Makeover",
    title: "He only marries once. Dress the day.",
    italic: "once",
    body: "Cut, beard sculpting, royal shave, skin prep and a finish that photographs the way it feels. A quiet hour that turns nerves into presence.",
    cta: { label: "Reserve the makeover", href: "/book?service=groom-makeover" },
    label: "A groom's tailored finish — beard sculpting in the chair",
  },
  {
    seed: "signature-spa",
    tone: "ivory" as const,
    eyebrow: "The Eternal Hour",
    title: "Sixty minutes that outlast the week.",
    italic: "outlast",
    body: "Our signature ritual for him and her: warm-oil head massage, hair spa and an express glow — the reset button the city forgot to give you.",
    cta: { label: "Book the ritual", href: "/book?service=hair-spa" },
    label: "Spa ritual — warm towels and steam in soft light",
  },
];

/** §5.1-5: signature experiences, editorial alternating rows. */
export function Signature() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-[72px] md:py-[120px]">
      <Reveal>
        <p className="eyebrow mb-5 text-center">Signature Experiences</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mx-auto max-w-[640px] text-center font-display text-[30px] font-normal leading-[1.15] md:text-[48px]">
          Moments worth keeping{" "}
          <span className="italic text-brand-purple">eternally</span>.
        </h2>
      </Reveal>

      <div className="mt-16 flex flex-col gap-16 md:gap-24">
        {EXPERIENCES.map((x, i) => (
          <Reveal key={x.seed}>
            <div
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${
                i % 2 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="keyline sheen mx-auto w-full md:mx-0 md:max-w-[460px]">
                <Artwork
                  seed={x.seed}
                  tone={x.tone}
                  label={x.label}
                  className="aspect-[4/5] w-full"
                />
              </div>
              <div>
                <p className="eyebrow mb-4">{x.eyebrow}</p>
                <h3 className="font-display text-[26px] font-normal leading-[1.18] md:text-[36px]">
                  {x.title.split(x.italic).map((part, j, arr) => (
                    <span key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <span className="italic text-brand-purple">{x.italic}</span>
                      )}
                    </span>
                  ))}
                </h3>
                <p className="mt-5 max-w-[440px] text-plum-soft">{x.body}</p>
                <Link
                  href={x.cta.href}
                  className="strand-link mt-7 inline-block text-[13px] uppercase tracking-[0.18em] text-brand-purple"
                >
                  {x.cta.label} →
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
