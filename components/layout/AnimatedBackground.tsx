"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";
import { useRichPointerFx } from "@/lib/hooks";

/**
 * Site-wide ambience: slow-drifting purple light blobs (CSS keyframes, transform
 * only) that lean subtly toward the mouse, plus the film-grain overlay.
 */
export function AnimatedBackground() {
  const rich = useRichPointerFx();
  const mx = useSpring(useMotionValue(0), { stiffness: 30, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 30, damping: 20 });

  useEffect(() => {
    if (!rich) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 60);
      my.set((e.clientY / window.innerHeight - 0.5) * 60);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rich, mx, my]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ x: mx, y: my }}>
          <div className="animate-blob absolute -top-[20%] start-[-10%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.28),transparent_65%)]" />
          <div
            className="animate-blob absolute top-[30%] end-[-15%] size-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(76,29,149,0.35),transparent_65%)]"
            style={{ animationDelay: "-8s", animationDuration: "28s" }}
          />
          <div
            className="animate-blob absolute bottom-[-25%] start-[20%] size-[45vmax] rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.14),transparent_65%)]"
            style={{ animationDelay: "-14s", animationDuration: "34s" }}
          />
        </motion.div>
      </div>
      <div aria-hidden className="grain" />
    </>
  );
}
