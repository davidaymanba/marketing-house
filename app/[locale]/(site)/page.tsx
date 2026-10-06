import { getTranslations, setRequestLocale } from "next-intl/server";
import { Branches } from "@/components/sections/home/Branches";
import { ClientsMarquee } from "@/components/sections/home/ClientsMarquee";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { Hero } from "@/components/sections/home/Hero";
import { IntroStatement } from "@/components/sections/home/IntroStatement";
import { Process } from "@/components/sections/home/Process";
import { ServicesStack } from "@/components/sections/home/ServicesStack";
import { Stats } from "@/components/sections/home/Stats";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { TrustStrip } from "@/components/sections/home/TrustStrip";
import {
  getBranches,
  getCategories,
  getClients,
  getProjects,
  getServices,
  getSettings,
  getTestimonials,
} from "@/lib/data";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tc, tf, tb, services, projects, categories, testimonials, clients, branches, settings] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getTranslations("footer"),
    getTranslations("branches"),
    getServices(),
    getProjects(),
    getCategories(),
    getTestimonials(),
    getClients(),
    getBranches(),
    getSettings(),
  ]);

  const featured = projects.filter((p) => p.featured);
  const steps = t.raw("process") as { title: string; text: string }[];

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        line1={t("headlineLine1")}
        accent={t("headlineAccent")}
        line2={t("headlineLine2")}
        pillars={tc.raw("pillars") as string[]}
        primaryCta={tc("startProject")}
        secondaryCta={tc("viewWork")}
        scrollLabel={t("scroll")}
        visualLabel={t("heroAria")}
      />
      <ClientsMarquee title={t("clientsTitle")} clients={clients} />
      <IntroStatement eyebrow={t("introEyebrow")} text={t("intro")} />
      <ServicesStack
        locale={locale}
        services={services}
        eyebrow={t("servicesEyebrow")}
        title={t("servicesTitle")}
        viewLabel={t("viewService")}
        allLabel={t("allServices")}
      />
      <Process eyebrow={t("processEyebrow")} title={t("processTitle")} steps={steps} />
      <Stats
        eyebrow={t("statsEyebrow")}
        items={[
          { value: settings.stats.projects, label: t("stats.projects") },
          { value: settings.stats.clients, label: t("stats.clients") },
          { value: settings.stats.years, label: t("stats.years") },
          { value: settings.stats.campaigns, label: t("stats.campaigns") },
          { value: branches.length, label: t("stats.branches"), suffix: "" },
        ]}
      />
      <TrustStrip
        eyebrow={t("trustEyebrow")}
        title={t("trustTitle")}
        text={t("trustText")}
        commercial={settings.commercialRegNo ? tf("commercialRegNo", { number: settings.commercialRegNo }) : tf("commercialReg")}
        tax={settings.taxCardNo ? tf("taxCardNo", { number: settings.taxCardNo }) : tf("taxCard")}
      />
      <FeaturedWork
        locale={locale}
        projects={featured}
        categories={categories}
        eyebrow={t("workEyebrow")}
        title={t("workTitle")}
        allLabel={t("allWork")}
        placeholderLabel={t("placeholderBadge")}
      />
      <Testimonials
        locale={locale}
        items={testimonials}
        eyebrow={t("testimonialsEyebrow")}
        title={t("testimonialsTitle")}
        placeholderLabel={t("placeholderBadge")}
      />
      <Branches
        locale={locale}
        branches={branches}
        eyebrow={t("branchesEyebrow")}
        title={t("branchesTitle")}
        directions={tb("directions")}
      />
      <CtaBand title={t("ctaTitle")} text={t("ctaText")} cta={tc("startProject")} marquee={t("ctaMarquee")} />
    </>
  );
}
