import { getTranslations } from "next-intl/server";
import { pick } from "@/lib/content/types";
import { getProject } from "@/lib/data";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Marketing House";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const project = await getProject(slug);
  return renderOg({ locale, eyebrow: t("eyebrow"), title: project ? pick(project.title, locale) : t("title") });
}
