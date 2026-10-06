import { getTranslations } from "next-intl/server";
import { NotFoundScene } from "@/components/sections/NotFoundScene";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return <NotFoundScene title={t("title")} text={t("text")} cta={t("cta")} />;
}
