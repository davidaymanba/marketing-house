import { ArrowUpRight } from "lucide-react";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { TiltCard } from "@/components/motion/TiltCard";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { pick, type Project } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/** Portfolio card: zoom inside mask, title slides up, 3D tilt. */
export function ProjectCard({
  project,
  locale,
  categoryName,
  placeholderLabel,
  aspect = "aspect-[4/5]",
  headingLevel = "h3",
}: {
  project: Project;
  locale: string;
  categoryName: string;
  placeholderLabel: string;
  aspect?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <TiltCard max={6}>
      <TransitionLink href={`/portfolio/${project.slug}`} data-cursor="view" className="group block">
        <div className={cn("relative overflow-hidden rounded-card border border-line", aspect)}>
          <BrandVisual
            src={project.cover}
            alt={pick(project.title, locale)}
            seed={project.slug}
            hue={project.hue}
            className="absolute inset-0 transition-transform duration-[1.4s] ease-expo group-hover:scale-110"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
          {project.isPlaceholder ? (
            <span className="glass absolute start-4 top-4 rounded-full px-3 py-1 text-xs text-muted">{placeholderLabel}</span>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-sm text-glow">
              {categoryName} · <span dir="ltr">{project.year}</span>
            </p>
            <div className="mt-1 flex items-end justify-between gap-4">
              <Heading className="text-2xl font-extrabold transition-transform duration-700 ease-expo md:translate-y-2 md:group-hover:translate-y-0">
                {pick(project.title, locale)}
              </Heading>
              <span className="bg-signature grid size-10 shrink-0 place-items-center rounded-full opacity-0 transition-[opacity,translate] duration-500 ease-expo group-hover:opacity-100 md:translate-y-3 md:group-hover:translate-y-0">
                <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted opacity-0 transition-[opacity,translate] duration-700 ease-expo group-hover:opacity-100 md:translate-y-3 md:group-hover:translate-y-0 max-md:opacity-100">
              {pick(project.summary, locale)}
            </p>
          </div>
        </div>
      </TransitionLink>
    </TiltCard>
  );
}
