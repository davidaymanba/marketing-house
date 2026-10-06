"use client";

import { useLocale } from "next-intl";
import { useRef, type ReactNode } from "react";
import { localeDir } from "@/i18n/routing";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { duration, imageWipe } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealImageProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  start?: string;
  /** Show the "View" cursor label over the image. */
  cursor?: "view" | "drag" | "open";
};

/**
 * Image reveal: a diagonal clip-path wipe (logo angle) opens the frame while
 * the image inside settles from scale 1.2 → 1.
 */
export function RevealImage({ children, className, delay = 0, start = "top 85%", cursor }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dir = localeDir(useLocale());
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;
      const scrollTrigger = { trigger: el, start, once: true };

      if (reduced) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: duration.base, delay, scrollTrigger });
        return;
      }

      const tl = gsap.timeline({ delay, scrollTrigger });
      tl.set(el, { autoAlpha: 1 })
        .fromTo(
          el,
          { clipPath: imageWipe.hidden(dir) },
          { clipPath: imageWipe.visible(), duration: duration.cinematic, ease: "expo.inOut" },
        )
        .fromTo(inner, { scale: 1.2 }, { scale: 1, duration: duration.cinematic + 0.4, ease: "expo.out" }, 0);
    },
    { dependencies: [dir, reduced], scope: ref, revertOnUpdate: true },
  );

  return (
    <div ref={ref} data-reveal data-cursor={cursor} data-cursor-blend className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef} className="size-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
