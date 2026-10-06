"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin gradient bar at the top; grows from the reading-start side. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="bg-signature fixed inset-x-0 top-0 z-[95] h-[2px] origin-left rtl:origin-right"
      style={{ scaleX }}
    />
  );
}
