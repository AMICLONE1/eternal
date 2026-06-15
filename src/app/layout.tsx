import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Quicksand } from "next/font/google";
import { SALON } from "@/lib/salon";
import { SERVICES, CATEGORY_LABELS } from "@/lib/services";
import { Loader } from "@/components/Loader";
import { FloatingActions } from "@/components/FloatingActions";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

// Rounded geometric sans — the logo wordmark face ("eternal" lockup)
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eternal — For Him & Her | Premium Unisex Salon in Nigdi, Pune",
    template: "%s | Eternal — For Him & Her",
  },
  description:
    "Eternal is a premium unisex salon in Pradhikaran, Nigdi (PCMC, Pune) — haircuts, colour, keratin, facials, spa, bridal & groom makeovers for him and her. Book your chair online in under a minute.",
  keywords: [
    "salon in Nigdi",
    "salon in Pradhikaran",
    "unisex salon PCMC Pune",
    "unisex salon Nigdi",
    "best salon in Nigdi Pradhikaran",
    "bridal makeup Nigdi",
    "groom makeover Pune",
    "men's salon Nigdi",
    "ladies salon Akurdi",
    "hair colour Pradhikaran",
    "keratin treatment Nigdi",
    "HydraFacial PCMC",
    "salon near Akurdi railway station",
    "salon Sector 25 Pradhikaran",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SALON.name,
    title: "Eternal — For Him & Her | Premium Unisex Salon in Nigdi, Pune",
    description:
      "Beauty that lasts, eternally yours. Book your chair at Eternal — Pradhikaran, Nigdi, Pune.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternal — For Him & Her | Premium Unisex Salon in Nigdi, Pune",
    description:
      "Beauty that lasts, eternally yours. Book your chair online in under a minute.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Beauty & Personal Care",
};

/**
 * HairSalon JSON-LD (TRD §9) with a full OfferCatalog generated from the live
 * service menu — keeps Google's understanding of the menu in lockstep with
 * the site, and feeds price-range/rich-result eligibility.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${SITE_URL}/#salon`,
  name: SALON.name,
  alternateName: "Eternal Salon Nigdi",
  slogan: SALON.tagline,
  description:
    "Premium unisex salon in Pradhikaran, Nigdi, Pune — haircuts, colour, keratin, skin, spa and bridal artistry for him & her.",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  logo: `${SITE_URL}/icon.svg`,
  telephone: SALON.phoneE164,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SALON.address.line1}, ${SALON.address.line2}`,
    addressLocality: SALON.address.city,
    addressRegion: SALON.address.state,
    postalCode: SALON.address.pincode,
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SALON.geo.lat,
    longitude: SALON.geo.lng,
  },
  areaServed: ["Nigdi", "Pradhikaran", "Akurdi", "Chinchwad", "Ravet", "PCMC", "Pune"],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "20:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:00", closes: "20:00" },
  ],
  sameAs: [SALON.instagramUrl],
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/book`,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Salon appointment" },
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Salon services",
    itemListElement: (["him", "her", "everyone"] as const).map((cat) => ({
      "@type": "OfferCatalog",
      name: CATEGORY_LABELS[cat],
      itemListElement: SERVICES.filter((s) => s.category === cat).map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.description },
        ...(s.price !== null
          ? { price: s.price, priceCurrency: "INR" }
          : {}),
      })),
    })),
  },
};

/** WebSite node — declares the canonical site + publisher for richer SERP
 *  treatment (sitelinks, brand panel) alongside the HairSalon entity. */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SALON.name,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#salon` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. webcrx) inject
    // attributes on <html> before React hydrates — only this element's
    // attribute diffs are silenced, children still validate.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${jost.variable} ${quicksand.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ivory focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Loader />
        {children}
        <FloatingActions />
        <MobileBookingBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
