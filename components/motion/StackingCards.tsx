"use client";

import { Children, useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Cards pin (CSS sticky) and stack over the previous one while scrolling.
 * On desktop the covered card scales down and dims (GSAP scrub); mobile and
 * reduced motion keep the light sticky-only version.
 */
export function StackingCards({ children, className, offset = 28 }: { children: ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const depth = cards.length - i;
          gsap.to(card.querySelector("[data-stack-inner]"), {
            scale: 1 - Math.min(depth, 4) * 0.035,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: `top top+=${120 + (i + 1) * offset}`,
              scrub: true,
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      {items.map((child, i) => (
        <div
          key={i}
          data-stack-card
          className="sticky mb-8 last:mb-0 md:mb-16"
          style={{ top: `calc(var(--nav-h) + 16px + ${i * offset}px)` }}
        >
          <div data-stack-inner className="origin-top will-change-transform">
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
