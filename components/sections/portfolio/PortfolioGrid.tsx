"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { pick, type Project, type ProjectCategory } from "@/lib/content/types";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[5/4]"];

type Props = {
  projects: Project[];
  categories: ProjectCategory[];
  locale: string;
  allLabel: string;
  emptyLabel: string;
  filterLabel: string;
  placeholderLabel: string;
};

/** Category filter with a sliding active pill + masonry grid with layout animations. */
export function PortfolioGrid({ projects, categories, locale, allLabel, emptyLabel, filterLabel, placeholderLabel }: Props) {
  const [active, setActive] = useState("all");
  const used = useMemo(() => categories.filter((c) => projects.some((p) => p.categorySlug === c.slug)), [categories, projects]);
  const filtered = active === "all" ? projects : projects.filter((p) => p.categorySlug === active);
  const filters = [{ slug: "all", label: allLabel }, ...used.map((c) => ({ slug: c.slug, label: pick(c.name, locale) }))];
  const categoryName = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    return c ? pick(c.name, locale) : slug;
  };

  return (
    <section className="container-site pb-24">
      <LayoutGroup>
        <div role="tablist" aria-label={filterLabel} className="glass mb-12 inline-flex max-w-full flex-wrap gap-1 rounded-full p-1.5">
          {filters.map((f) => (
            <button
              key={f.slug}
              role="tab"
              type="button"
              aria-selected={active === f.slug}
              onClick={() => setActive(f.slug)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300",
                active === f.slug ? "text-white" : "text-muted hover:text-fg",
              )}
            >
              {active === f.slug ? (
                <motion.span
                  layoutId="portfolio-pill"
                  className="bg-signature absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: ease.expoOut, delay: (i % 6) * 0.05 }}
                className="mb-6 break-inside-avoid"
              >
                <ProjectCard
                  project={project}
                  locale={locale}
                  categoryName={categoryName(project.categorySlug)}
                  placeholderLabel={placeholderLabel}
                  aspect={ASPECTS[i % ASPECTS.length]}
                  headingLevel="h2"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 ? <p className="py-20 text-center text-muted">{emptyLabel}</p> : null}
      </LayoutGroup>
    </section>
  );
}
