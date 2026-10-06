"use client";

import { useRef, type HTMLAttributes, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Spotlight radius in px. */
  size?: number;
};

/**
 * Glass card with a soft purple spotlight that follows the pointer.
 * Updates CSS variables only — no React re-renders on move.
 */
export function SpotlightCard({ className, children, size = 420, onPointerMove, ...props }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      style={{ ["--spot" as string]: `${size}px` }}
      className={cn(
        "glass group/spot relative overflow-hidden rounded-card",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(var(--spot)_circle_at_var(--mx,50%)_var(--my,50%),rgba(168,85,247,0.22),transparent_60%)]",
        "hover:before:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
