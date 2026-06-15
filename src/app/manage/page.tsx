import type { Metadata } from "next";
import Link from "next/link";
import { getBookingByReference } from "@/lib/store";
import { verifyManageToken } from "@/lib/manage-token";
import { format12h, formatDateLong } from "@/lib/slots";
import { SALON, waChatLink } from "@/lib/salon";
import { CancelBooking } from "@/components/manage/CancelBooking";

export const dynamic = "force-dynamic";

// A private, token-gated page — keep it out of search results.
export const metadata: Metadata = {
  title: "Manage your booking",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[640px] flex-col justify-center px-6 py-20 text-center">
      {children}
      <Link
        href="/"
        className="strand-link mt-12 inline-block self-center text-[13px] uppercase tracking-[0.18em] text-brand-purple"
      >
        ← Back to Eternal
      </Link>
    </main>
  );
}

function Invalid() {
  return (
    <Shell>
      <p className="eyebrow text-gold-ink">Hmm</p>
      <h1 className="mt-3 font-display text-[28px] text-plum-ink md:text-[34px]">
        We couldn&rsquo;t find that booking.
      </h1>
      <p className="mx-auto mt-4 max-w-[420px] text-plum-soft">
        The link may be incomplete or expired. Please use the most recent link from your
        confirmation, or message us and we&rsquo;ll help straight away.
      </p>
      <a
        href={waChatLink("Hi Eternal, I need help with my booking.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center self-center rounded-[2px] border border-gold px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-ink transition-colors hover:bg-gold-soft/40"
      >
        Message us on WhatsApp
      </a>
    </Shell>
  );
}

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; t?: string }>;
}) {
  const { ref, t } = await searchParams;
  if (!ref || !t) return <Invalid />;

  const booking = await getBookingByReference(ref);
  if (!booking || !verifyManageToken(booking.id, t)) return <Invalid />;

  const services = booking.services.map((s) => s.name).join(", ");
  const cancelled = booking.status === "cancelled";
  const rebookHref = `/book${
    booking.services[0] ? `?service=${booking.services[0].slug}` : ""
  }`;

  return (
    <Shell>
      <p className="eyebrow">{cancelled ? "This booking is cancelled" : "Your booking"}</p>
      <h1 className="mt-3 font-display text-[28px] font-normal leading-[1.2] text-plum-ink md:text-[34px]">
        {booking.customer_name.split(" ")[0]}, here are your details.
      </h1>

      <div className="mt-8 border border-hairline bg-ivory p-6 text-left sm:p-8">
        <dl className="flex flex-col gap-4">
          <div className="flex justify-between gap-4">
            <dt className="text-[12px] uppercase tracking-[0.16em] text-plum-soft">Reference</dt>
            <dd className="font-display text-[18px] text-plum-ink">{booking.reference}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[12px] uppercase tracking-[0.16em] text-plum-soft">When</dt>
            <dd className="text-right text-plum-ink">
              {formatDateLong(booking.date)}
              <br />
              {format12h(booking.slot_start)} – {format12h(booking.slot_end)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[12px] uppercase tracking-[0.16em] text-plum-soft">Services</dt>
            <dd className="max-w-[60%] text-right text-plum-ink">{services}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[12px] uppercase tracking-[0.16em] text-plum-soft">Status</dt>
            <dd
              className={`text-right capitalize ${
                cancelled ? "text-plum-soft" : "text-brand-purple"
              }`}
            >
              {cancelled ? "Cancelled" : booking.status}
            </dd>
          </div>
        </dl>
      </div>

      {cancelled ? (
        <div className="mt-8">
          <p className="text-plum-soft">This booking has been cancelled.</p>
          <Link
            href={rebookHref}
            className="snip-cta mt-5 inline-flex items-center justify-center self-center rounded-[2px] bg-brand-purple px-7 py-3.5 text-[12.5px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-brand-purple-deep"
          >
            Book a new appointment
          </Link>
        </div>
      ) : (
        <>
          <CancelBooking reference={booking.reference} token={t} rebookHref={rebookHref} />
          <p className="mt-6 text-[13px] text-plum-soft">
            Need a different change? Message us on{" "}
            <a
              className="strand-link text-brand-purple"
              href={waChatLink(`Hi Eternal, about booking ${booking.reference}…`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>{" "}
            or call {SALON.phoneDisplay}.
          </p>
        </>
      )}
    </Shell>
  );
}
