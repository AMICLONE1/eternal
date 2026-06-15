/**
 * Notify pipeline (TRD §6–§7): WhatsApp Cloud API with retries,
 * email fallback via Resend, and loud logging. Never blocks the booking —
 * callers fire-and-forget after the DB insert succeeds.
 */
import { cleanEnv } from "./env";
import { format12h, formatDateLong } from "./slots";
import { manageUrl } from "./manage-token";
import { markWaNotified, type BookingRecord } from "./store";

const WA_TOKEN = cleanEnv(process.env.WHATSAPP_TOKEN);
const WA_PHONE_ID = cleanEnv(process.env.WHATSAPP_PHONE_ID);
const WA_RECIPIENTS = (cleanEnv(process.env.SALON_WA_RECIPIENTS) ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const RESEND_KEY = cleanEnv(process.env.RESEND_API_KEY);
const FALLBACK_EMAIL = cleanEnv(process.env.SALON_FALLBACK_EMAIL);

function messageBody(b: BookingRecord) {
  const services = b.services.map((s) => s.name).join(", ");
  return [
    `🪞 New booking at Eternal — ${b.reference}`,
    `Name: ${b.customer_name} · 📞 ${b.phone}`,
    `Services: ${services}`,
    `🗓 ${formatDateLong(b.date)}, ${format12h(b.slot_start)}–${format12h(b.slot_end)}`,
    b.note ? `Note: ${b.note}` : null,
    `Manage: ${manageUrl(b.id, b.reference)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendWhatsAppTo(recipient: string, body: string) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "text",
      text: { body },
    }),
  });
  if (!res.ok) {
    throw new Error(`WhatsApp API ${res.status}: ${await res.text()}`);
  }
}

async function sendFallbackEmail(b: BookingRecord, reason: string) {
  if (!RESEND_KEY || !FALLBACK_EMAIL) {
    console.error(
      `[eternal] WhatsApp failed for ${b.reference} and no email fallback configured: ${reason}`
    );
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Eternal Bookings <bookings@resend.dev>",
      to: [FALLBACK_EMAIL],
      subject: `New booking ${b.reference} — WhatsApp alert failed`,
      text: `${messageBody(b)}\n\nWhatsApp delivery failed: ${reason}\nCheck the Supabase dashboard for details.`,
    }),
  });
  if (!res.ok) {
    console.error(`[eternal] fallback email also failed for ${b.reference}: ${res.status}`);
  }
}

/**
 * Sends the owner alert: up to 3 attempts per recipient with backoff,
 * then the email fallback (FR-6).
 */
export async function notifySalon(booking: BookingRecord): Promise<void> {
  const body = messageBody(booking);

  if (!WA_TOKEN || !WA_PHONE_ID || WA_RECIPIENTS.length === 0) {
    console.warn(
      `[eternal] WhatsApp not configured — booking ${booking.reference} alert:\n${body}`
    );
    await sendFallbackEmail(booking, "WhatsApp Cloud API credentials not configured");
    return;
  }

  let anyDelivered = false;
  for (const recipient of WA_RECIPIENTS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await sendWhatsAppTo(recipient, body);
        anyDelivered = true;
        break;
      } catch (err) {
        console.error(
          `[eternal] WhatsApp attempt ${attempt}/3 to ${recipient} failed for ${booking.reference}:`,
          err
        );
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, attempt * 1500));
        }
      }
    }
  }

  if (anyDelivered) {
    await markWaNotified(booking.id);
  } else {
    await sendFallbackEmail(booking, "all WhatsApp attempts exhausted");
  }
}
