import Image from "next/image";
import { cn } from "@/lib/utils";

/** Deterministic 0–1 pseudo-random numbers from a string seed. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

type BrandVisualProps = {
  /** Real image (Supabase Storage URL). When missing, a generated brand visual renders. */
  src?: string | null;
  alt: string;
  seed: string;
  hue?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Composition style of the generated art. */
  variant?: "prism" | "bars" | "portrait";
};

/**
 * Image slot that falls back to brand-styled generated art (gradients, prisms
 * at the logo angle, LogoMark bars) — used for clearly marked placeholders.
 */
export function BrandVisual({
  src,
  alt,
  seed,
  hue = 270,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  variant = "prism",
}: BrandVisualProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-bg-elevated", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const r = seeded(seed);
  const id = `bv-${seed.replace(/[^a-z0-9]/gi, "")}`;
  const h2 = hue + 24;
  const prisms = Array.from({ length: 5 }, (_, i) => {
    const x = 8 + i * 22 + r() * 14;
    const top = 10 + r() * 40;
    const w = 10 + r() * 14;
    return { x, top, w, o: 0.25 + r() * 0.55 };
  });

  return (
    <div role="img" aria-label={alt} className={cn("relative overflow-hidden bg-bg-elevated", className)}>
      <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={`hsl(${hue} 70% 6%)`} />
            <stop offset="0.6" stopColor={`hsl(${hue} 65% 14%)`} />
            <stop offset="1" stopColor={`hsl(${h2} 70% 24%)`} />
          </linearGradient>
          <linearGradient id={`${id}-p`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={`hsl(${hue} 70% 22%)`} />
            <stop offset="0.5" stopColor={`hsl(${hue} 80% 52%)`} />
            <stop offset="1" stopColor={`hsl(${h2} 90% 78%)`} />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx={`${30 + r() * 40}%`} cy="30%" r="60%">
            <stop offset="0" stopColor={`hsl(${h2} 95% 70%)`} stopOpacity="0.55" />
            <stop offset="1" stopColor={`hsl(${hue} 90% 40%)`} stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}-lines`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="white" strokeOpacity="0.06" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="160" height="120" fill={`url(#${id}-bg)`} />
        <rect width="160" height="120" fill={`url(#${id}-glow)`} />
        {variant === "portrait" ? (
          <g fill={`url(#${id}-p)`} opacity="0.85">
            <circle cx="80" cy="50" r="20" />
            <path d="M36 120c4-30 22-44 44-44s40 14 44 44Z" />
          </g>
        ) : variant === "bars" ? (
          <g transform={`translate(${18 + r() * 10} 30) scale(0.15)`} fill={`url(#${id}-p)`}>
            <path d="M0 285 L157 285 L399 0 L252 0 Z" />
            <path d="M212 285 L367 285 L607 0 L447 0 Z" />
            <path d="M425 285 L632 46 L842 285 L694 285 L630 208 L567 285 Z" />
          </g>
        ) : (
          prisms.map((p, i) => (
            <polygon
              key={i}
              points={`${p.x},120 ${p.x + p.w},120 ${p.x + p.w + 30},${p.top} ${p.x + 30},${p.top}`}
              fill={`url(#${id}-p)`}
              opacity={p.o}
            />
          ))
        )}
        <rect width="160" height="120" fill={`url(#${id}-lines)`} />
      </svg>
    </div>
  );
}
