import { Header } from "@/components/Header";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { Signature } from "@/components/landing/Signature";
import { Gallery } from "@/components/landing/Gallery";
import { Testimonials } from "@/components/landing/Testimonials";
import { InstagramStrip } from "@/components/landing/InstagramStrip";
import { VisitUs } from "@/components/landing/VisitUs";
import { Faq } from "@/components/landing/Faq";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";

// Re-generate the page (and re-pull Google reviews) every 5 days via ISR —
// ~6 fetches/month, and the page is served statically the rest of the time.
export const revalidate = 432_000;

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Signature />
        <Gallery />
        <Testimonials />
        <InstagramStrip />
        <VisitUs />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
