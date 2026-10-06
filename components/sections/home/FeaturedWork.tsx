import { ArrowUpRight } from "lucide-react";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { pick, type Project, type ProjectCategory } from "@/lib/content/types";

type Props = {
  locale: string;
  projects: Project[];
  categories: ProjectCategory[];
  eyebrow: string;
  title: string;
  allLabel: string;
  placeholderLabel: string;
};

export function FeaturedWork({ locale, projects, categories, eyebrow, title, allLabel, placeholderLabel }: Props) {
  const categoryName = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    return c ? pick(c.name, locale) : slug;
  };

  return (
    <HorizontalScroll
      className="py-24 lg:py-0"
      header={
        <div className="container-site mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="hairline w-12" />
              <p className="eyebrow">{eyebrow}</p>
            </div>
            <h2 className="text-h2">{title}</h2>
          </div>
          <MagneticButton href="/portfolio" variant="ghost">
            {allLabel}
          </MagneticButton>
        </div>
      }
    >
      {projects.map((project, i) => (
        <TransitionLink
          key={project.id}
          href={`/portfolio/${project.slug}`}
          data-cursor="view"
          className="group relative block w-[82vw] shrink-0 snap-center sm:w-[60vw] lg:w-[42vw] xl:w-[36vw]"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line lg:aspect-[5/6]">
            <div data-hscroll-parallax className="absolute inset-[-10%]">
              <BrandVisual
                src={project.cover}
                alt={pick(project.title, locale)}
                seed={project.slug}
                hue={project.hue}
                className="size-full transition-transform duration-[1.4s] ease-expo group-hover:scale-110"
                sizes="(min-width: 1024px) 40vw, 80vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
            {project.isPlaceholder ? (
              <span className="glass absolute start-5 top-5 rounded-full px-3 py-1 text-xs text-muted">{placeholderLabel}</span>
            ) : null}
            <span dir="ltr" className="font-display absolute end-5 top-5 text-xs font-bold text-white/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
              <div className="overflow-hidden">
                <p className="mb-2 text-sm text-glow">
                  {categoryName(project.categorySlug)} · <span dir="ltr">{project.year}</span>
                </p>
                <h3 className="text-h3 transition-transform duration-700 ease-expo group-hover:-translate-y-1">{pick(project.title, locale)}</h3>
                <p className="mt-2 line-clamp-2 max-w-md text-sm text-muted">{pick(project.summary, locale)}</p>
              </div>
              <span className="bg-signature grid size-12 shrink-0 scale-75 place-items-center rounded-full opacity-0 transition-[scale,opacity] duration-500 ease-expo group-hover:scale-100 group-hover:opacity-100">
                <ArrowUpRight aria-hidden className="size-5 rtl:-scale-x-100" />
              </span>
            </div>
          </div>
        </TransitionLink>
      ))}
    </HorizontalScroll>
  );
}
