"use client";

import { MapPin, Navigation, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { EgyptMap } from "@/components/motion/EgyptMap";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { pick, type Branch } from "@/lib/content/types";
import { ease, stagger } from "@/lib/motion";
import { SectionHeading } from "./SectionHeading";

type Props = {
  locale: string;
  branches: Branch[];
  eyebrow: string;
  title: string;
  directions: string;
};

export function Branches({ locale, branches, eyebrow, title, directions }: Props) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="container-site relative py-24 md:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <ul className="grid gap-5 lg:col-span-7">
          {branches.map((branch, i) => (
            <motion.li
              key={branch.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: ease.expoOut, delay: i * stagger.cards }}
              onPointerEnter={() => setActive(branch.key)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(branch.key)}
              onBlur={() => setActive(null)}
            >
              <SpotlightCard className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="text-h3 font-extrabold">
                      <span className={active === branch.key ? "text-gradient" : undefined}>{pick(branch.city, locale)}</span>
                    </p>
                    <p className="mt-3 flex items-start gap-2 text-muted">
                      <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-primary-light" />
                      {pick(branch.address, locale)}
                    </p>
                    <a href={`tel:+2${branch.phone}`} data-cursor="call" dir="ltr" className="mt-2 inline-flex items-center gap-2 text-fg/90 hover:text-fg">
                      <Phone aria-hidden className="size-4 text-primary-light" />
                      {branch.phone}
                    </a>
                  </div>
                  <a
                    href={branch.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-border group/dir inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
                  >
                    <Navigation aria-hidden className="size-4 transition-transform duration-500 group-hover/dir:rotate-45" />
                    {directions}
                  </a>
                </div>
              </SpotlightCard>
            </motion.li>
          ))}
        </ul>
        <div className="relative mx-auto w-full max-w-md lg:col-span-5">
          <div aria-hidden className="absolute inset-[15%] rounded-full bg-primary/20 blur-[80px]" />
          <EgyptMap
            className="relative w-full"
            active={active}
            pins={branches.map((b) => ({ key: b.key, x: b.mapX, y: b.mapY, label: pick(b.city, locale) }))}
          />
        </div>
      </div>
    </section>
  );
}
