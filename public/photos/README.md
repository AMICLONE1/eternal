# Drop your salon photos here

Name each file **exactly** as the "filename" below (lowercase), then commit /
redeploy. Any slot with a real file shows the photo; any slot left empty keeps
the designed placeholder. No code editing needed.

Accepted formats: `.jpg` `.jpeg` `.png` `.webp` `.avif` (use `.jpg` if unsure).
If two formats exist for one slot, the smaller/modern one wins (avif > webp > jpg).

## Filenames the site looks for

| Filename | Where it shows | Best shape | What to shoot |
|----------|----------------|-----------|---------------|
| `hero.jpg` | Top of the home page (big) | landscape ~16:12 | The salon floor — a styling chair before a gold-lit mirror; warm light |
| `about-portrait.jpg` | "About" strip on home page | portrait 4:5 | A stylist's hands at work — precision cutting, warm tone |
| `about-page-portrait.jpg` | The /about page | portrait 4:5 | The atelier interior, or the team — something that says "who we are" |
| `signature-bridal.jpg` | Signature experiences row 1 | portrait ~4:5 | Bridal artistry — finishing touches before the ceremony |
| `signature-groom.jpg` | Signature experiences row 2 | portrait ~4:5 | Groom's beard sculpting in the chair |
| `signature-spa.jpg` | Signature experiences row 3 | portrait ~4:5 | Spa ritual — warm towels, steam, soft light |
| `gallery-1.jpg` | Gallery (tall tile) | portrait 4:5 | Her layered cut / soft waves |
| `gallery-2.jpg` | Gallery | square | Skin ritual — a glow facial in progress |
| `gallery-3.jpg` | Gallery (tall tile) | portrait 4:5 | Balayage / colour detail |
| `gallery-4.jpg` | Gallery | square | His classic fade with sculpted beard |
| `gallery-5.jpg` | Gallery | square | Bridal updo — the final pin |
| `gallery-6.jpg` | Gallery (tall tile) | portrait 4:5 | The atelier — chairs, mirrors, morning light |
| `before.jpg` | Before/After slider — LEFT | landscape 16:10 | Client BEFORE — same angle & framing as `after` |
| `after.jpg` | Before/After slider — RIGHT | landscape 16:10 | Same client AFTER — identical angle/framing |
| `insta-1.jpg` … `insta-6.jpg` | Instagram strip (6 squares) | square | Your latest posts (or skip — see note) |

## Tips

- **Sizes:** aim for the long edge ~1600px. Next.js auto-compresses and serves
  modern formats, so don't pre-optimise — just give decent-quality originals.
- **Before/After:** shoot the two photos from the *same spot* so the slider
  wipes cleanly between them.
- **Instagram tiles:** once you connect Behold.so (set `BEHOLD_FEED_ID`) these
  pull live from Instagram automatically and the `insta-*.jpg` files are ignored.
  Use the files only if you'd rather hand-pick the 6 images.
- You don't have to fill every slot at once. Add `hero.jpg` today, the gallery
  next week — each one swaps in the moment its file exists.

## After adding files

If the site is on Vercel: commit the new files and it redeploys automatically
(or run `vercel --prod`). Locally: just restart `npm run dev` — the photo list
regenerates on every dev/build start.
