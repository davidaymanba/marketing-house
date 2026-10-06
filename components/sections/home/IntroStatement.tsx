"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** One big paragraph whose words light up from muted to white as you scroll. */
export function IntroStatement({ eyebrow, text }: { eyebrow: string; text: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const words = text.split(/\s+/);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: "[data-statement]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        },
      );
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <section ref={ref} className="container-site relative py-24 md:py-40">
      <div aria-hidden className="absolute start-0 top-1/2 -z-10 size-[40vw] -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div className="mb-10 flex items-center gap-4">
        <span className="hairline w-16" />
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <p data-statement className="max-w-6xl text-h2 font-bold leading-[1.25] rtl:leading-[1.6]">
        <span className="sr-only">{text}</span>
        {words.map((w, i) => (
          <span key={i} aria-hidden data-word className="inline">
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
