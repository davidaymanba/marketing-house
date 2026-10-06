import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { SectionHeading } from "@/components/sections/home/SectionHeading";
import { ProjectCard } from "@/components/sections/portfolio/ProjectCard";
import { Accordion } from "@/components/ui/Accordion";
import { routing } from "@/i18n/routing";
import { pick } from "@/lib/content/types";
import { getCategories, getProjects, getService, getServices } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: pick(service.title, locale),
    description: pick(service.short, locale),
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getService(slug);
  if (!service) notFound();

  const [t, th, tc, projects, categories] = await Promise.all([
    getTranslations("serviceDetail"),
    getTranslations("home"),
    getTranslations("common"),
    getProjects(),
    getCategories(),
  ]);
  const related = projects.filter((p) => p.serviceSlugs.includes(slug)).slice(0, 6);
  const categoryName = (s: string) => {
    const c = categories.find((x) => x.slug === s);
    return c ? pick(c.name, locale) : s;
  };

  return (
    <>
      {/* Hero */}
      <section className="container-site relative grid items-end gap-12 pb-20 pt-[calc(var(--nav-h)+4rem)] lg:grid-cols-12 lg:pt-[calc(var(--nav-h)+7rem)]">
        <div aria-hidden className="absolute -top-20 end-[10%] -z-10 size-[40vw] rounded-full bg-primary/20 blur-[130px]" />
        <div className="lg:col-span-7">
          <TransitionLink href="/services" className="group mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowRight aria-hidden className="size-4 rotate-180 transition-transform duration-500 group-hover:-translate-x-1 rtl:rotate-0 rtl:group-hover:translate-x-1" />
            <span className="link-underline">{t("back")}</span>
          </TransitionLink>
          <div className="mb-8 flex items-center gap-4">
            <span className="bg-signature grid size-14 place-items-center rounded-2xl">
              <ServiceIcon name={service.icon} className="size-7" />
            </span>
            <span className="hairline w-12" />
          </div>
          <RevealText as="h1" split="chars" trigger="mount" waitForPreloader className="text-h1">
            {pick(service.title, locale)}
          </RevealText>
          <RevealText as="p" split="lines" trigger="mount" waitForPreloader delay={0.3} className="mt-8 max-w-2xl text-lead text-muted">
            {pick(service.description, locale)}
          </RevealText>
          <ul className="mt-8 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <li key={tag.en} className="rounded-full border border-line bg-surface/40 px-4 py-1.5 text-sm text-muted">
                {pick(tag, locale)}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <RevealImage className="aspect-[4/5] rounded-card border border-line" delay={0.2} start="top 100%">
            <BrandVisual src={service.cover} alt={pick(service.title, locale)} seed={service.slug} hue={service.hue} variant="bars" priority className="size-full" />
          </RevealImage>
        </div>
      </section>

      {/* Deliverables */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading eyebrow={t("deliverEyebrow")} title={t("deliverTitle")} />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {service.deliverables.map((d, i) => (
            <StaggerItem key={i}>
              <SpotlightCard className="h-full p-7">
                <span dir="ltr" className="font-display text-xs font-bold text-primary-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-10 text-xl font-bold">{pick(d.title, locale)}</h3>
                <p className="mt-3 text-muted">{pick(d.text, locale)}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Mini process */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading eyebrow={t("processEyebrow")} title={t("processTitle")} />
        <Stagger as="ol" className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 md:block" />
          {service.process.map((step, i) => (
            <StaggerItem as="li" key={i} className="relative">
              <span className="bg-signature glow relative grid size-12 place-items-center rounded-full font-display text-sm font-bold" dir="ltr">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold">{pick(step.title, locale)}</h3>
              <p className="mt-2 text-muted">{pick(step.text, locale)}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Related projects */}
      {related.length ? (
        <section className="py-20 md:py-28">
          <div className="container-site">
            <SectionHeading eyebrow={t("relatedEyebrow")} title={t("relatedTitle")} />
          </div>
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none]" data-cursor="drag">
            {related.map((p) => (
              <div key={p.id} className="w-[80vw] shrink-0 snap-start sm:w-[45vw] lg:w-[30vw]">
                <ProjectCard project={p} locale={locale} categoryName={categoryName(p.categorySlug)} placeholderLabel={th("placeholderBadge")} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="container-site grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={t("faqEyebrow")} title={t("faqTitle")} />
        </div>
        <div className="lg:col-span-8">
          <Accordion items={service.faqs.map((f) => ({ q: pick(f.q, locale), a: pick(f.a, locale) }))} />
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} cta={tc("startProject")} marquee={th("ctaMarquee")} />
    </>
  );
}
