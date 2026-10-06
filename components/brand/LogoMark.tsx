"use client";

import { useId, type SVGProps } from "react";
import { LOGO_BARS, LOGO_VIEWBOX } from "@/lib/brand";
import { cn } from "@/lib/utils";

export { LOGO_BARS, LOGO_VIEWBOX } from "@/lib/brand";

type LogoMarkProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  title?: string;
  barClassName?: string;
  /** "gradient" (default), "solid" (currentColor), or "glow" (gradient + soft glow). */
  variant?: "gradient" | "solid" | "glow";
};

/**
 * The Marketing House mark: three slanted parallelogram bars forming an "M" / roof.
 * Each bar is its own <path data-bar="0|1|2"> so it can be animated individually.
 */
export function LogoMark({
  title,
  className,
  barClassName,
  variant = "gradient",
  ...props
}: LogoMarkProps) {
  const id = useId().replace(/:/g, "");
  const gradId = `mh-grad-${id}`;
  const glowId = `mh-glow-${id}`;
  const fill = variant === "solid" ? "currentColor" : `url(#${gradId})`;

  return (
    <svg
      viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("overflow-visible", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        {/* Per-bar gradient: deep violet bottom-left → bright lavender top-right. */}
        <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        {variant === "glow" ? (
          <filter id={glowId} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ) : null}
      </defs>
      <g filter={variant === "glow" ? `url(#${glowId})` : undefined}>
        {LOGO_BARS.map((d, i) => (
          <path key={i} d={d} data-bar={i} fill={fill} className={barClassName} />
        ))}
      </g>
    </svg>
  );
}
