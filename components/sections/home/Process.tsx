"use client";

import { Lightbulb, Radio, Target, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const ICONS = [Target, Lightbulb, Radio, TrendingUp];
const GLOWS = ["rgba(124,58,237,0.45)", "rgba(192,132,252,0.4)", "rgba(99,102,241,0.4)", "rgba(168,85,247,0.5)"];

type Step = { title: string; text: string };

/**
 * Desktop: the section pins, a diagonal progress line draws, and each pillar
 * takes over in turn while the background glow shifts colour.
 * Mobile / reduced motion: a vertical timeline with simple reveals.
 */
export function Process({ eyebrow, title, steps }: { eyebrow: string; title: string; steps: Step[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-step-panel]");
        const glows = gsap.utils.toArray<HTMLElement>("[data-step-glow]");
        const navs = gsap.utils.toArray<HTMLElement>("[data-step-nav]");
        const setActive = (index: number) =>
          navs.forEach((n, i) => n.toggleAttribute("data-active", i === index));

        gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 30 });
        gsap.set(glows.slice(1), { opacity: 0 });
        setActive(0);

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ref.current,
            pin: true,
            start: "top top",
            end: `+=${steps.length * 90}%`,
            scrub: 0.6,
            onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
          },
        });

        tl.fromTo("[data-progress-fill]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length }, 0);
        panels.forEach((panel, i) => {
          if (i === 0) return;
          const at = i - 0.5;
          tl.to(panels[i - 1]!, { autoAlpha: 0, yPercent: -30, duration: 0.5 }, at)
            .fromTo(panel, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, at + 0.25)
            .to(glows[i - 1]!, { opacity: 0, duration: 0.6 }, at)
            .to(glows[i]!, { opacity: 1, duration: 0.6 }, at);
        });
        tl.to({}, { duration: 0.5 });
      });

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step-panel]").forEach((panel) => {
          gsap.from(panel, { autoAlpha: 0, y: 40, duration: 0.8, scrollTrigger: { trigger: panel, start: "top 85%", once: true } });
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:flex lg:h-svh lg:items-center lg:py-0">
      {GLOWS.map((color, i) => (
        <div
          key={color}
          data-step-glow
          aria-hidden
          className="absolute end-[-10%] top-1/2 -z-10 size-[70vmax] -translate-y-1/2 rounded-full blur-[60px] max-lg:hidden"
          style={{ background: `radial-gradient(circle, ${color}, transparent 60%)` }}
        />
      ))}

      {/* Diagonal progress line at the logo angle. */}
      <div aria-hidden className="absolute bottom-[8%] start-[-5%] hidden h-px w-[85vmax] origin-left rotate-[-28deg] bg-line lg:block rtl:origin-right rtl:rotate-[28deg]">
        <div data-progress-fill className="bg-signature h-full origin-left shadow-[0_0_20px_rgba(168,85,247,0.8)] rtl:origin-right" />
      </div>

      <div className="container-site grid w-full gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="mb-6 flex items-center gap-4">
            <span className="hairline w-12" />
            <p className="eyebrow">{eyebrow}</p>
          </div>
          <h2 className="text-h2">{title}</h2>

          <ol className="mt-12 hidden space-y-5 lg:block">
            {steps.map((step, i) => (
              <li
                key={step.title}
                data-step-nav
                className="group flex items-center gap-5 text-muted transition-colors duration-500 data-[active]:text-fg"
              >
                <span dir="ltr" className="font-display w-8 text-xs font-bold text-primary-light">
                  0{i + 1}
                </span>
                <span className="h-px w-8 origin-left scale-x-50 bg-current transition-transform duration-500 group-data-[active]:scale-x-150 rtl:origin-right" />
                <span className="text-lg font-semibold">{step.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6 lg:h-[56vh]">
          <div className="space-y-6 lg:space-y-0">
            {steps.map((step, i) => {
              const Icon = ICONS[i] ?? Target;
              return (
                <article
                  key={step.title}
                  data-step-panel
                  className={cn(
                    "glass relative overflow-hidden rounded-card p-8 md:p-12",
                    "lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
                  )}
                >
                  <div className="flex items-center gap-5">
                    <span className="bg-signature glow grid size-16 place-items-center rounded-2xl lg:size-20">
                      <Icon aria-hidden className="size-8 lg:size-10" strokeWidth={1.5} />
                    </span>
                    <span dir="ltr" className="font-display text-5xl font-bold text-white/10 lg:text-8xl">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-h1 font-extrabold">
                    <span className="text-gradient">{step.title}</span>
                  </h3>
                  <p className="mt-6 max-w-xl text-lead text-muted">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
