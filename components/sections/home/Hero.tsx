"use client";

import { useRef } from "react";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { HeroVisual } from "@/components/three/HeroVisual";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroState } from "@/lib/heroState";
import { usePrefersReducedMotion } from "@/lib/hooks";

type HeroProps = {
  eyebrow: string;
  line1: string;
  accent: string;
  line2: string;
  pillars: string[];
  primaryCta: string;
  secondaryCta: string;
  scrollLabel: string;
  visualLabel: string;
};

export function Hero({ eyebrow, line1, accent, line2, pillars, primaryCta, secondaryCta, scrollLabel, visualLabel }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { done } = usePreloader();
  const reduced = usePrefersReducedMotion();

  // Intro (after the preloader starts its exit).
  useGSAP(
    () => {
      if (!done) return;
      gsap.set("[data-hero-content]", { autoAlpha: 1 });
      if (reduced) {
        gsap.from("[data-hero-content]", { autoAlpha: 0, duration: 0.8 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-hero-eyebrow]", { yPercent: 120, duration: 1 }, 0.15)
        .from("[data-hero-line]", { yPercent: 115, duration: 1.4, stagger: 0.12 }, 0.2)
        .from("[data-hero-pillar]", { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.15 }, 0.75)
        .from("[data-hero-cta]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.1 }, 0.95)
        .from("[data-hero-visual]", { autoAlpha: 0, scale: 0.92, duration: 1.8 }, 0.3)
        .from("[data-hero-scroll]", { autoAlpha: 0, duration: 1 }, 1.4);
    },
    { scope: ref, dependencies: [done, reduced] },
  );

  // Scroll: content scales down & fades; the 3D bars drift apart.
  useGSAP(
    () => {
      const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-scrub]", {
        scale: reduced ? 1 : 0.9,
        yPercent: reduced ? 0 : -12,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          ...st,
          onUpdate: (self) => {
            heroState.scroll = self.progress;
          },
        },
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <section ref={ref} className="relative isolate flex min-h-svh items-center overflow-hidden pt-[var(--nav-h)]">
      <div aria-hidden className="diagonal-lines absolute inset-y-0 start-0 -z-10 w-1/4 opacity-40 [mask-image:linear-gradient(to_right,black,transparent)] rtl:[mask-image:linear-gradient(to_left,black,transparent)]" />
      <div aria-hidden className="absolute -top-1/4 end-[10%] -z-10 size-[50vw] rounded-full bg-primary/20 blur-[140px]" />

      <div data-hero-scrub className="container-site grid w-full items-center gap-10 lg:grid-cols-12">
        <div data-hero-content data-reveal="preloader" className="relative z-10 lg:col-span-7">
          <p className="reveal-mask mb-6">
            <span data-hero-eyebrow className="eyebrow inline-block">
              {eyebrow}
            </span>
          </p>
          <h1 className="text-display font-extrabold uppercase rtl:normal-case">
            <span className="reveal-mask">
              <span data-hero-line className="block">
                {line1}
              </span>
            </span>
            <span className="reveal-mask">
              <span data-hero-line className="block">
                <span className="text-gradient">{accent}</span>
                {line2 ? <> {line2}</> : null}
              </span>
            </span>
          </h1>

          <ul className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-lead text-muted">
            {pillars.map((p, i) => (
              <li key={p} data-hero-pillar className="flex items-center gap-4">
                {i > 0 ? <span aria-hidden className="size-1.5 rounded-full bg-primary-light shadow-[0_0_10px_rgba(168,85,247,0.9)]" /> : null}
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <span data-hero-cta>
              <MagneticButton href="/contact" size="lg">
                {primaryCta}
              </MagneticButton>
            </span>
            <span data-hero-cta>
              <MagneticButton href="/portfolio" size="lg" variant="ghost">
                {secondaryCta}
              </MagneticButton>
            </span>
          </div>
        </div>

        <div data-hero-visual className="relative -z-0 h-[42vh] min-h-[280px] lg:col-span-5 lg:h-[70vh]">
          <HeroVisual label={visualLabel} />
        </div>
      </div>

      <div data-hero-scroll className="absolute bottom-8 start-1/2 flex -translate-x-1/2 flex-col items-center gap-3 rtl:translate-x-1/2">
        <span className="eyebrow !text-muted">{scrollLabel}</span>
        <span className="relative block h-14 w-px overflow-hidden bg-line">
          <span className="bg-signature animate-scroll-line absolute inset-0" />
        </span>
      </div>
    </section>
  );
}
