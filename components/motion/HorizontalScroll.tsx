"use client";

import { useLocale } from "next-intl";
import { useRef, type ReactNode } from "react";
import { localeDir } from "@/i18n/routing";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Desktop: the section pins and its track moves horizontally with scroll
 * (reversed in RTL). Elements marked [data-hscroll-parallax] drift inside
 * their masks. Mobile / reduced motion: native swipeable scroll-snap row.
 */
export function HorizontalScroll({
  header,
  children,
  className,
}: {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dir = localeDir(useLocale());

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track) return;
        const sign = dir === "rtl" ? 1 : -1;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => sign * distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-hscroll-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: -8 * sign },
            {
              xPercent: 8 * sign,
              ease: "none",
              scrollTrigger: { trigger: el, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [dir] },
  );

  return (
    <section ref={ref} className={cn("relative overflow-hidden lg:flex lg:h-svh lg:flex-col lg:justify-center", className)}>
      {header}
      <div
        ref={trackRef}
        className={cn(
          "flex gap-5 px-[var(--gutter)] md:gap-8",
          "max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:pb-6 max-lg:[scrollbar-width:none]",
          "lg:w-max lg:will-change-transform",
        )}
      >
        {children}
      </div>
    </section>
  );
}
