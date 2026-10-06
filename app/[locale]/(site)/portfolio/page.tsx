import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioGrid } from "@/components/sections/portfolio/PortfolioGrid";
import { getCategories, getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  return pageMetadata({ locale, path: "/portfolio", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, th, projects, categories] = await Promise.all([
    getTranslations("portfolio"),
    getTranslations("home"),
    getProjects(),
    getCategories(),
  ]);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <PortfolioGrid
        projects={projects}
        categories={categories}
        locale={locale}
        allLabel={t("all")}
        emptyLabel={t("empty")}
        filterLabel={t("filterLabel")}
        placeholderLabel={th("placeholderBadge")}
      />
    </>
  );
}
