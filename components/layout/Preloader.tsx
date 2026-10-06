"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { PRELOADER_KEY, usePreloader } from "@/components/providers/PreloaderProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { localeDir } from "@/i18n/routing";
import { gsap, useGSAP } from "@/lib/gsap";
import { wipe } from "@/lib/motion";

const WORDS = ["MARKETING", "HOUSE"] as const;

/**
 * First-visit preloader (≤2.5s, click to skip):
 * bars slide in along their diagonal → 0–100 counter → wordmark letters
 * collapse from wide spacing → diagonal clip-path wipe reveals the page.
 * Rendered on the server as an overlay so the hero underneath paints early.
 */
export function Preloader() {
  const t = useTranslations("preloader");
  const dir = localeDir(useLocale());
  const { finish } = usePreloader();
  const lenis = useLenis();
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [mounted, setMounted] = useState(true);

  // Repeat visit / reduced motion → hidden by the gate script; finish at once.
  useEffect(() => {
    if (document.documentElement.classList.contains("mh-no-preloader")) {
      finish();
      setMounted(false);
    }
  }, [finish]);

  useEffect(() => {
    if (!mounted) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [lenis, mounted]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || document.documentElement.classList.contains("mh-no-preloader")) return;

      const letters = gsap.utils.toArray<HTMLElement>("[data-pl-letter]");
      const center = (letters.length - 1) / 2;
      const counter = { v: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(PRELOADER_KEY, "1");
          } catch {}
          setMounted(false);
        },
      });
      tlRef.current = tl;

      tl.fromTo(
        "[data-bar]",
        { x: -90, y: 105, autoAlpha: 0 },
        { x: 0, y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.14, ease: "expo.out" },
        0.1,
      )
        .fromTo(
          letters,
          { x: (i) => (i - center) * 22, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out", stagger: { each: 0.025, from: "center" } },
          0.35,
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.75,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0,
        )
        .fromTo("[data-pl-progress]", { scaleX: 0 }, { scaleX: 1, duration: 1.75, ease: "power2.inOut" }, 0)
        .addLabel("exit", 1.9)
        .call(() => finish(), [], "exit")
        .to("[data-pl-content]", { y: -30, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "exit")
        .fromTo(
          "[data-pl-layer='front']",
          { clipPath: wipe.visible() },
          { clipPath: wipe.hiddenEnd(dir), duration: 0.6, ease: "expo.inOut" },
          "exit",
        )
        .fromTo(
          "[data-pl-layer='accent']",
          { clipPath: wipe.visible() },
          { clipPath: wipe.hiddenEnd(dir), duration: 0.6, ease: "expo.inOut" },
          "exit+=0.08",
        );
    },
    { scope: rootRef },
  );

  const skip = () => {
    const tl = tlRef.current;
    if (tl && tl.time() < tl.labels.exit!) tl.seek("exit");
  };

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      data-preloader
      onClick={skip}
      role="presentation"
      className="fixed inset-0 z-[110] cursor-pointer select-none"
    >
      <div data-pl-layer="accent" className="bg-signature absolute inset-0" />
      <div data-pl-layer="front" className="absolute inset-0 bg-bg">
        <div aria-hidden className="diagonal-lines absolute inset-y-0 start-0 w-1/3 opacity-25 [mask-image:linear-gradient(to_right,black,transparent)]" />
        <div aria-hidden className="absolute start-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[100px] rtl:translate-x-1/2" />

        <div data-pl-content className="relative flex h-full flex-col items-center justify-center gap-10">
          <LogoMark variant="glow" className="w-36 md:w-48" barClassName="opacity-0" />
          <div dir="ltr" aria-label="Marketing House" className="flex flex-col items-center gap-3">
            {WORDS.map((word, w) => (
              <div key={word} className="flex items-center gap-4">
                {w === 1 ? <span aria-hidden className="hairline w-10 md:w-16" /> : null}
                <span
                  aria-hidden
                  className={
                    w === 0
                      ? "font-display flex gap-[0.45em] text-lg font-bold text-fg md:text-2xl"
                      : "font-display flex gap-[0.6em] text-sm font-bold text-primary-light md:text-base"
                  }
                >
                  {word.split("").map((l, i) => (
                    <span key={i} data-pl-letter className="inline-block opacity-0">
                      {l}
                    </span>
                  ))}
                </span>
                {w === 1 ? <span aria-hidden className="hairline w-10 md:w-16" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-[var(--gutter)] pb-8">
          <span className="eyebrow !text-muted">{t("skip")}</span>
          <span dir="ltr" className="font-display text-5xl font-bold leading-none text-fg/90 tabular-nums md:text-7xl">
            <span ref={counterRef}>000</span>
          </span>
        </div>
        <div data-pl-progress className="bg-signature absolute inset-x-0 bottom-0 h-[2px] origin-left rtl:origin-right" />
      </div>
    </div>
  );
}
