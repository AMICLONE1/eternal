"use client";

/**
 * The 4-step booking flow (PRD §5.2, Design Document §5.2):
 * Service → Date & Time → Details → Confirm, completable in under 60s.
 * M10 mirror-panel step transitions · M11 slot bloom · M12 confirmation loop.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CATEGORY_LABELS,
  formatDuration,
  formatPrice,
  getService,
  groupedServices,
  type Category,
} from "@/lib/services";
import { SALON, waChatLink } from "@/lib/salon";
import { bookableDates, format12h, formatDateLong, type Slot } from "@/lib/slots";
import { bookingSchema } from "@/lib/validation";
import { ServiceIcon, ClockIcon, CalendarIcon, PinIcon, WhatsAppIcon } from "../icons";
import { InfinitySeal } from "../EternalLine";

const EASE = [0.22, 1, 0.36, 1] as const;
const STEPS = ["Service", "Date & Time", "Details", "Confirm"] as const;

interface SuccessData {
  reference: string;
  date: string;
  slot: string;
  slotEnd: string;
  manageUrl?: string;
}

/* ---------- M10: Eternal Line step indicator with gold nodes ---------- */
function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="mx-auto flex max-w-[560px] items-center px-6" aria-label="Booking steps">
      {STEPS.map((label, i) => (
        <li key={label} className={`flex items-center ${i > 0 ? "flex-1" : ""}`}>
          {i > 0 && (
            <span
              aria-hidden="true"
              className={`mx-2 h-px flex-1 transition-colors duration-500 ${
                i <= step ? "bg-gold" : "bg-hairline"
              }`}
            />
          )}
          <span className="flex flex-col items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`h-3 w-3 rounded-full border transition-all duration-500 ${
                i < step
                  ? "border-gold bg-gold"
                  : i === step
                    ? "border-gold bg-ivory shadow-[inset_0_0_0_2.5px_#FBF8F3,inset_0_0_0_8px_#C9A227]"
                    : "border-hairline bg-ivory"
              }`}
            />
            <span
              className={`hidden text-[10.5px] uppercase tracking-[0.16em] sm:block ${
                i === step ? "text-plum-ink" : "text-plum-soft"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {label}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- main wizard ---------- */
export function BookingWizard({ preselect }: { preselect?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1
  const [category, setCategory] = useState<Category>(() => {
    const pre = preselect ? getService(preselect) : undefined;
    return pre && pre.category !== "everyone" ? pre.category : "him";
  });
  const [selected, setSelected] = useState<string[]>(() =>
    preselect && getService(preselect) ? [preselect] : []
  );

  // Step 2
  const dates = useMemo(() => bookableDates(), []);
  const [date, setDate] = useState<string>(dates[0]);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);
  const [bloomSlot, setBloomSlot] = useState<string | null>(null);

  // Step 3
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Step 4
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const mountedAt = useRef(Date.now());

  const chosen = selected.map((slug) => getService(slug)!).filter(Boolean);
  const total = chosen.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const hasPOA = chosen.some((s) => s.price === null);
  const totalDuration = chosen.reduce((sum, s) => sum + s.durationMin, 0);

  const loadSlots = useCallback(async (d: string) => {
    setSlots(null);
    setSlotsError(false);
    try {
      const res = await fetch(`/api/availability?date=${d}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { slots: Slot[] };
      setSlots(data.slots);
    } catch {
      setSlotsError(true);
    }
  }, []);

  useEffect(() => {
    if (step === 1) loadSlots(date);
  }, [step, date, loadSlots]);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleService = (slug: string) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  const validateDetails = () => {
    const parsed = bookingSchema.safeParse({
      name,
      phone,
      services: selected,
      date,
      slot: slot ?? "00:00",
      note,
      hp: "",
    });
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }
    const errs: Record<string, string> = {};
    const flat = parsed.error.flatten().fieldErrors;
    if (flat.name?.[0]) errs.name = flat.name[0];
    if (flat.phone?.[0]) errs.phone = flat.phone[0];
    if (flat.note?.[0]) errs.note = flat.note[0];
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async () => {
    if (!slot || submitting) return;
    // bot heuristic companion to the server honeypot: humans take > 3s
    if (Date.now() - mountedAt.current < 3000) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, services: selected, date, slot, note, hp: "" }),
      });
      if (res.status === 201) {
        setSuccess(await res.json());
        return;
      }
      if (res.status === 409) {
        setSubmitError("That slot just filled — pick another and it's yours.");
        go(1);
        setSlot(null);
        loadSlots(date);
        return;
      }
      if (res.status === 429) {
        setSubmitError("Too many bookings from this connection — please call or WhatsApp us instead.");
        return;
      }
      const data = await res.json().catch(() => null);
      const firstIssue =
        data?.issues && (Object.values(data.issues as Record<string, string[]>)[0]?.[0] as string);
      setSubmitError(firstIssue ?? "Something went wrong on our side. Please try again.");
    } catch {
      setSubmitError("Couldn't reach the salon — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return <SuccessScreen data={success} services={chosen.map((s) => s.name)} />;

  const panelVariants = {
    enter: (dir: number) => ({ x: reduce ? 0 : dir * 64, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: reduce ? 0 : dir * -64, opacity: 0 }),
  };

  return (
    <div className="pb-36">
      <StepIndicator step={step} />

      {submitError && step !== 3 && (
        <p role="alert" className="mx-auto mt-6 max-w-[760px] px-6 text-center text-[14.5px] text-error">
          {submitError}
        </p>
      )}

      <div className="mx-auto mt-10 max-w-[760px] overflow-x-clip px-6">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: EASE }}
          >
            {step === 0 && (
              <section aria-label="Choose services">
                <h1 className="font-display text-[28px] font-normal md:text-[36px]">
                  What are we doing <span className="italic text-brand-purple">today</span>?
                </h1>
                <div role="tablist" aria-label="Category" className="mt-7 flex gap-2">
                  {(["him", "her", "everyone"] as Category[]).map((c) => (
                    <button
                      key={c}
                      role="tab"
                      aria-selected={category === c}
                      onClick={() => setCategory(c)}
                      className={`rounded-[2px] border px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] transition-colors duration-300 sm:px-6 ${
                        category === c
                          ? "border-brand-purple bg-brand-purple text-ivory"
                          : "border-hairline bg-ivory text-plum-soft hover:border-gold-soft"
                      }`}
                    >
                      {CATEGORY_LABELS[c]}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-8">
                  {groupedServices(category).map(({ group, services }) => (
                    <div key={group}>
                      <h2 className="eyebrow mb-3">{group}</h2>
                      <ul className="flex flex-col divide-y divide-hairline border border-hairline bg-ivory">
                        {services.map((s) => {
                          const active = selected.includes(s.slug);
                          return (
                            <li key={s.slug}>
                              <button
                                type="button"
                                aria-pressed={active}
                                onClick={() => toggleService(s.slug)}
                                className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-200 sm:px-5 ${
                                  active ? "bg-ivory-deep" : "hover:bg-ivory-deep/50"
                                }`}
                              >
                                <span className="shrink-0 text-plum-ink">
                                  <ServiceIcon name={s.icon} size={24} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block font-normal">{s.name}</span>
                                  <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] uppercase tracking-[0.1em] text-plum-soft">
                                    <ClockIcon size={13} /> {formatDuration(s.durationMin)}
                                  </span>
                                </span>
                                <span className="shrink-0 font-display text-[19px]">
                                  {formatPrice(s.price)}
                                </span>
                                <span
                                  aria-hidden="true"
                                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                    active ? "border-gold bg-gold text-ivory" : "border-hairline"
                                  }`}
                                >
                                  {active && (
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                      <path d="M2 6.5 5 9.5 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step === 1 && (
              <section aria-label="Choose date and time">
                <h1 className="font-display text-[28px] font-normal md:text-[36px]">
                  Pick your <span className="italic text-brand-purple">moment</span>.
                </h1>

                <div className="mt-7 -mx-6 overflow-x-auto px-6 pb-2" role="radiogroup" aria-label="Date">
                  <div className="flex gap-2.5">
                    {dates.map((d) => {
                      const day = new Date(`${d}T00:00:00Z`);
                      const active = d === date;
                      return (
                        <button
                          key={d}
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setDate(d);
                            setSlot(null);
                          }}
                          className={`flex min-w-[64px] flex-col items-center rounded-[2px] border px-3 py-3 transition-colors duration-200 ${
                            active
                              ? "border-brand-purple bg-brand-purple text-ivory"
                              : "border-hairline bg-ivory text-plum-ink hover:border-gold-soft"
                          }`}
                        >
                          <span className={`text-[10.5px] uppercase tracking-[0.14em] ${active ? "text-ivory/80" : "text-plum-soft"}`}>
                            {day.toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" })}
                          </span>
                          <span className="font-display text-[21px]">{day.getUTCDate()}</span>
                          <span className={`text-[10.5px] uppercase tracking-[0.14em] ${active ? "text-ivory/80" : "text-plum-soft"}`}>
                            {day.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7 min-h-[200px]">
                  {slotsError ? (
                    <p className="text-[14.5px] text-error">
                      Couldn&rsquo;t load the day&rsquo;s slots.{" "}
                      <button onClick={() => loadSlots(date)} className="underline">
                        Try again
                      </button>
                    </p>
                  ) : slots === null ? (
                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4" aria-label="Loading slots">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-12 animate-pulse rounded-[2px] bg-ivory-deep" />
                      ))}
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-[15px] text-plum-soft">
                      The salon is closed on {formatDateLong(date)} — pick another day.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4" role="radiogroup" aria-label="Time slot">
                      {slots.map((s) => {
                        const active = slot === s.start;
                        return (
                          <button
                            key={s.start}
                            role="radio"
                            aria-checked={active}
                            disabled={!s.available}
                            onClick={() => {
                              setSlot(s.start);
                              setBloomSlot(s.start);
                            }}
                            onAnimationEnd={() => setBloomSlot(null)}
                            className={`h-12 rounded-[2px] border text-[14px] transition-colors duration-200 ${
                              bloomSlot === s.start && active ? "slot-bloom" : ""
                            } ${
                              active
                                ? "border-gold bg-gold-soft/60 text-plum-ink"
                                : s.available
                                  ? "border-hairline bg-ivory hover:border-gold-soft"
                                  : "cursor-not-allowed border-hairline/60 bg-ivory-deep/40 text-plum-soft/40 line-through"
                            }`}
                          >
                            {format12h(s.start)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-5 text-[13px] text-plum-soft">
                    Salon hours on {formatDateLong(date)}:{" "}
                    {(() => {
                      const wd = new Date(`${date}T00:00:00Z`).getUTCDay();
                      const h = SALON.workingHours[wd];
                      return h ? `${format12h(h.open)} – ${format12h(h.close)}` : "closed";
                    })()}
                    . Bookings need {SALON.leadTimeMin} minutes&rsquo; notice.
                  </p>
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-label="Your details">
                <h1 className="font-display text-[28px] font-normal md:text-[36px]">
                  Almost <span className="italic text-brand-purple">yours</span>.
                </h1>
                <form
                  className="mt-8 flex max-w-[460px] flex-col gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (validateDetails()) go(3);
                  }}
                >
                  <div>
                    <label htmlFor="bk-name" className="eyebrow mb-2 block">
                      Your name
                    </label>
                    <input
                      id="bk-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "bk-name-err" : undefined}
                      className="w-full rounded-[2px] border border-hairline bg-ivory px-4 py-3.5 font-normal outline-none transition-colors focus:border-gold"
                    />
                    {fieldErrors.name && (
                      <p id="bk-name-err" className="mt-1.5 text-[13.5px] text-error">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bk-phone" className="eyebrow mb-2 block">
                      Mobile number
                    </label>
                    <div className="flex">
                      <span className="flex items-center rounded-l-[2px] border border-r-0 border-hairline bg-ivory-deep px-3.5 text-[15px] text-plum-soft">
                        +91
                      </span>
                      <input
                        id="bk-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="98765 43210"
                        required
                        aria-invalid={!!fieldErrors.phone}
                        aria-describedby={fieldErrors.phone ? "bk-phone-err" : undefined}
                        className="w-full rounded-r-[2px] border border-hairline bg-ivory px-4 py-3.5 font-normal outline-none transition-colors focus:border-gold"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p id="bk-phone-err" className="mt-1.5 text-[13.5px] text-error">{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bk-note" className="eyebrow mb-2 block">
                      Note <span className="normal-case tracking-normal text-plum-soft">(optional)</span>
                    </label>
                    <textarea
                      id="bk-note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      maxLength={300}
                      placeholder="Anything we should know — first visit, allergies, a reference photo to bring…"
                      className="w-full resize-none rounded-[2px] border border-hairline bg-ivory px-4 py-3.5 font-normal outline-none transition-colors focus:border-gold"
                    />
                  </div>
                  {/* honeypot — invisible to humans (TRD §5) */}
                  <input
                    type="text"
                    name="hp"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <button type="submit" className="sr-only">
                    Continue
                  </button>
                </form>
              </section>
            )}

            {step === 3 && (
              <section aria-label="Confirm booking">
                <h1 className="font-display text-[28px] font-normal md:text-[36px]">
                  One last <span className="italic text-brand-purple">look</span>.
                </h1>
                <div className="mt-8 border border-hairline bg-ivory">
                  <dl className="divide-y divide-hairline">
                    <div className="flex justify-between gap-6 px-5 py-4">
                      <dt className="eyebrow pt-0.5">Services</dt>
                      <dd className="text-right">
                        {chosen.map((s) => (
                          <div key={s.slug} className="flex items-baseline justify-end gap-4">
                            <span>{s.name}</span>
                            <span className="font-display text-[18px]">{formatPrice(s.price)}</span>
                          </div>
                        ))}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-6 px-5 py-4">
                      <dt className="eyebrow pt-0.5">When</dt>
                      <dd className="text-right">
                        {formatDateLong(date)}
                        <br />
                        <span className="text-plum-soft">
                          {slot ? format12h(slot) : ""} · about {formatDuration(totalDuration)}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-6 px-5 py-4">
                      <dt className="eyebrow pt-0.5">For</dt>
                      <dd className="text-right">
                        {name}
                        <br />
                        <span className="text-plum-soft">+91 {phone.replace(/^(\+91|91|0)/, "")}</span>
                      </dd>
                    </div>
                    {note && (
                      <div className="flex justify-between gap-6 px-5 py-4">
                        <dt className="eyebrow pt-0.5">Note</dt>
                        <dd className="max-w-[300px] text-right text-plum-soft">{note}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-6 bg-ivory-deep/60 px-5 py-4">
                      <dt className="eyebrow pt-1">Estimated total</dt>
                      <dd className="font-display text-[24px]">
                        {formatPrice(total)}
                        {hasPOA && <span className="block text-[12px] font-body text-plum-soft">+ items on consultation</span>}
                      </dd>
                    </div>
                  </dl>
                </div>
                <p className="mt-4 text-[13.5px] text-plum-soft">
                  No payment needed now — the salon will confirm your booking. Prices are confirmed at the chair.
                </p>
                {submitError && (
                  <p role="alert" className="mt-4 text-[14.5px] text-error">
                    {submitError}
                  </p>
                )}
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky summary / actions bar — docks above keyboard-safe area on mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ivory/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
        <div className="mx-auto flex h-[76px] max-w-[760px] items-center justify-between gap-4 px-6">
          <div className="min-w-0">
            {step === 0 && (
              <p className="truncate text-[14px] text-plum-soft">
                {chosen.length === 0 ? (
                  "Select at least one service"
                ) : (
                  <>
                    <span className="text-plum-ink">{chosen.length} service{chosen.length > 1 ? "s" : ""}</span>
                    {" · "}about {formatDuration(totalDuration)}
                    {total > 0 && (
                      <>
                        {" · "}
                        <span className="font-display text-[18px] text-plum-ink">{formatPrice(total)}</span>
                        {hasPOA ? " +" : ""}
                      </>
                    )}
                  </>
                )}
              </p>
            )}
            {step === 1 && (
              <p className="truncate text-[14px] text-plum-soft">
                {slot ? (
                  <span className="text-plum-ink">
                    {formatDateLong(date)} · {format12h(slot)}
                  </span>
                ) : (
                  "Pick a time slot"
                )}
              </p>
            )}
            {step >= 2 && (
              <button
                onClick={() => go(step - 1)}
                className="strand-link text-[12.5px] uppercase tracking-[0.16em] text-plum-soft"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {step > 0 && step < 2 && (
              <button
                onClick={() => go(step - 1)}
                className="hidden rounded-[2px] border border-hairline px-5 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-soft transition-colors hover:border-gold-soft sm:block"
              >
                Back
              </button>
            )}
            {step === 0 && (
              <button
                onClick={() => chosen.length > 0 && go(1)}
                disabled={chosen.length === 0}
                className="snip-cta rounded-[2px] bg-brand-purple px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-ivory transition-colors duration-300 enabled:hover:bg-brand-purple-deep disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            )}
            {step === 1 && (
              <button
                onClick={() => slot && go(2)}
                disabled={!slot}
                className="snip-cta rounded-[2px] bg-brand-purple px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-ivory transition-colors duration-300 enabled:hover:bg-brand-purple-deep disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            )}
            {step === 2 && (
              <button
                onClick={() => validateDetails() && go(3)}
                className="snip-cta rounded-[2px] bg-brand-purple px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-ivory transition-colors duration-300 hover:bg-brand-purple-deep"
              >
                Review
              </button>
            )}
            {step === 3 && (
              <button
                onClick={submit}
                disabled={submitting}
                className="snip-cta rounded-[2px] bg-brand-purple px-7 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-ivory transition-colors duration-300 enabled:hover:bg-brand-purple-deep disabled:opacity-60"
              >
                {submitting ? "Reserving…" : "Confirm Booking"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- success screen with M12 confirmation loop ---------- */
function SuccessScreen({ data, services }: { data: SuccessData; services: string[] }) {
  const gcalLink = (() => {
    const start = `${data.date.replace(/-/g, "")}T${data.slot.replace(":", "")}00`;
    const end = `${data.date.replace(/-/g, "")}T${data.slotEnd.replace(":", "")}00`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Eternal Salon — ${services.join(", ")}`,
      dates: `${start}/${end}`,
      ctz: SALON.timezone,
      details: `Booking reference: ${data.reference}\n${SALON.name}`,
      location: `${SALON.address.line1}, ${SALON.address.line2}, ${SALON.address.city} ${SALON.address.pincode}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  })();

  return (
    <div className="mx-auto max-w-[640px] px-6 pb-24 text-center">
      <p className="eyebrow">Your chair is reserved</p>
      <div className="mt-4">
        <InfinitySeal>
          <p className="font-display text-[34px] tracking-[0.04em] text-plum-ink md:text-[42px]">
            {data.reference}
          </p>
        </InfinitySeal>
      </div>
      <h1 className="mt-2 font-display text-[26px] font-normal leading-[1.2] md:text-[34px]">
        We&rsquo;ll see you on{" "}
        <span className="italic text-brand-purple">{formatDateLong(data.date)}</span> at{" "}
        <span className="italic text-brand-purple">{format12h(data.slot)}</span>.
      </h1>
      <p className="mx-auto mt-4 max-w-[420px] text-plum-soft">
        Your chair is reserved. We&rsquo;ll message you if anything changes — quote your
        reference if you call.
      </p>
      {data.manageUrl && (
        <p className="mx-auto mt-3 max-w-[420px] text-[13.5px] text-plum-soft">
          Need to change plans?{" "}
          <Link href={data.manageUrl} className="strand-link text-brand-purple">
            Reschedule or cancel your booking
          </Link>{" "}
          anytime.
        </p>
      )}

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={gcalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] border border-gold px-6 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-ink transition-colors hover:bg-gold-soft/40 sm:w-auto"
        >
          <CalendarIcon size={16} /> Save to calendar
        </a>
        <a
          href={SALON.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] border border-hairline px-6 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-ink transition-colors hover:border-gold-soft sm:w-auto"
        >
          <PinIcon size={16} /> Get directions
        </a>
        <a
          href={waChatLink(`Hi Eternal! I just booked — reference ${data.reference}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] border border-hairline px-6 py-3.5 text-[12.5px] uppercase tracking-[0.16em] text-plum-ink transition-colors hover:border-gold-soft sm:w-auto"
        >
          <WhatsAppIcon size={16} /> WhatsApp us
        </a>
      </div>

      <Link
        href="/"
        className="strand-link mt-12 inline-block text-[13px] uppercase tracking-[0.18em] text-brand-purple"
      >
        ← Back to Eternal
      </Link>
    </div>
  );
}
