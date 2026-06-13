# Content Map — placeholder slots → real assets

## Photos: just drop files in `public/photos/`

You no longer edit code to add photos. Each slot below has a `seed`; drop a
file named **`<seed>.jpg`** (or `.png` / `.webp` / `.avif`) into
`public/photos/` and that slot switches from the designed placeholder to your
photo automatically — same dimensions, no layout shift. Empty slots keep the
placeholder. Full filename list + shooting guide: `public/photos/README.md`.

The mechanism: `scripts/photo-manifest.mjs` scans `public/photos/` before every
build/dev start and writes `src/lib/photo-manifest.ts`; `Artwork.tsx` shows the
photo when the seed has one, else the SVG.

| Seed | Where | Aspect | The real photo should show |
|------|-------|--------|---------------------------|
| `hero` | Landing hero | 4:5 mobile / 16:12 desktop | The salon floor: a styling chair before a gold-lit mirror; warm grade, deep plum shadows |
| `about-portrait` | About section | 4:5 | A stylist's hands at work — precision cutting, golden-hour warmth |
| `signature-bridal` | Signature row 1 | 4:5 → 5:4 | Bridal artistry — finishing touches before the ceremony |
| `signature-groom` | Signature row 2 | 4:5 → 5:4 | Groom's beard sculpting in the chair |
| `signature-spa` | Signature row 3 | 4:5 → 5:4 | Spa ritual — warm towels, steam, soft light |
| `gallery-1…6` | Gallery masonry | square / 4:5 mix | Real client work: her layers, glow facial, balayage detail, his fade, bridal updo, the atelier interior |
| `before` / `after` | Before–after slider | 16:10 (both identical framing) | Same client, same angle, pre & post transformation |
| `insta-1…6` | Instagram strip | square | Pull actual latest posts (Phase 1: manual export; Phase 2: API) |

## Other placeholder content awaiting client input (PRD §10)

| Item | File to update |
|------|----------------|
| ~~Real logo files~~ ✅ done | Client file traced as true vector in `src/components/Logo.tsx` (original kept in `brand-assets/`) |
| Service menu, durations, prices, public/private pricing | `src/lib/services.ts` |
| Phone + WhatsApp numbers | `src/lib/salon.ts` (`phoneDisplay`, `phoneE164`, `whatsappNumber`) |
| WhatsApp alert recipients | `.env` → `SALON_WA_RECIPIENTS` |
| Working hours per weekday | `src/lib/salon.ts` (`workingHours`, `hoursDisplay`) + JSON-LD hours in `src/app/layout.tsx` |
| Parallel chairs (slot capacity) | `src/lib/salon.ts` (`slotCapacity`) |
| Exact plot geo-coordinates | `src/lib/salon.ts` (`geo`) |
| Domain | `.env` → `NEXT_PUBLIC_SITE_URL` |
| Real Google reviews | `src/components/landing/Testimonials.tsx` (`REVIEWS`) |
