"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Travel as a fraction of the element height. Negative moves against scroll. */
  speed?: number;
  /** Optional horizontal travel (mirrors nothing — pass a signed value). */
  axis?: "y" | "x";
};

/** Scroll-linked translate. Halved on mobile, disabled under reduced motion. */
export function Parallax({ children, className, speed = 0.15, axis = "y" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const amount = (mobile ? speed / 2 : speed) * 100;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const value = useTransform(scrollYProgress, [0, 1], [`${-amount}%`, `${amount}%`]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        className="size-full will-change-transform"
        style={reduced ? undefined : axis === "y" ? { y: value } : { x: value }}
      >
        {children}
      </motion.div>
    </div>
  );
}
