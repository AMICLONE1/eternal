/**
 * Eternal duotone icon set (Design Document §4).
 * 24px grid · 1.5px plum stroke · rounded caps · exactly one solid gold
 * detail per icon (the pivot screw, the glint dot, the steam curl…).
 * Inline SVGs so motion specs (e.g. M3 scissor snip) can animate paths.
 */
import type { SVGProps } from "react";

const GOLD = "#C9A227";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Base({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Scissors — gold pivot screw; blades carry M3 snip classes */
export function ScissorsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <g className="scissor-blade-a">
        <circle cx="6" cy="6" r="2.6" />
        <path d="M8.2 7.8 19.5 19" />
      </g>
      <g className="scissor-blade-b">
        <circle cx="6" cy="18" r="2.6" />
        <path d="M8.2 16.2 19.5 5" />
      </g>
      <circle cx="12" cy="12" r="1.4" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Razor & comb — gold edge-glint on the razor head */
export function RazorIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 5h7v4H4z" />
      <path d="M7.5 9v10" />
      <rect x="3" y="4.2" width="9" height="1.6" rx="0.8" fill={GOLD} stroke="none" />
      <path d="M16 4v16M16 5.5h4M16 8.5h4M16 11.5h4M16 14.5h4M16 17.5h4" />
    </Base>
  );
}

/** Beard trim — gold jaw contour dot */
export function BeardIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 4c0 2 .4 3.4-.6 5C5.2 11 5 12.6 5 14a7 7 0 0 0 14 0c0-1.4-.2-3-1.4-5-1-1.6-.6-3-.6-5" />
      <path d="M9.5 14c.5 1.4 1.4 2 2.5 2s2-.6 2.5-2" />
      <path d="M10 11h.01M14 11h.01" />
      <circle cx="12" cy="19" r="1.2" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Color swatch & brush — gold paint drop */
export function ColorIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 3h6v9.5a3 3 0 1 1-6 0V3z" />
      <path d="M5 7h6" />
      <path d="M16 3l3.5 3.5L13 13" />
      <path d="M8 15.5h.01" fill="none" />
      <circle cx="8" cy="12.8" r="1.2" fill={GOLD} stroke="none" />
      <path d="M19 14c.8 1.2 1.5 2.3 1.5 3.2a1.8 1.8 0 1 1-3.6 0c0-.9.8-2 2.1-3.2z" />
    </Base>
  );
}

/** Brush (highlights) — gold ferrule band */
export function BrushIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9.5 13.5 19 4l1 1-9.5 9.5" />
      <path d="M9.5 13.5c-1.8.3-3 1.4-3.4 3.2-.3 1.3-.8 2.2-2.1 2.8 1.2 1 2.8 1.3 4.3.8 1.9-.6 2.9-2.2 2.7-4.3" />
      <rect x="9.1" y="12.4" width="3.4" height="1.6" rx="0.8" transform="rotate(-45 10.8 13.2)" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Blow-dryer — gold breeze line */
export function BlowDryerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 5h9a4.5 4.5 0 0 1 0 9h-1.5l-1 5a1.5 1.5 0 0 1-3 0l-1-5H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="9.5" r="1.8" />
      <path d="M18.5 7.5h2.5M18.5 11.5h2.5" />
      <rect x="18.5" y="8.8" width="3.5" height="1.5" rx="0.75" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Straightener — gold heat plate */
export function StraightenerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 3.5c-1.2 0-2 .9-2 2V19a2.2 2.2 0 0 0 4.4 0V5.5c0-1.1-.9-2-2.4-2z" />
      <path d="M15 3.5c-1.2 0-2 .9-2 2V19a2.2 2.2 0 0 0 4.4 0V5.5c0-1.1-.9-2-2.4-2z" />
      <path d="M9.4 6h3.2" />
      <rect x="14" y="8" width="2.4" height="6" rx="1.2" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Facial lotus — gold center petal tip */
export function LotusIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5c1.6 2 2.4 4 2.4 6A2.4 2.4 0 0 1 12 13.5 2.4 2.4 0 0 1 9.6 11c0-2 .8-4 2.4-6z" />
      <path d="M5 9.5c2.4.4 4.2 1.5 5.2 3.3.6 1.1.4 2.3-.5 3-1 .6-2.2.4-3-.5C5.5 13.9 5 12 5 9.5z" />
      <path d="M19 9.5c-2.4.4-4.2 1.5-5.2 3.3-.6 1.1-.4 2.3.5 3 1 .6 2.2.4 3-.5 1.2-1.4 1.7-3.3 1.7-5.8z" />
      <path d="M6.5 17.5c3.6 1.6 7.4 1.6 11 0" />
      <circle cx="12" cy="8" r="1.1" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Clean-up sponge — gold bubble */
export function SpongeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="9" width="16" height="9" rx="3" />
      <path d="M8 13h.01M12 14.5h.01M16 13h.01" />
      <path d="M9 5.5c.8-1 2-1 2.8 0M13.5 4c.8-1 2-1 2.8 0" />
      <circle cx="17.5" cy="6.5" r="1.3" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Spa towel & steam — gold steam curl */
export function TowelIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 14h16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3z" />
      <path d="M6 14v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M9 6c-.6-1 .6-1.6 0-2.6" />
      <path
        d="M14.8 6.4c-.8-1.1.7-1.8 0-3"
        stroke={GOLD}
        strokeWidth={1.8}
      />
    </Base>
  );
}

/** Head-massage hands — gold energy dot */
export function MassageIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="9" r="4" />
      <path d="M12 13v3" />
      <path d="M4 20c.4-2.4 1.8-3.8 4-4.4M20 20c-.4-2.4-1.8-3.8-4-4.4" />
      <path d="M6 9.5C5 8.5 5 7 6 6M18 9.5c1-1 1-2.5 0-3.5" />
      <circle cx="12" cy="4" r="1.1" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Manicure — gold polish cap */
export function ManicureIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 21v-5.5C8 13 9.5 11 12 11s4 2 4 4.5V21" />
      <path d="M12 11V5.5C12 4 11 3 9.8 3 8.5 3 7.7 4 7.7 5.4V14" />
      <path d="M16.2 15c1.2-.6 2-1.8 2-3.3V8.5" />
      <rect x="16.9" y="4.5" width="2.6" height="2.2" rx="0.6" fill={GOLD} stroke="none" />
      <path d="M17.2 6.7h2v3.3a1 1 0 0 1-2 0V6.7z" />
    </Base>
  );
}

/** Pedicure — gold toe-polish dot */
export function PedicureIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 3.5C9.8 3.5 12 5.7 12 8.5V12c0 1.7 1.3 3 3 3h2c1.7 0 3 1.3 3 3s-1.3 3-3 3H9a5 5 0 0 1-5-5V8.5C4 5.7 5 3.5 7 3.5z" />
      <path d="M4.5 14h7" />
      <circle cx="6.8" cy="7.5" r="1.2" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Bridal tiara — gold gem */
export function TiaraIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 17l1.6-8 4 4L12 6l2.4 7 4-4 1.6 8H4z" />
      <path d="M4 20h16" />
      <circle cx="12" cy="12.2" r="1.3" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Groom bow-tie — gold knot */
export function BowtieIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10 10.5 4 7.5v9l6-3" />
      <path d="M14 10.5l6-3v9l-6-3" />
      <rect x="10" y="9.5" width="4" height="5" rx="1.2" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Clock (duration) — gold center pin */
export function ClockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.5" />
      <circle cx="12" cy="12" r="1" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Calendar — gold selected day */
export function CalendarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
      <rect x="13.5" y="12.5" width="3.4" height="3.4" rx="0.8" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Location pin — ə-shaped negative space, gold dot */
export function PinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21.5c4-4.4 7-8 7-11.5a7 7 0 1 0-14 0c0 3.5 3 7.1 7 11.5z" />
      <path d="M14.4 9.2a2.5 2.5 0 1 0-.4 2.8M9.6 9.6h4.8" />
      <circle cx="12" cy="16" r="1" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** WhatsApp chat bubble — gold call wave */
export function WhatsAppIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z" />
      <path
        d="M9 8.5c-.5.5-.7 1.4-.3 2.4.6 1.6 1.9 3 3.4 3.7 1 .5 1.9.4 2.4-.1l.6-.7c.2-.3.1-.7-.2-.9l-1.5-.9c-.3-.2-.6-.1-.8.1l-.4.4c-.8-.4-1.6-1.2-2-2l.4-.4c.2-.2.3-.6.1-.8l-.9-1.5c-.2-.3-.6-.4-.9-.2l-.9.9z"
        fill={GOLD}
        stroke="none"
      />
    </Base>
  );
}

/** Phone — gold ring wave */
export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5.5 4h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L16 14l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4z" />
      <path d="M15.5 5.5c1.7.6 3 1.9 3.5 3.6" stroke={GOLD} strokeWidth={1.8} />
    </Base>
  );
}

/** Star — gold core */
export function StarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7L12 3.5z" />
      <circle cx="12" cy="11.2" r="1.2" fill={GOLD} stroke="none" />
    </Base>
  );
}

/** Sparkle separator for the marquee */
export function SparkleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill={GOLD} stroke="none" />
    </Base>
  );
}

const REGISTRY = {
  scissors: ScissorsIcon,
  razor: RazorIcon,
  beard: BeardIcon,
  color: ColorIcon,
  brush: BrushIcon,
  blowdryer: BlowDryerIcon,
  straightener: StraightenerIcon,
  lotus: LotusIcon,
  sponge: SpongeIcon,
  towel: TowelIcon,
  massage: MassageIcon,
  manicure: ManicureIcon,
  pedicure: PedicureIcon,
  tiara: TiaraIcon,
  bowtie: BowtieIcon,
  clock: ClockIcon,
  calendar: CalendarIcon,
  pin: PinIcon,
  whatsapp: WhatsAppIcon,
  phone: PhoneIcon,
  star: StarIcon,
  sparkle: SparkleIcon,
} as const;

export type IconKey = keyof typeof REGISTRY;

export function ServiceIcon({ name, ...props }: IconProps & { name: string }) {
  const Cmp = REGISTRY[name as IconKey] ?? ScissorsIcon;
  return <Cmp {...props} />;
}
