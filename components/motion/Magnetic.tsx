"use client";

import { motion, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { createContext, useContext, useRef, type PointerEvent, type ReactNode } from "react";
import { useRichPointerFx } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const spring = { stiffness: 180, damping: 14, mass: 0.2 };

type InnerValues = { x: MotionValue<number>; y: MotionValue<number> } | null;
const MagneticInnerContext = createContext<InnerValues>(null);

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the wrapper follows the pointer (0–1 of the offset). */
  strength?: number;
  /** Extra travel for <MagneticInner> content, relative to the wrapper. */
  innerStrength?: number;
};

/**
 * Pulls its content toward the pointer and springs back on leave.
 * Inner content (wrapped in <MagneticInner>) moves at a different strength
 * for a layered, parallax feel. Disabled on touch & reduced motion.
 */
export function Magnetic({ children, className, strength = 0.35, innerStrength = 0.25 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useRichPointerFx();

  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);
  const innerX = useSpring(useMotionValue(0), spring);
  const innerY = useSpring(useMotionValue(0), spring);

  const onMove = (event: PointerEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
    innerX.set(dx * innerStrength);
    innerY.set(dy * innerStrength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  return (
    <MagneticInnerContext.Provider value={enabled ? { x: innerX, y: innerY } : null}>
      <motion.span
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={enabled ? { x, y } : undefined}
        className={cn("inline-block will-change-transform", className)}
      >
        {children}
      </motion.span>
    </MagneticInnerContext.Provider>
  );
}

/** Content inside a <Magnetic> that travels at its own strength. */
export function MagneticInner({ children, className }: { children: ReactNode; className?: string }) {
  const values = useContext(MagneticInnerContext);
  return (
    <motion.span style={values ?? undefined} className={cn("inline-flex items-center gap-[inherit]", className)}>
      {children}
    </motion.span>
  );
}
