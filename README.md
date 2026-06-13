# Eternal — For Him & Her

Premium unisex salon website: landing page + 4-step booking flow with WhatsApp
alerts to the salon. Built per `../Eternal_PRD.md`, `../Eternal_TRD.md` and
`../Eternal_Design_Document.md` (locked concept: **Ivory Atelier**).

## Stack

Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · Framer Motion ·
Supabase (Postgres) · Meta WhatsApp Cloud API · Resend (fallback) · Vercel.

## Run locally

```bash
npm install
npm run dev
```

No env vars are required for development: bookings persist to an in-memory
store and WhatsApp alerts print to the server console. The full flow —
availability, capacity checks, SLOT_FULL races, success screen — works as in
production.

## Going live

1. **Supabase** — create a project, run `supabase/schema.sql` in the SQL
   editor, copy URL + service-role key into `.env` (see `.env.example`).
2. **WhatsApp Cloud API** — Meta Business verification + a sender number not
   used in the consumer app (TRD §7). Set `WHATSAPP_TOKEN`,
   `WHATSAPP_PHONE_ID`, `SALON_WA_RECIPIENTS`. Until then the `wa.me`
   deep-link on the success screen is the live fallback (TRD §12).
3. **Resend** — API key + `SALON_FALLBACK_EMAIL` so failed WhatsApp sends
   alert the owner by email (FR-6).
4. **Behold.so** — create a feed for @eternalforhimandher (JSON/API type),
   set `BEHOLD_FEED_ID`; the Instagram strip switches from branded
   placeholders to live posts, revalidated hourly, no client-side script.
5. **Vercel** — import the repo, add env vars, attach the custom domain.

## Where things live

| Concern | Path |
|---------|------|
| Salon facts (address, hours, numbers, capacity) | `src/lib/salon.ts` |
| Service menu (placeholder until client menu lands) | `src/lib/services.ts` |
| Slot engine (IST, lead time, capacity) | `src/lib/slots.ts` |
| Booking validation (shared client/server) | `src/lib/validation.ts` |
| Persistence (Supabase ⇄ in-memory dev fallback) | `src/lib/store.ts` |
| WhatsApp + email notify pipeline | `src/lib/notify.ts` |
| API: availability / bookings | `src/app/api/*/route.ts` |
| Landing sections | `src/components/landing/` |
| Booking wizard | `src/components/booking/BookingWizard.tsx` |
| Design tokens & motion CSS | `src/app/globals.css` |
| Placeholder → real-photo swap guide | `docs/CONTENT_MAP.md` |

## Pending client inputs (PRD §10)

Service menu & prices · WhatsApp numbers · working hours · real photos &
logo files · chair count · domain. Each has a marked placeholder — see
`docs/CONTENT_MAP.md` for the exact file to touch.

## Owner's booking list (Phase 1)

Supabase dashboard → Table editor → `bookings` (FR-10). Status flow:
`pending → confirmed / completed / cancelled / no_show`.
