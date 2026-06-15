"use client";

import { useState } from "react";
import Link from "next/link";
import { waChatLink } from "@/lib/salon";

/**
 * Cancel control for the self-serve manage page. Confirms once, calls the
 * token-verified cancel API, then shows a calm cancelled state with a path
 * to rebook.
 */
export function CancelBooking({
  reference,
  token,
  rebookHref,
}: {
  reference: string;
  token: string;
  rebookHref: string;
}) {
  const [phase, setPhase] = useState<"idle" | "confirm" | "working" | "done" | "error">(
    "idle",
  );

  async function doCancel() {
    setPhase("working");
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, token }),
      });
      setPhase(res.ok ? "done" : "error");
    } catch {
      setPhase("error");
    }
  }

  if (phase === "done") {
    return (
      <div className="mt-8 border border-hairline bg-ivory-deep/40 p-6 text-center">
        <p className="font-display text-[22px] text-plum-ink">Your booking is cancelled.</p>
        <p className="mx-auto mt-2 max-w-[380px] text-[14.5px] text-plum-soft">
          That slot is now free for someone else. Changed your mind? You&rsquo;re always
          welcome back.
        </p>
        <Link
          href={rebookHref}
          className="snip-cta mt-5 inline-flex items-center justify-center rounded-[2px] bg-brand-purple px-7 py-3.5 text-[12.5px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-brand-purple-deep"
        >
          Book again
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {phase === "error" && (
        <p className="mb-4 text-center text-[14px] text-brand-purple">
          We couldn&rsquo;t cancel that just now. Please{" "}
          <a
            className="underline"
            href={waChatLink(`Hi Eternal, I'd like to cancel booking ${reference}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            message us on WhatsApp
          </a>{" "}
          and we&rsquo;ll sort it.
        </p>
      )}

      {phase === "idle" || phase === "error" ? (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={rebookHref}
            className="inline-flex w-full items-center justify-center rounded-[2px] border border-gold px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-ink transition-colors hover:bg-gold-soft/40 sm:w-auto"
          >
            Reschedule (rebook a new time)
          </Link>
          <button
            type="button"
            onClick={() => setPhase("confirm")}
            className="inline-flex w-full items-center justify-center rounded-[2px] border border-hairline px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-soft transition-colors hover:border-brand-purple hover:text-brand-purple sm:w-auto"
          >
            Cancel this booking
          </button>
        </div>
      ) : (
        <div className="border border-hairline bg-ivory-deep/40 p-6 text-center">
          <p className="text-[15px] text-plum-ink">
            Cancel booking <span className="font-medium">{reference}</span>? This frees your
            slot and can&rsquo;t be undone.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={doCancel}
              disabled={phase === "working"}
              className="inline-flex w-full items-center justify-center rounded-[2px] bg-brand-purple px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-brand-purple-deep disabled:opacity-60 sm:w-auto"
            >
              {phase === "working" ? "Cancelling…" : "Yes, cancel it"}
            </button>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              disabled={phase === "working"}
              className="inline-flex w-full items-center justify-center rounded-[2px] border border-hairline px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-ink transition-colors hover:border-gold-soft sm:w-auto"
            >
              Keep my booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
