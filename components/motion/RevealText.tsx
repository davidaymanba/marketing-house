"use client";

import { useLocale } from "next-intl";
import { useRef, type ReactNode } from "react";
import SplitType from "split-type";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { duration, hasArabic, stagger as staggerTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealTextProps = {
  children: ReactNode;
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** "chars" is automatically downgraded to "words" for Arabic (letter joining). */
  split?: "lines" | "words" | "chars";
  className?: string;
  delay?: number;
  stagger?: number;
  /** "scroll" (default) reveals when in view; "mount" plays immediately. */
  trigger?: "scroll" | "mount";
  /** Hold the reveal until the preloader starts its exit. */
  waitForPreloader?: boolean;
  start?: string;
  id?: string;
};

/**
 * Headline reveal: text is split into lines (masks) and words/chars that slide
 * up from below the mask. The DOM is restored (split reverted) when finished.
 */
export function RevealText({
  children,
  as = "div",
  split = "words",
  className,
  delay = 0,
  stagger,
  trigger = "scroll",
  waitForPreloader = false,
  start = "top 88%",
  id,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();
  const { done: preloaderDone } = usePreloader();

  useGSAP(
    (_ctx, contextSafe) => {
      const el = ref.current;
      if (!el) return;

      const scrollTrigger =
        trigger === "scroll" ? { trigger: el, start, once: true } : undefined;

      if (reduced) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: duration.base, delay, scrollTrigger });
        return;
      }
      if (waitForPreloader && !preloaderDone) return;

      const arabic = locale === "ar" || hasArabic(el.textContent ?? "");
      const mode = split === "chars" && arabic ? "words" : split;
      let splitter: SplitType | null = null;
      let cancelled = false;

      const run = contextSafe!(() => {
        if (cancelled) return;
        splitter = new SplitType(el, {
          types: mode === "chars" ? "lines,words,chars" : "lines,words",
          lineClass: "reveal-mask",
          tagName: "span",
        });

        const lines = splitter.lines ?? [];
        const targets = (mode === "chars" ? splitter.chars : splitter.words) ?? [];
        const lineIndex = (target: Element) =>
          Math.max(0, lines.findIndex((line) => line.contains(target)));

        gsap.set(el, { autoAlpha: 1 });
        gsap.from(targets, {
          yPercent: 115,
          rotate: mode === "chars" ? 4 : 0,
          duration: duration.slow,
          ease: "expo.out",
          delay,
          stagger:
            mode === "lines"
              ? (_i: number, target: Element) => lineIndex(target) * 0.12
              : (stagger ?? (mode === "chars" ? 0.025 : staggerTokens.text)),
          scrollTrigger,
          onComplete: () => {
            splitter?.revert();
            splitter = null;
          },
        });
      });

      document.fonts.ready.then(run);

      return () => {
        cancelled = true;
        splitter?.revert();
      };
    },
    { dependencies: [reduced, preloaderDone, locale], scope: ref, revertOnUpdate: true },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} id={id} data-reveal={waitForPreloader ? "preloader" : ""} className={cn(className)}>
      {children}
    </Tag>
  );
}
