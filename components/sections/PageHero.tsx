import type { ReactNode } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { cn } from "@/lib/utils";

/** Inner-page hero: eyebrow, split-text headline (waits for preloader on first load), intro. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container-site relative pb-16 pt-[calc(var(--nav-h)+5rem)] md:pb-24 md:pt-[calc(var(--nav-h)+8rem)]", className)}>
      <div aria-hidden className="diagonal-lines absolute inset-y-0 end-0 -z-10 w-1/3 opacity-30 [mask-image:linear-gradient(to_left,black,transparent)] rtl:[mask-image:linear-gradient(to_right,black,transparent)]" />
      <div aria-hidden className="absolute -top-20 start-[20%] -z-10 size-[40vw] rounded-full bg-primary/20 blur-[130px]" />
      <div className="mb-8 flex items-center gap-4">
        <span className="hairline w-12" />
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <RevealText as="h1" split="chars" trigger="mount" waitForPreloader className="text-h1 max-w-5xl">
        {title}
      </RevealText>
      {intro ? (
        <RevealText as="p" split="lines" trigger="mount" waitForPreloader delay={0.3} className="mt-8 max-w-2xl text-lead text-muted">
          {intro}
        </RevealText>
      ) : null}
      {children}
    </section>
  );
}
