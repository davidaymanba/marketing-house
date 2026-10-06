import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RevealText } from "@/components/motion/RevealText";
import { SectionHeading } from "@/components/sections/home/SectionHeading";
import { BranchTabs } from "@/components/sections/contact/BranchTabs";
import { ContactCards } from "@/components/sections/contact/ContactCards";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { pick } from "@/lib/content/types";
import { getBranches, getServices, getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/contact", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, services, branches, settings] = await Promise.all([
    getTranslations("contact"),
    getServices(),
    getBranches(),
    getSettings(),
  ]);

  return (
    <>
      <section className="container-site grid gap-12 pb-20 pt-[calc(var(--nav-h)+4rem)] lg:grid-cols-12 lg:pt-[calc(var(--nav-h)+7rem)]">
        <div aria-hidden className="absolute start-0 top-0 -z-10 size-[45vw] rounded-full bg-primary/20 blur-[140px]" />
        <div className="lg:col-span-5">
          <div className="mb-8 flex items-center gap-4">
            <span className="hairline w-12" />
            <p className="eyebrow">{t("eyebrow")}</p>
          </div>
          <RevealText as="h1" split="chars" trigger="mount" waitForPreloader className="text-h1">
            {t("title")}
          </RevealText>
          <p className="mb-10 mt-6 text-lead text-muted">{t("intro")}</p>
          <ContactCards
            phone={settings.phone}
            whatsapp={settings.whatsapp}
            email={settings.email}
            labels={{ phone: t("phone"), whatsapp: t("whatsapp"), email: t("email"), copy: t("copy"), copied: t("copied") }}
          />
        </div>
        <div className="lg:col-span-7">
          <ContactForm
            services={services.map((s) => ({ value: s.id, label: pick(s.title, locale) }))}
            branches={branches.map((b) => ({ value: b.id, label: pick(b.name, locale) }))}
          />
        </div>
      </section>

      <section className="container-site py-20 md:py-28">
        <SectionHeading eyebrow={t("hours")} title={t("branchesTitle")} />
        <BranchTabs
          branches={branches}
          locale={locale}
          labels={{ hours: t("hours"), directions: t("directions"), mapTitle: t.raw("mapTitle") as string }}
        />
      </section>
    </>
  );
}
