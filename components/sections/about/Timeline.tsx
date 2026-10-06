"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Milestone = { year: string; title: string; text: string };

/** Vertical timeline whose line draws with scroll; milestones reveal as the line reaches them. */
export function Timeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-tl-line]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: 0.5 } },
        );
        gsap.utils.toArray<HTMLElement>("[data-tl-item]").forEach((item) => {
          gsap.from(item, { autoAlpha: 0, x: document.dir === "rtl" ? 40 : -40, duration: 1, scrollTrigger: { trigger: item, start: "top 75%", once: true } });
          gsap.from(item.querySelector("[data-tl-dot]"), { scale: 0, duration: 0.6, ease: "back.out(3)", scrollTrigger: { trigger: item, start: "top 70%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="relative ms-3 space-y-14 md:ms-6">
      <span aria-hidden className="absolute inset-y-0 start-0 w-px bg-line" />
      <span aria-hidden data-tl-line className="bg-signature absolute inset-y-0 start-0 w-px origin-top shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
      {items.map((item) => (
        <li key={item.title} data-tl-item className="relative ps-10 md:ps-16">
          <span data-tl-dot aria-hidden className="bg-signature glow absolute start-0 top-1.5 size-4 -translate-x-1/2 rounded-full ring-4 ring-bg rtl:translate-x-1/2" />
          <p className="eyebrow mb-2">{item.year}</p>
          <h3 className="text-h3">{item.title}</h3>
          <p className="mt-2 max-w-xl text-muted">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
