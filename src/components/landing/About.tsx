import { Reveal } from "../Reveal";
import { Artwork } from "../Artwork";
import { EternalDivider } from "../EternalLine";

/** §5.1-3: The Eternal Line brand-story strip + about editorial. */
export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1240px] px-6 py-[72px] md:py-[120px]">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="keyline sheen">
            <Artwork
              seed="about-portrait"
              tone="ivory"
              label="A stylist's hands at work — precision cutting in warm light"
              className="aspect-[4/5] w-full"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow mb-5">The Eternal Line</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[30px] font-normal leading-[1.15] md:text-[48px]">
              Some things shouldn&rsquo;t fade —{" "}
              <span className="italic text-brand-purple">your glow</span> is one
              of them.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 text-plum-soft">
              Eternal was built on a simple promise: every person who settles
              into our chair — him or her — leaves carrying something that
              lasts. Not just a haircut or a glow, but the feeling of being
              genuinely attended to. Our stylists treat every appointment like
              a small ritual: unhurried, precise, and finished only when it&rsquo;s
              right.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-5 text-plum-soft">
              In the heart of Pradhikaran, Nigdi — a calm, ivory-toned atelier
              where the city slows down for an hour.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <EternalDivider className="mt-9 justify-start" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
