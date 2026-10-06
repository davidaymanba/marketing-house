"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

const COLORS = ["#7C3AED", "#A855F7", "#C084FC", "#4C1D95", "#FFFFFF"];

/** Lightweight DOM confetti burst in brand colours (transform + opacity only). */
export function Confetti({ count = 36 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 120 + Math.random() * 160;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 80,
          r: Math.random() * 540 - 270,
          c: COLORS[i % COLORS.length],
          w: 6 + Math.random() * 6,
          h: 10 + Math.random() * 8,
          d: Math.random() * 0.15,
        };
      }),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute start-1/2 top-1/3 z-10">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-[2px]"
          style={{ width: p.w, height: p.h, background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 220], opacity: [1, 1, 0], rotate: p.r, scale: 1 }}
          transition={{ duration: 1.8, delay: p.d, ease: [0.16, 1, 0.3, 1], times: [0, 0.45, 1] }}
        />
      ))}
    </div>
  );
}
