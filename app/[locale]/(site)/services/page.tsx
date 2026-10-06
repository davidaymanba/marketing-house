import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { HoverRevealList } from "@/components/sections/services/HoverRevealList";
import { getServices } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return pageMetadata({ locale, path: "/services", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, th, tc, services] = await Promise.all([
    getTranslations("services"),
    getTranslations("home"),
    getTranslations("common"),
    getServices(),
  ]);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <HoverRevealList services={services} locale={locale} />
      <CtaBand title={th("ctaTitle")} text={th("ctaText")} cta={tc("startProject")} marquee={th("ctaMarquee")} />
    </>
  );
}
