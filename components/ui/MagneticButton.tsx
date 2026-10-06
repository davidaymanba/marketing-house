"use client";

import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Magnetic, MagneticInner } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantProps } from "./button";

type MagneticButtonProps = ButtonVariantProps & {
  href: string;
  children: ReactNode;
  className?: string;
  /** External links (tel:, wa.me, mailto:) skip the page transition. */
  external?: boolean;
  icon?: boolean;
  cursor?: string;
};

/** CTA link: magnetic pull, layered inner text, animated gradient border. */
export function MagneticButton({
  href,
  children,
  className,
  variant,
  size,
  external,
  icon = true,
  cursor,
}: MagneticButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), "group/btn", className);
  const content = (
    <MagneticInner className="gap-3">
      <span>{children}</span>
      {icon ? (
        <span className="relative inline-grid size-5 place-items-center overflow-hidden">
          <ArrowUpRight
            aria-hidden
            className="size-5 transition-transform duration-500 ease-expo group-hover/btn:-translate-y-6 group-hover/btn:translate-x-6 rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-6"
          />
          <ArrowUpRight
            aria-hidden
            className="absolute size-5 translate-y-6 -translate-x-6 transition-transform duration-500 ease-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0 rtl:translate-x-6 rtl:-scale-x-100 rtl:group-hover/btn:translate-x-0"
          />
        </span>
      ) : null}
    </MagneticInner>
  );

  return (
    <Magnetic>
      {external ? (
        <a href={href} className={classes} data-cursor={cursor} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <TransitionLink href={href} className={classes} data-cursor={cursor}>
          {content}
        </TransitionLink>
      )}
    </Magnetic>
  );
}
