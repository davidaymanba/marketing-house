"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

const WORDS = ["MARKETING", "HOUSE"] as const;

/** Giant wordmark whose letters rise from a mask as the footer scrolls in. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-letter]", {
        yPercent: 110,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ref.current, start: "top 95%", end: "bottom bottom", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div ref={ref} dir="ltr" aria-label="Marketing House" role="img" className="select-none">
      <div className="flex flex-wrap justify-center gap-x-[0.25em] font-[family-name:var(--font-jakarta)] font-extrabold leading-[0.85] tracking-[-0.04em] text-[clamp(3rem,10.5vw,11rem)]">
        {WORDS.map((word, w) => (
          <span key={word} aria-hidden className="reveal-mask inline-flex">
            {word.split("").map((letter, i) => (
              <span
                key={i}
                data-letter
                className={w === 1 ? "text-gradient inline-block" : "inline-block text-fg/95"}
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
