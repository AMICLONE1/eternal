"use client";

/**
 * M2 — The Eternal Line. A gold SVG stroke that draws itself when it enters
 * the viewport (stroke-dashoffset). The hero variant loops once into an
 * upright-infinity "ə" flourish; the divider variant threads between sections.
 */
import { useEffect, useRef, useState } from "react";

function useInView<T extends Element>(threshold = 0.4) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Underline with an infinity loop, drawn under the hero headline. */
export function EternalUnderline({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<SVGSVGElement>(0.6);
  return (
    <svg
      ref={ref}
      viewBox="0 0 320 28"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ ["--line-length" as string]: 480 }}
    >
      <path
        className={`line-draw ${inView ? "is-drawn" : ""}`}
        d="M4 18 C 60 12, 110 12, 150 16 C 163 17.5, 170 11, 163 7.5 C 156 4, 148 10, 156 15 C 162 18.5, 175 18, 188 16.5 C 235 12, 280 13, 316 17"
        stroke="#C9A227"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Section divider: a thin gold thread that loops once at the boundary. */
export function EternalDivider({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<SVGSVGElement>(0.8);
  return (
    <div className={`flex justify-center ${className}`} aria-hidden="true">
      <svg
        ref={ref}
        viewBox="0 0 200 24"
        fill="none"
        className="h-6 w-[200px]"
        style={{ ["--line-length" as string]: 300 }}
      >
        <path
          className={`line-draw ${inView ? "is-drawn" : ""}`}
          d="M2 12 H 78 C 90 12, 95 5, 100 5 C 107 5, 107 19, 100 19 C 95 19, 90 12, 102 12 H 198"
          stroke="#C9A227"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** The ə glyph drawn in gold stroke — used by the loader and success screen. */
export function SchwaGlyph({
  size = 72,
  drawn = true,
  className = "",
}: {
  size?: number;
  drawn?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ ["--line-length" as string]: 140 }}
    >
      <path
        className={`line-draw ${drawn ? "is-drawn" : ""}`}
        d="M11 21 C 16 20, 28 20, 36 21 C 37 13, 30 8, 23 9.5 M 36 21 C 38 32, 31 40, 23 40 C 15.5 40, 10.5 34.5, 11 27.5 C 11.5 21.5, 17 17.5, 24 18.5"
        stroke="#C9A227"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * M12 — Confirmation loop: the Eternal Line draws a complete infinity
 * around the booking reference. "Your slot, sealed eternally."
 */
export function InfinitySeal({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  return (
    <div ref={ref} className="relative inline-flex items-center justify-center px-12 py-9">
      <svg
        viewBox="0 0 260 110"
        fill="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{ ["--line-length" as string]: 720 }}
      >
        <path
          className={`line-draw ${inView ? "is-drawn" : ""}`}
          d="M130 88 C 60 88, 14 78, 14 55 C 14 32, 60 22, 130 22 C 200 22, 246 32, 246 55 C 246 78, 200 88, 130 88 Z"
          stroke="#C9A227"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
