"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { RevealImage } from "@/components/motion/RevealImage";
import { useLenis } from "@/components/providers/SmoothScroll";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string | null; seed: string; hue: number; alt: string };

/** `imageOf` is a template with {current} and {total} placeholders. */
type Labels = { close: string; prev: string; next: string; imageOf: string };

const fill = (tpl: string, current: number, total: number) =>
  tpl.replace("{current}", String(current)).replace("{total}", String(total));

/** Scroll-revealed gallery grid + keyboard-accessible lightbox. */
export function Gallery({ images, labels, rtl }: { images: GalleryImage[]; labels: Labels; rtl: boolean }) {
  const [index, setIndex] = useState<number | null>(null);
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      openerRef.current?.focus();
    };
  }, [index, go, lenis, rtl]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={img.seed}
            type="button"
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setIndex(i);
            }}
            className={cn("block text-start", i % 3 === 0 && "md:col-span-2")}
            aria-label={img.alt}
          >
            <RevealImage cursor="open" className={cn("rounded-card border border-line", i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/5]")}>
              <BrandVisual src={img.src} alt={img.alt} seed={img.seed} hue={img.hue} className="size-full transition-transform duration-[1.2s] ease-expo hover:scale-105" />
            </RevealImage>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current && index !== null ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={fill(labels.imageOf, index + 1, images.length)}
            data-lenis-prevent
            className="fixed inset-0 z-[105] flex items-center justify-center bg-bg/90 p-4 backdrop-blur-xl md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIndex(null)}
          >
            <motion.div
              key={current.seed}
              className="relative aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-card"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: ease.expoOut }}
              onClick={(e) => e.stopPropagation()}
            >
              <BrandVisual src={current.src} alt={current.alt} seed={current.seed} hue={current.hue} className="size-full" sizes="90vw" />
            </motion.div>

            <p className="absolute bottom-6 start-1/2 -translate-x-1/2 text-sm text-muted rtl:translate-x-1/2" dir="ltr">
              {index + 1} / {images.length}
            </p>
            <button ref={closeRef} type="button" onClick={() => setIndex(null)} aria-label={labels.close} className="glass absolute end-5 top-5 grid size-12 place-items-center rounded-full">
              <X aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={labels.prev} className="glass absolute start-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full">
              <ChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={labels.next} className="glass absolute end-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full">
              <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
