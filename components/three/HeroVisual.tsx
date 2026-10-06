"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * Hero side visual. Always renders a light static version (SVG mark + CSS
 * prisms). On desktop without reduced motion, the R3F scene loads after the
 * browser is idle and crossfades in; rendering pauses when off-screen.
 */
export function HeroVisual({ label }: { label: string }) {
  const desktop = useMediaQuery("(min-width: 1024px) and (hover: hover)");
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!desktop || reduced) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = idle(() => setLoad(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(handle as number);
  }, [desktop, reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} role="img" aria-label={label} className="relative size-full">
      {/* Static version */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-1000 ease-expo",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="absolute inset-[10%] rounded-full bg-primary/25 blur-[90px]" />
        <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(closest-side,black,transparent)]">
          {[18, 38, 62, 80].map((x, i) => (
            <div
              key={x}
              className="absolute bottom-0 w-[14%] bg-gradient-to-t from-primary-deep/10 via-primary/30 to-glow/40"
              style={{
                insetInlineStart: `${x}%`,
                height: `${55 + (i % 2) * 25}%`,
                clipPath: "polygon(0 100%, 100% 100%, 100% 30%, 50% 0, 0 30%)",
                transform: "skewX(-14deg)",
                opacity: 0.6 - i * 0.08,
              }}
            />
          ))}
        </div>
        <LogoMark variant="glow" className="relative w-[70%] max-w-[460px] drop-shadow-[0_0_60px_rgba(168,85,247,0.5)]" />
      </div>

      {load ? (
        <div
          className={cn(
            "absolute inset-[-15%] transition-opacity duration-1000 ease-expo [mask-image:radial-gradient(closest-side,black_60%,transparent)]",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroScene active={visible} onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
