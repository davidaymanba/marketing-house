import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans, Syncopate } from "next/font/google";

/** Eyebrow labels only (small, decorative) — not preloaded to keep the critical path lean. */
export const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-syncopate",
  display: "swap",
  preload: false,
});

/** Variable font: one file covers every weight (400–800). */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

/** Arabic glyphs only — Latin falls back to Jakarta in the font stack. */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const fontVariables = `${syncopate.variable} ${jakarta.variable} ${plexArabic.variable}`;
