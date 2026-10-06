"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { ease, stagger as staggerTokens } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: staggerTokens.cards } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.expoOut } },
};

/** Staggers its <StaggerItem> children in when scrolled into view. */
export function Stagger({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}
