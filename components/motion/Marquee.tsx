"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useLocale } from "next-intl";
import { useRef, useState, type ReactNode } from "react";
import { localeDir } from "@/i18n/routing";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  /** Percent of one copy per second. Negative reverses. */
  speed?: number;
  /** Reverse the base direction (for opposing rows). */
  reverse?: boolean;
  /** How many times content repeats inside each copy (fill wide screens). */
  repeat?: number;
  pauseOnHover?: boolean;
  /** Whether scroll velocity boosts / flips the marquee. */
  scrollReactive?: boolean;
};

/**
 * Infinite marquee whose speed and direction react to scroll velocity.
 * Mirrors direction in RTL and pauses on hover.
 */
export function Marquee({
  children,
  className,
  itemClassName,
  speed = 4,
  reverse = false,
  repeat = 2,
  pauseOnHover = true,
  scrollReactive = true,
}: MarqueeProps) {
  const dir = localeDir(useLocale());
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  // Base direction: leftward in LTR, rightward in RTL; `reverse` flips it.
  const baseSign = (dir === "rtl" ? 1 : -1) * (reverse ? -1 : 1);

  useAnimationFrame((_t, delta) => {
    if (reduced || paused) return;
    let moveBy = baseSign * direction.current * speed * (delta / 1000);
    if (scrollReactive) {
      const vf = velocityFactor.get();
      if (vf < 0) direction.current = -1;
      else if (vf > 0) direction.current = 1;
      moveBy += moveBy * Math.abs(vf);
    }
    baseX.set(baseX.get() + moveBy);
  });

  const copy = (key: number) => (
    <div key={key} dir={dir} aria-hidden={key > 0} className="flex shrink-0 items-center">
      {Array.from({ length: repeat }, (_, i) => (
        <div key={i} className={cn("flex shrink-0 items-center", itemClassName)}>
          {children}
        </div>
      ))}
    </div>
  );

  return (
    <div
      dir="ltr"
      className={cn("overflow-hidden", className)}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      {/* Track is always LTR so the wrap math is direction-agnostic. */}
      <motion.div dir="ltr" className="flex w-max will-change-transform" style={{ x }}>
        {copy(0)}
        {copy(1)}
      </motion.div>
    </div>
  );
}
