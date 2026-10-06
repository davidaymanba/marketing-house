/**
 * The Marketing House mark geometry, traced from the official badge (viewBox 842×285).
 * Plain module (no "use client") so server code (OG images) can read it too.
 */
export const LOGO_BARS = [
  "M0 285 L157 285 L399 0 L252 0 Z",
  "M212 285 L367 285 L607 0 L447 0 Z",
  "M425 285 L632 46 L842 285 L694 285 L630 208 L567 285 Z",
] as const;

export const LOGO_VIEWBOX = { width: 842, height: 285 } as const;
