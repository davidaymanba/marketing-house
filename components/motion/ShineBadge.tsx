import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Glass badge with a periodic light sweep across it (CSS, transform-only). */
export function ShineBadge({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={cn("glass relative overflow-hidden rounded-card", className)}>
      <span
        aria-hidden
        className="animate-shine pointer-events-none absolute inset-y-0 -start-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent"
        style={{ animationDelay: `${delay}s` }}
      />
      {children}
    </div>
  );
}
