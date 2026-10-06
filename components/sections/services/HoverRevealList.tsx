"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { pick, type Service } from "@/lib/content/types";
import { useRichPointerFx } from "@/lib/hooks";
import { ease } from "@/lib/motion";

/** Interactive service list: hovering a row floats its image next to the cursor; dividers draw in. */
export function HoverRevealList({ services, locale }: { services: Service[]; locale: string }) {
  const rich = useRichPointerFx();
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 26, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 26, mass: 0.6 });

  const onMove = (e: PointerEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  const current = active !== null ? services[active] : null;

  return (
    <div className="container-site relative pb-24" onPointerMove={rich ? onMove : undefined}>
      <ul ref={listRef} onPointerLeave={() => setActive(null)}>
        {services.map((service, i) => (
          <motion.li
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.8, ease: ease.expoOut, delay: (i % 4) * 0.06 }}
            className="relative"
            onPointerEnter={() => setActive(i)}
          >
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left bg-line rtl:origin-right"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: ease.expoOut, delay: i * 0.05 }}
            />
            <TransitionLink
              href={`/services/${service.slug}`}
              data-cursor="view"
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-8 md:grid-cols-[4rem_1fr_1fr_auto] md:gap-10 md:py-10"
            >
              <span dir="ltr" className="font-display text-xs font-bold text-primary-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-4">
                <ServiceIcon name={service.icon} className="hidden size-7 shrink-0 text-glow transition-transform duration-500 group-hover:scale-110 md:block" />
                <span className="text-h3 font-extrabold transition-[translate,color] duration-700 ease-expo group-hover:translate-x-3 group-hover:text-glow rtl:group-hover:-translate-x-3">
                  {pick(service.title, locale)}
                </span>
              </span>
              <span className="hidden text-muted md:block">{pick(service.short, locale)}</span>
              <span className="grid size-12 place-items-center rounded-full border border-line transition-[background-color,border-color,rotate] duration-500 ease-expo group-hover:rotate-45 group-hover:border-transparent group-hover:bg-primary rtl:group-hover:-rotate-45">
                <ArrowUpRight aria-hidden className="size-5 rtl:-scale-x-100" />
              </span>
            </TransitionLink>
          </motion.li>
        ))}
      </ul>
      <span aria-hidden className="block h-px bg-line" />

      {rich ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 h-64 w-80 -translate-x-1/2 -translate-y-1/2"
          style={{ x, y }}
        >
          <AnimatePresence mode="popLayout">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.8, clipPath: "inset(50% 0 50% 0)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0% 0)" }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: ease.expoOut }}
                className="absolute inset-0 overflow-hidden rounded-card shadow-glow"
              >
                <BrandVisual src={current.cover} alt="" seed={current.slug} hue={current.hue} variant="bars" className="size-full" sizes="320px" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}
