/**
 * Global motion tokens. Every animation in the site pulls from here so the
 * whole experience shares one rhythm.
 */

export const ease = {
  expoOut: [0.16, 1, 0.3, 1] as const,
  smooth: [0.65, 0, 0.35, 1] as const,
};

/** Same curves as GSAP-compatible strings. */
export const gsapEase = {
  expoOut: "expo.out",
  smooth: "power3.inOut",
};

export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 1.2,
  cinematic: 1.8,
};

export const stagger = {
  text: 0.06,
  cards: 0.12,
};

/** The logo bars' slant, in degrees from horizontal. */
export const LOGO_ANGLE = 52;

/** Arabic script range — used to forbid per-character splitting. */
const ARABIC_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

export const hasArabic = (text: string) => ARABIC_RE.test(text);

/** Common Framer Motion variants. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.expoOut },
  },
};

/* ------------------------------------------------------------------------ */
/* Diagonal clip-path wipes at the logo angle ("/" slant, mirrored in RTL). */
/* ------------------------------------------------------------------------ */

type Dir = "ltr" | "rtl";

/** Region between a left and right edge (in %), both slanted like the logo bars. */
export function diagonalClip(left: number, right: number, slant = 30) {
  return `polygon(${left + slant}% 0%, ${right + slant}% 0%, ${right}% 100%, ${left}% 100%)`;
}

/** Wipe states: enter from the reading-start side, exit toward the reading-end side. */
export const wipe = {
  hiddenStart: (dir: Dir) => (dir === "rtl" ? diagonalClip(140, 140) : diagonalClip(-40, -40)),
  visible: () => diagonalClip(-40, 140),
  hiddenEnd: (dir: Dir) => (dir === "rtl" ? diagonalClip(-40, -40) : diagonalClip(140, 140)),
};

/** Image reveal clip (thin diagonal sliver → full frame). */
export const imageWipe = {
  hidden: (dir: Dir) => (dir === "rtl" ? diagonalClip(100, 140, 20) : diagonalClip(-40, -20, 20)),
  visible: () => diagonalClip(-40, 140, 20),
};
