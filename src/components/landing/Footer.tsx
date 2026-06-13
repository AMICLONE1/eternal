import Link from "next/link";
import { SALON, waChatLink } from "@/lib/salon";
import { Logo } from "../Logo";
import { WhatsAppIcon, PhoneIcon } from "../icons";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ivory-deep">
      <div className="mx-auto max-w-[1240px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[320px] text-[14.5px] text-plum-soft">
              {SALON.tagline} A premium unisex salon in Pradhikaran, Nigdi —
              cuts, colour, skin, spa and bridal artistry for him &amp; her.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="eyebrow mb-4">Explore</h3>
            <ul className="flex flex-col gap-2.5 text-[14.5px] text-plum-soft">
              <li><Link href="/#services" className="hover:text-brand-purple">Services</Link></li>
              <li><Link href="/about" className="hover:text-brand-purple">About Us — our story</Link></li>
              <li><Link href="/#visit" className="hover:text-brand-purple">Visit us</Link></li>
              <li><Link href="/book" className="hover:text-brand-purple">Book an appointment</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow mb-4">Reach Us</h3>
            <ul className="flex flex-col gap-2.5 text-[14.5px] text-plum-soft">
              <li>
                <a href={`tel:${SALON.phoneE164}`} className="inline-flex items-center gap-2 hover:text-brand-purple">
                  <PhoneIcon size={15} /> {SALON.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={waChatLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-brand-purple"
                >
                  <WhatsAppIcon size={15} /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={SALON.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-purple"
                >
                  Instagram — @{SALON.instagram}
                </a>
              </li>
              <li className="pt-1 text-[13px]">
                {SALON.address.line1}, {SALON.address.line2}, {SALON.address.city} {SALON.address.pincode}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 text-[12.5px] text-plum-soft sm:flex-row">
          <p>© {new Date().getFullYear()} {SALON.name}. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="#C9A227"
              aria-label="love"
              role="img"
              className="inline-block"
            >
              <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2 5 5.3 5c2 0 3.3 1.2 4.2 2.4C10.4 6.2 11.7 5 13.7 5 17 5 18.5 8.4 17 11.8 14.5 16.4 12 21 12 21z" />
            </svg>
            by{" "}
            <a
              href="https://www.instagram.com/iamomkarkolhe"
              target="_blank"
              rel="noopener noreferrer"
              className="strand-link font-medium text-plum-ink hover:text-brand-purple"
            >
              Omkar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
