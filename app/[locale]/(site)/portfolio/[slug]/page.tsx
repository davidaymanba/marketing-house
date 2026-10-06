import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { Counter } from "@/components/motion/Counter";
import { Parallax } from "@/components/motion/Parallax";
import { RevealText } from "@/components/motion/RevealText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { Gallery, type GalleryImage } from "@/components/sections/portfolio/Gallery";
import { NextProject } from "@/components/sections/portfolio/NextProject";
import { routing } from "@/i18n/routing";
import { pick } from "@/lib/content/types";
import { getCategories, getProject, getProjects, getServices } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: pick(project.title, locale),
    description: pick(project.summary, locale),
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProject(slug);
  if (!project) notFound();

  const [t, th, projects, categories, services] = await Promise.all([
    getTranslations("project"),
    getTranslations("home"),
    getProjects(),
    getCategories(),
    getServices(),
  ]);

  const title = pick(project.title, locale);
  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length]!;
  const category = categories.find((c) => c.slug === project.categorySlug);
  const serviceNames = project.serviceSlugs
    .map((s) => services.find((x) => x.slug === s))
    .filter(Boolean)
    .map((s) => pick(s!.title, locale));

  const gallery: GalleryImage[] = (
    project.gallery.length
      ? project.gallery.map((src, i) => ({ src, seed: `${slug}-g${i}` }))
      : Array.from({ length: 4 }, (_, i) => ({ src: null, seed: `${slug}-g${i}` }))
  ).map((g, i) => ({ ...g, hue: project.hue + i * 8, alt: `${title} — ${i + 1}` }));

  const info = [
    { label: t("client"), value: pick(project.client, locale) },
    { label: t("year"), value: String(project.year) },
    { label: t("category"), value: category ? pick(category.name, locale) : "" },
    { label: t("services"), value: serviceNames.join("، ") },
  ];

  return (
    <>
      {/* Fullscreen cover with parallax */}
      <section className="relative h-svh min-h-[560px] overflow-hidden">
        <Parallax speed={0.18} className="absolute inset-0 scale-110">
          <BrandVisual src={project.cover} alt={title} seed={project.slug} hue={project.hue} priority className="size-full" sizes="100vw" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-bg/20" />
        <div className="container-site relative flex h-full flex-col justify-end pb-16 md:pb-24">
          <TransitionLink href="/portfolio" className="group mb-8 inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowRight aria-hidden className="size-4 rotate-180 transition-transform duration-500 group-hover:-translate-x-1 rtl:rotate-0 rtl:group-hover:translate-x-1" />
            <span className="link-underline">{t("back")}</span>
          </TransitionLink>
          {project.isPlaceholder ? <p className="glass mb-6 w-fit rounded-full px-3 py-1 text-xs text-muted">{th("placeholderBadge")}</p> : null}
          <RevealText as="h1" split="chars" trigger="mount" waitForPreloader className="text-display font-extrabold">
            {title}
          </RevealText>
          <p className="mt-6 max-w-2xl text-lead text-muted">{pick(project.summary, locale)}</p>
        </div>
      </section>

      {/* Story + sticky sidebar */}
      <section className="container-site grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <dl className="glass grid grid-cols-2 gap-6 rounded-card p-7 lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:grid-cols-1">
            {info.map((row) => (
              <div key={row.label} className="border-line lg:border-b lg:pb-5 lg:last:border-0 lg:last:pb-0">
                <dt className="eyebrow mb-2 !text-muted">{row.label}</dt>
                <dd className="font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="space-y-20 lg:col-span-8">
          {[
            { label: t("challenge"), text: pick(project.challenge, locale), n: "01" },
            { label: t("solution"), text: pick(project.solution, locale), n: "02" },
          ].map((block) => (
            <article key={block.n}>
              <div className="mb-6 flex items-center gap-4">
                <span dir="ltr" className="font-display text-xs font-bold text-primary-light">{block.n}</span>
                <span className="hairline w-12" />
                <h2 className="eyebrow">{block.label}</h2>
              </div>
              <RevealText as="p" split="lines" className="text-h3 font-semibold leading-snug">
                {block.text}
              </RevealText>
            </article>
          ))}

          <article>
            <div className="mb-8 flex items-center gap-4">
              <span dir="ltr" className="font-display text-xs font-bold text-primary-light">03</span>
              <span className="hairline w-12" />
              <h2 className="eyebrow">{t("results")}</h2>
            </div>
            <Stagger className="grid gap-5 sm:grid-cols-3">
              {project.results.map((r) => (
                <StaggerItem key={r.label.en} className="glass rounded-card p-6">
                  <p className="text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-none" dir="ltr">
                    <Counter value={r.value} suffix={r.suffix} className="text-gradient" />
                  </p>
                  <p className="mt-3 text-muted">{pick(r.label, locale)}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </article>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-site py-12 md:py-20">
        <div className="mb-10 flex items-center gap-4">
          <span className="hairline w-12" />
          <h2 className="eyebrow">{t("gallery")}</h2>
        </div>
        <Gallery
          images={gallery}
          rtl={locale === "ar"}
          labels={{
            close: t("close"),
            prev: t("prev"),
            next: t("nextImage"),
            imageOf: t.raw("imageOf") as string,
          }}
        />
      </section>

      <NextProject
        href={`/portfolio/${next.slug}`}
        label={t("next")}
        title={pick(next.title, locale)}
        seed={next.slug}
        hue={next.hue}
        cover={next.cover}
      />
    </>
  );
}
