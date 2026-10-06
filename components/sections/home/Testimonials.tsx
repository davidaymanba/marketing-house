"use client";

import { motion, useMotionValue } from "motion/react";
import { Quote, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { pick, type Testimonial } from "@/lib/content/types";
import { SectionHeading } from "./SectionHeading";

type Props = {
  locale: string;
  items: Testimonial[];
  eyebrow: string;
  title: string;
  placeholderLabel: string;
};

/** Draggable carousel with inertia. Works with mouse, touch and keyboard (arrows). */
export function Testimonials({ locale, items, eyebrow, title, placeholderLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);
  const rtl = locale === "ar";

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const t = trackRef.current;
      if (!c || !t) return;
      const overflow = Math.max(0, t.scrollWidth - c.clientWidth);
      // In RTL the track overflows to the left, so dragging goes positive.
      setBounds(rtl ? { left: 0, right: overflow } : { left: -overflow, right: 0 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [rtl, items.length]);

  const nudge = (dirSign: number) => {
    const step = (trackRef.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 400;
    const next = Math.min(bounds.right, Math.max(bounds.left, x.get() + dirSign * (step + 24)));
    x.set(next);
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} title={title} />
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") nudge(-1);
          if (e.key === "ArrowLeft") nudge(1);
        }}
        className="container-site cursor-grab active:cursor-grabbing"
        data-cursor="drag"
      >
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={bounds}
          dragElastic={0.12}
          dragTransition={{ power: 0.3, timeConstant: 260, bounceStiffness: 300, bounceDamping: 30 }}
          style={{ x }}
          className="flex w-max gap-6"
        >
          {items.map((item) => (
            <figure
              key={item.id}
              className="glass relative flex w-[84vw] shrink-0 select-none flex-col rounded-card p-8 sm:w-[520px] md:p-10"
            >
              <Quote aria-hidden className="absolute end-8 top-8 size-14 text-primary/25" strokeWidth={1} />
              <div className="mb-6 flex gap-1 text-glow" role="img" aria-label={`${item.rating}/5`}>
                {Array.from({ length: item.rating }, (_, i) => (
                  <Star key={i} aria-hidden className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl font-medium leading-relaxed md:text-2xl">
                “{pick(item.quote, locale)}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-4 pt-10">
                <BrandVisual
                  src={item.photo}
                  alt={pick(item.name, locale)}
                  seed={item.id}
                  variant="portrait"
                  className="size-14 shrink-0 rounded-full"
                  sizes="56px"
                />
                <div>
                  <p className="font-bold">{pick(item.name, locale)}</p>
                  <p className="text-sm text-muted">
                    {pick(item.role, locale)} — {pick(item.company, locale)}
                  </p>
                </div>
                {item.isPlaceholder ? (
                  <span className="ms-auto rounded-full border border-line px-3 py-1 text-xs text-muted">{placeholderLabel}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
