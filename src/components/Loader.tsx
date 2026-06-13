"use client";

/**
 * M1 — first-visit loader. The "eternal" wordmark settles in over the ivory
 * veil, then the veil dissolves. ≤ 1.2s, skipped on repeat visits and under
 * prefers-reduced-motion.
 */
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const KEY = "eternal-loader-seen";

export function Loader() {
  const [phase, setPhase] = useState<"hidden" | "drawing" | "leaving">("hidden");

  useEffect(() => {
    if (
      sessionStorage.getItem(KEY) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    sessionStorage.setItem(KEY, "1");
    setPhase("drawing");
    const t1 = setTimeout(() => setPhase("leaving"), 900);
    const t2 = setTimeout(() => setPhase("hidden"), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory transition-opacity duration-400"
      style={{ opacity: phase === "leaving" ? 0 : 1 }}
    >
      <span
        className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: phase === "drawing" ? 1 : 0,
          transform: phase === "drawing" ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <Logo className="scale-[2]" />
      </span>
    </div>
  );
}
