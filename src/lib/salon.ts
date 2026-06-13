/**
 * Single source of truth for salon facts.
 * Values marked TBD are placeholders awaiting client confirmation (PRD §10)
 * — update here once and the whole site (UI, SEO schema, WhatsApp links) follows.
 */

export const SALON = {
  name: "Eternal — For Him & Her",
  shortName: "Eternal",
  tagline: "Beauty that lasts, eternally yours.",
  address: {
    line1: "Plot No. 7, Sector 25",
    line2: "Pradhikaran, Nigdi",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411044",
  },
  geo: { lat: 18.6549, lng: 73.7639 }, // Nigdi, Pradhikaran approx — refine with exact plot coords
  /** WhatsApp number (client, 12 Jun 2026); main landline to be added later */
  phoneDisplay: "+91 81808 61415",
  phoneE164: "+918180861415",
  whatsappNumber: "918180861415",
  instagram: "eternalforhimandher",
  instagramUrl: "https://instagram.com/eternalforhimandher",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Eternal+For+Him+%26+Her+Salon+Plot+No.+7+Sector+25+Pradhikaran+Nigdi+Pune+411044",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Sector+25,+Pradhikaran,+Nigdi,+Pune,+Maharashtra+411044&output=embed",
  parkingNote: "Two-wheeler & car parking available in front of the salon.",
  /** TBD from client — per-weekday working hours (0 = Sunday … 6 = Saturday) */
  workingHours: {
    0: { open: "10:00", close: "20:00" },
    1: { open: "10:00", close: "20:30" },
    2: { open: "10:00", close: "20:30" },
    3: { open: "10:00", close: "20:30" },
    4: { open: "10:00", close: "20:30" },
    5: { open: "10:00", close: "20:30" },
    6: { open: "09:30", close: "21:00" },
  } as Record<number, { open: string; close: string } | null>,
  hoursDisplay: [
    { days: "Mon – Fri", hours: "10:00 am – 8:30 pm" },
    { days: "Saturday", hours: "9:30 am – 9:00 pm" },
    { days: "Sunday", hours: "10:00 am – 8:00 pm" },
  ],
  /** Slot engine settings (TRD §4) — capacity TBD: number of parallel chairs */
  slotGranularityMin: 30,
  slotCapacity: 3,
  leadTimeMin: 60,
  bookingWindowDays: 14,
  timezone: "Asia/Kolkata",
} as const;

export function waChatLink(message?: string) {
  const base = `https://wa.me/${SALON.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
