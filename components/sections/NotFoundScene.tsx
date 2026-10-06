"use client";

import { useRef } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { gsap, useGSAP } from "@/lib/gsap";

/** Giant 404: the logo bars assemble, then fall apart and scatter. Hover the mark to rebuild it. */
export function NotFoundScene({ title, text, cta }: { title: string; text: string; cta: string }) {
  const ref = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scatter = [
          { x: -140, y: 260, rotate: -68 },
          { x: 30, y: 300, rotate: 24 },
          { x: 190, y: 240, rotate: 82 },
        ];
        const tl = gsap.timeline({ delay: 0.3 });
        tl.from("[data-bar]", { y: -200, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "expo.out" })
          .to("[data-bar]", { x: -6, duration: 0.08, repeat: 5, yoyo: true, ease: "none" }, "+=0.3")
          .to("[data-bar]", {
            x: (i) => scatter[i]!.x,
            y: (i) => scatter[i]!.y,
            rotate: (i) => scatter[i]!.rotate,
            transformOrigin: "50% 50%",
            duration: 1.3,
            ease: "bounce.out",
            stagger: 0.08,
          })
          .from("[data-404]", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08 }, "-=1.2")
          .from("[data-nf-copy]", { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 }, "-=0.6");
        tlRef.current = tl;
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const rebuild = () => gsap.to(ref.current?.querySelectorAll("[data-bar]") ?? [], { x: 0, y: 0, rotate: 0, duration: 0.8, ease: "expo.out", stagger: 0.05 });
  const breakApart = () => tlRef.current && gsap.to(ref.current?.querySelectorAll("[data-bar]") ?? [], {
    x: (i) => [-140, 30, 190][i]!,
    y: (i) => [260, 300, 240][i]!,
    rotate: (i) => [-68, 24, 82][i]!,
    duration: 1.1,
    ease: "bounce.out",
    stagger: 0.06,
  });

  return (
    <section ref={ref} className="container-site relative flex min-h-svh flex-col items-center justify-center overflow-hidden pt-[var(--nav-h)] text-center">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.25),transparent_60%)]" />
      <div onPointerEnter={rebuild} onPointerLeave={breakApart} className="relative z-10 mb-[-6vw] w-[min(60vw,420px)]">
        <LogoMark variant="glow" className="w-full" />
      </div>
      <h1 className="sr-only">404 — {title}</h1>
      <p aria-hidden dir="ltr" className="flex font-extrabold leading-none tracking-[-0.06em] text-[clamp(8rem,32vw,26rem)]">
        {"404".split("").map((d, i) => (
          <span key={i} className="reveal-mask inline-block">
            <span data-404 className="text-gradient inline-block">
              {d}
            </span>
          </span>
        ))}
      </p>
      <p data-nf-copy className="text-h3">{title}</p>
      <p data-nf-copy className="mt-4 max-w-md text-muted">{text}</p>
      <div data-nf-copy className="mt-10">
        <MagneticButton href="/" size="lg">
          {cta}
        </MagneticButton>
      </div>
    </section>
  );
}
