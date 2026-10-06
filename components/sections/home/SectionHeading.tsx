import type { ReactNode } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { cn } from "@/lib/utils";

/** Eyebrow with hairline + split-text heading, reused by every section. */
export function SectionHeading({
  eyebrow,
  title,
  className,
  align = "start",
  children,
}: {
  eyebrow: string;
  title: string;
  className?: string;
  align?: "start" | "center";
  children?: ReactNode;
}) {
  return (
    <div className={cn("mb-14 md:mb-20", align === "center" && "text-center", className)}>
      <div className={cn("mb-6 flex items-center gap-4", align === "center" && "justify-center")}>
        <span className="hairline w-12" />
        <p className="eyebrow">{eyebrow}</p>
        {align === "center" ? <span className="hairline w-12" /> : null}
      </div>
      <RevealText as="h2" split="words" className={cn("text-h2 max-w-4xl", align === "center" && "mx-auto")}>
        {title}
      </RevealText>
      {children}
    </div>
  );
}
