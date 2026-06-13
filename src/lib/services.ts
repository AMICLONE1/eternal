/**
 * Service menu — full premium unisex menu with placeholder pricing
 * (client-approved interim set, 12 Jun 2026, until the real menu lands).
 * Shape mirrors the Prisma `Service` model so a DB-driven menu is a
 * drop-in change later.
 */

export type Category = "him" | "her" | "everyone";

export interface Service {
  slug: string;
  name: string;
  category: Category;
  group: string;
  /** INR; null = price on consultation */
  price: number | null;
  durationMin: number;
  /** icon key from components/icons.tsx */
  icon: string;
  description?: string;
  /** shown on the landing-page grid; full menu lives in the overlay */
  featured?: boolean;
}

export const SERVICES: Service[] = [
  // ═══════════ For Him ═══════════
  // — Hair —
  { slug: "haircut-him", featured: true, name: "Signature Haircut & Style", category: "him", group: "Hair", price: 450, durationMin: 45, icon: "scissors", description: "Consultation, precision scissor cut, wash & styling finish." },
  { slug: "hair-wash-style-him", name: "Hair Wash & Style", category: "him", group: "Hair", price: 250, durationMin: 20, icon: "blowdryer", description: "Deep-cleanse wash with a sharp everyday finish." },

  // — Beard & Shave —
  { slug: "beard-trim", featured: true, name: "Beard Trim & Shape", category: "him", group: "Beard & Shave", price: 250, durationMin: 20, icon: "beard", description: "Sculpted lines, symmetry check, hot-towel finish." },
  { slug: "beard-spa", featured: true, name: "Beard Spa & Conditioning", category: "him", group: "Beard & Shave", price: 600, durationMin: 30, icon: "towel", description: "Exfoliation, softening masque and oil ritual for the beard." },
  { slug: "royal-shave", featured: true, name: "Royal Hot-Towel Shave", category: "him", group: "Beard & Shave", price: 400, durationMin: 30, icon: "razor", description: "Classic lather shave with pre-oil, hot towels and post-balm." },

  // — Color —
  { slug: "hair-color-him", featured: true, name: "Global Hair Color", category: "him", group: "Color", price: 950, durationMin: 50, icon: "color", description: "Ammonia-free global tone, matched to skin and grey coverage." },
  { slug: "beard-color", name: "Beard & Moustache Color", category: "him", group: "Color", price: 350, durationMin: 20, icon: "beard", description: "Natural-finish color, no flat black unless you ask." },
  { slug: "highlights-him", name: "Streaks & Highlights", category: "him", group: "Color", price: 1500, durationMin: 75, icon: "brush", description: "Foil or freehand placement for subtle dimension." },

  // — Groom —
  { slug: "groom-makeover", featured: true, name: "Groom Makeover", category: "him", group: "Bridal & Groom", price: null, durationMin: 150, icon: "bowtie", description: "Complete wedding-day grooming — designed on consultation." },
  { slug: "pre-groom-ritual", name: "Pre-Wedding Groom Ritual", category: "him", group: "Bridal & Groom", price: 5500, durationMin: 180, icon: "bowtie", description: "Facial, detan, haircut, beard sculpt & manicure across one sitting." },

  // ═══════════ For Her ═══════════
  // — Hair —
  { slug: "haircut-her", featured: true, name: "Signature Cut & Blow-dry", category: "her", group: "Hair", price: 850, durationMin: 60, icon: "scissors", description: "Face-shape consultation, precision cut, wash and soft blow-dry." },
  { slug: "trim-tidy", name: "Trim & Tidy", category: "her", group: "Hair", price: 450, durationMin: 30, icon: "scissors", description: "Ends refreshed, shape maintained between cuts." },
  { slug: "blowdry-iron", name: "Blow-dry / Ironing", category: "her", group: "Hair", price: 550, durationMin: 30, icon: "blowdryer", description: "Bounce or glass-straight — your call." },
  { slug: "occasion-styling", name: "Occasion Styling & Updo", category: "her", group: "Hair", price: 1200, durationMin: 45, icon: "tiara", description: "Soft waves, braids or a sculpted updo for the evening." },

  // — Color —
  { slug: "global-color", featured: true, name: "Global Hair Color", category: "her", group: "Color", price: 2800, durationMin: 120, icon: "color", description: "Rich, even tone with bond-protect mixed in." },
  { slug: "highlights", featured: true, name: "Highlights / Balayage", category: "her", group: "Color", price: 4000, durationMin: 150, icon: "brush", description: "Hand-painted dimension, toned to suit your skin." },
  { slug: "root-touchup", name: "Root Touch-up", category: "her", group: "Color", price: 1200, durationMin: 60, icon: "color", description: "Seamless regrowth blend up to one inch." },
  { slug: "gloss-toner", name: "Gloss & Toner Refresh", category: "her", group: "Color", price: 1500, durationMin: 45, icon: "brush", description: "Revives tone and shine between color appointments." },

  // — Hair Treatments —
  { slug: "keratin", featured: true, name: "Keratin Smoothening", category: "her", group: "Hair Treatments", price: 5500, durationMin: 180, icon: "straightener", description: "Frizz-free, glassy hair that lasts for months." },
  { slug: "smoothening", name: "Advanced Smoothening", category: "her", group: "Hair Treatments", price: 5000, durationMin: 180, icon: "straightener", description: "Soft, natural fall without the poker-straight look." },
  { slug: "hair-botox", name: "Hair Botox Repair", category: "her", group: "Hair Treatments", price: 4500, durationMin: 150, icon: "lotus", description: "Deep filler treatment for damaged, lifeless lengths." },
  { slug: "bond-repair", name: "Bond Repair Ritual", category: "her", group: "Hair Treatments", price: 2500, durationMin: 75, icon: "sparkle", description: "Rebuilds broken bonds after color or heat." },

  // — Makeup —
  { slug: "party-makeup", featured: true, name: "Party Makeup", category: "her", group: "Makeup", price: 2500, durationMin: 75, icon: "brush", description: "Camera-ready glam with lashes and setting." },
  { slug: "engagement-makeup", name: "Engagement / Reception Makeup", category: "her", group: "Makeup", price: 4500, durationMin: 120, icon: "tiara", description: "Long-wear HD base built for the spotlight." },
  { slug: "saree-draping", name: "Saree Draping & Styling", category: "her", group: "Makeup", price: 800, durationMin: 30, icon: "sparkle", description: "Classic or contemporary drape, pleated to perfection." },

  // — Hands & Feet —
  { slug: "manicure", name: "Classic Manicure", category: "her", group: "Hands & Feet", price: 650, durationMin: 45, icon: "manicure", description: "Shape, cuticle care, massage & polish." },
  { slug: "pedicure", name: "Classic Pedicure", category: "her", group: "Hands & Feet", price: 850, durationMin: 60, icon: "pedicure", description: "Soak, scrub, heel care, massage & polish." },
  { slug: "spa-manicure", name: "Spa Manicure", category: "her", group: "Hands & Feet", price: 1100, durationMin: 60, icon: "manicure", description: "Classic plus masque, extended massage and paraffin glow." },
  { slug: "spa-pedicure", name: "Spa Pedicure", category: "her", group: "Hands & Feet", price: 1300, durationMin: 75, icon: "pedicure", description: "The pedicure, elevated — masque, paraffin and rest." },
  { slug: "gel-polish", name: "Gel Polish", category: "her", group: "Hands & Feet", price: 900, durationMin: 45, icon: "manicure", description: "Chip-free colour with a mirror finish, up to 3 weeks." },

  // — Waxing & Threading —
  { slug: "waxing-arms", name: "Full Arms Waxing", category: "her", group: "Waxing & Threading", price: 500, durationMin: 30, icon: "sparkle", description: "Roll-on or flavoured wax, soothed after." },
  { slug: "waxing-legs", name: "Full Legs Waxing", category: "her", group: "Waxing & Threading", price: 700, durationMin: 40, icon: "sparkle", description: "Smooth finish with post-wax care." },
  { slug: "full-body-wax", name: "Full Body Waxing", category: "her", group: "Waxing & Threading", price: 2400, durationMin: 120, icon: "sparkle", description: "Head-to-toe, with sensitive-skin options." },
  { slug: "threading-brows", name: "Eyebrow Threading", category: "her", group: "Waxing & Threading", price: 120, durationMin: 15, icon: "sparkle", description: "Clean arcs shaped to your face." },

  // — Bridal —
  { slug: "bridal-makeup", featured: true, name: "Signature Bridal Makeup", category: "her", group: "Bridal & Groom", price: null, durationMin: 240, icon: "tiara", description: "Your wedding-day look, designed across a personal consultation." },
  { slug: "bridal-trial", name: "Bridal Trial Session", category: "her", group: "Bridal & Groom", price: 3500, durationMin: 120, icon: "tiara", description: "Full trial of the bridal look before the big day." },

  // ═══════════ For Everyone ═══════════
  // — Skin —
  { slug: "signature-facial", featured: true, name: "Signature Glow Facial", category: "everyone", group: "Skin", price: 1800, durationMin: 60, icon: "lotus", description: "Deep cleanse, lifting massage and glow masque." },
  { slug: "hydra-facial", featured: true, name: "HydraFacial", category: "everyone", group: "Skin", price: 3500, durationMin: 75, icon: "lotus", description: "Machine-assisted resurfacing, extraction and serum infusion." },
  { slug: "gold-facial", featured: true, name: "24K Gold Radiance Facial", category: "everyone", group: "Skin", price: 2500, durationMin: 75, icon: "sparkle", description: "Occasion-ready luminosity, our most-booked festive ritual." },
  { slug: "cleanup", name: "Express Clean-up", category: "everyone", group: "Skin", price: 900, durationMin: 30, icon: "sponge", description: "Quick refresh between facials." },
  { slug: "detan", name: "D-Tan Pack", category: "everyone", group: "Skin", price: 700, durationMin: 30, icon: "sponge", description: "Lifts sun damage from face and neck." },

  // — Spa —
  { slug: "head-massage", featured: true, name: "Warm-Oil Head Massage", category: "everyone", group: "Spa", price: 500, durationMin: 30, icon: "massage", description: "The champi that melts the week away." },
  { slug: "hair-spa", featured: true, name: "Hair Spa Ritual", category: "everyone", group: "Spa", price: 1400, durationMin: 60, icon: "towel", description: "Steam, masque and scalp therapy." },
  { slug: "scalp-detox", name: "Scalp Detox & Dandruff Therapy", category: "everyone", group: "Spa", price: 1600, durationMin: 60, icon: "towel", description: "Clinical-grade exfoliation and calm for an irritated scalp." },

  // — Little Guests —
  { slug: "kids-haircut", featured: true, name: "Kids' Haircut (under 10)", category: "everyone", group: "Little Guests", price: 300, durationMin: 30, icon: "scissors", description: "Patient hands, quick snips, happy kids." },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  him: "For Him",
  her: "For Her",
  everyone: "For Everyone",
};

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export function servicesByCategory(category: Category) {
  return SERVICES.filter((s) => s.category === category);
}

/** Groups services for the booking list: [{ group, services }] in menu order */
export function groupedServices(category: Category) {
  const list = servicesByCategory(category);
  const groups: { group: string; services: Service[] }[] = [];
  for (const s of list) {
    const g = groups.find((x) => x.group === s.group);
    if (g) g.services.push(s);
    else groups.push({ group: s.group, services: [s] });
  }
  return groups;
}

export function formatPrice(price: number | null) {
  if (price === null) return "On consultation";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
