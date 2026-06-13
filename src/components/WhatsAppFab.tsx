import { waChatLink } from "@/lib/salon";
import { WhatsAppIcon } from "./icons";

/** FR-7: one-tap "Chat on WhatsApp" floating action, persistent site-wide. */
export function WhatsAppFab() {
  return (
    <a
      href={waChatLink("Hi Eternal! I'd like to know more about your services.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Eternal on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple-deep text-ivory shadow-[0_4px_24px_rgba(46,31,71,0.35)] transition-transform duration-300 hover:scale-105"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
