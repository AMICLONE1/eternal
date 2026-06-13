import type { Metadata } from "next";
import Link from "next/link";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Logo } from "@/components/Logo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eternalforhimandher.com";

export const metadata: Metadata = {
  title: "Book Your Appointment",
  description:
    "Reserve your chair at Eternal — pick a service, choose a slot, done in under a minute. Premium unisex salon in Pradhikaran, Nigdi, Pune.",
  alternates: { canonical: `${SITE_URL}/book` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Book Your Appointment", item: `${SITE_URL}/book` },
  ],
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <>
      {/* Slim header per Design Document §5.2 */}
      <header className="border-b border-hairline bg-ivory">
        <div className="mx-auto flex h-[64px] max-w-[1240px] items-center justify-between px-6">
          <Link href="/" aria-label="Eternal — home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="strand-link text-[12.5px] uppercase tracking-[0.16em] text-plum-soft"
          >
            ← back to site
          </Link>
        </div>
      </header>
      <main id="main" className="pt-8">
        <BookingWizard preselect={service} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
