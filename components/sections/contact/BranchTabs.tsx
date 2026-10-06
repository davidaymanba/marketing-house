"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { pick, type Branch } from "@/lib/content/types";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Labels = { hours: string; directions: string; mapTitle: string };

/** Branch switcher (sliding pill) — address card animates, dark-styled map crossfades. */
export function BranchTabs({ branches, locale, labels }: { branches: Branch[]; locale: string; labels: Labels }) {
  const [activeId, setActiveId] = useState(branches.find((b) => b.isMain)?.id ?? branches[0]?.id);
  const active = branches.find((b) => b.id === activeId) ?? branches[0];
  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <LayoutGroup id="branch-tabs">
          <div role="tablist" className="glass mb-6 inline-flex flex-wrap gap-1 rounded-full p-1.5">
            {branches.map((b) => (
              <button
                key={b.id}
                role="tab"
                type="button"
                aria-selected={b.id === active.id}
                aria-controls="branch-panel"
                onClick={() => setActiveId(b.id)}
                className={cn("relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors", b.id === active.id ? "text-white" : "text-muted hover:text-fg")}
              >
                {b.id === active.id ? <motion.span layoutId="branch-pill" className="bg-signature absolute inset-0 rounded-full" transition={{ type: "spring", stiffness: 380, damping: 32 }} /> : null}
                <span className="relative">{pick(b.city, locale)}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            id="branch-panel"
            role="tabpanel"
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: ease.expoOut }}
            className="glass space-y-5 rounded-card p-7"
          >
            <h3 className="text-h3">{pick(active.name, locale)}</h3>
            <p className="flex items-start gap-3 text-muted">
              <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-primary-light" />
              {pick(active.address, locale)}
            </p>
            <a href={`tel:+2${active.phone}`} dir="ltr" data-cursor="call" className="flex items-center gap-3 font-semibold rtl:flex-row-reverse rtl:justify-end">
              <Phone aria-hidden className="size-5 text-primary-light" />
              {active.phone}
            </a>
            <div className="flex items-start gap-3">
              <Clock aria-hidden className="mt-1 size-5 shrink-0 text-primary-light" />
              <div>
                <p className="text-sm text-muted">{labels.hours}</p>
                <p className="font-semibold">{pick(active.workingHours, locale)}</p>
              </div>
            </div>
            <a href={active.mapLink} target="_blank" rel="noopener noreferrer" className="gradient-border inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-surface">
              <Navigation aria-hidden className="size-4" />
              {labels.directions}
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-card border border-line bg-bg-elevated lg:col-span-7">
        <AnimatePresence initial={false}>
          <motion.iframe
            key={active.id}
            src={active.mapEmbedUrl}
            title={labels.mapTitle.replace("{branch}", pick(active.name, locale))}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 size-full border-0 [filter:invert(0.92)_hue-rotate(200deg)_saturate(0.6)_brightness(0.9)_contrast(0.95)]"
          />
        </AnimatePresence>
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-card shadow-[inset_0_0_80px_rgba(11,7,23,0.9)]" />
      </div>
    </div>
  );
}
