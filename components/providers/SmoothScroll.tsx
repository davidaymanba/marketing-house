"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

const LenisContext = createContext<Lenis | null>(null);

/** Access the Lenis instance (null when smooth scroll is disabled). */
export const useLenis = () => useContext(LenisContext);

/** Scroll to top/element — works with or without Lenis. */
export function scrollToTarget(
  lenis: Lenis | null,
  target: number | HTMLElement,
  immediate = false,
) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: 1.4 });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}

/**
 * One Lenis instance driven by the GSAP ticker so ScrollTrigger and Lenis
 * stay frame-perfectly in sync. Disabled under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Recalculate trigger positions once webfonts and images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
