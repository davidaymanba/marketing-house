import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { getBranches, getSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, settings, branches] = await Promise.all([getTranslations("common"), getSettings(), getBranches()]);
  const contact = {
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    facebook: settings.facebook,
    instagram: settings.instagram,
    linkedin: settings.linkedin,
  };

  return (
    <>
      <a
        href="#main"
        className="glass fixed start-4 top-4 z-[130] -translate-y-24 rounded-full px-5 py-3 text-sm font-semibold transition-transform focus:translate-y-0"
      >
        {t("skipToContent")}
      </a>
      <OrganizationJsonLd locale={locale} settings={settings} branches={branches} />
      <Preloader />
      <AnimatedBackground />
      <ScrollProgress />
      <Navbar contact={contact} />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
      <WhatsAppButton whatsapp={settings.whatsapp} />
      <Cursor />
    </>
  );
}
