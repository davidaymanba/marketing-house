import { Eye, FileBadge, Handshake, Rocket, ShieldCheck, Sparkles, Target } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Counter } from "@/components/motion/Counter";
import { ShineBadge } from "@/components/motion/ShineBadge";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { Timeline } from "@/components/sections/about/Timeline";
import { TeamGrid } from "@/components/sections/about/TeamGrid";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { IntroStatement } from "@/components/sections/home/IntroStatement";
import { SectionHeading } from "@/components/sections/home/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { getBranches, getSettings, getTeam } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const VALUE_ICONS = [Eye, Sparkles, Handshake, Rocket];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: "/about", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, th, tc, team, branches, settings] = await Promise.all([
    getTranslations("about"),
    getTranslations("home"),
    getTranslations("common"),
    getTeam(),
    getBranches(),
    getSettings(),
  ]);
  const values = t.raw("values") as { title: string; text: string }[];
  const timeline = t.raw("timeline") as { year: string; title: string; text: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} />
      <IntroStatement eyebrow={th("introEyebrow")} text={t("story")} />

      {/* Mission / vision + branches stat */}
      <section className="container-site grid gap-6 py-12 md:grid-cols-3">
        {[
          { Icon: Target, title: t("missionTitle"), text: t("mission") },
          { Icon: Eye, title: t("visionTitle"), text: t("vision") },
        ].map(({ Icon, title, text }) => (
          <TiltCard key={title}>
            <SpotlightCard className="h-full p-8 md:p-10">
              <span className="bg-signature grid size-14 place-items-center rounded-2xl">
                <Icon aria-hidden className="size-7" strokeWidth={1.5} />
              </span>
              <h2 className="mt-8 text-h3">{title}</h2>
              <p className="mt-4 text-lead text-muted">{text}</p>
            </SpotlightCard>
          </TiltCard>
        ))}
        <div className="bg-signature relative flex flex-col justify-end overflow-hidden rounded-card p-8 md:p-10">
          <div aria-hidden className="diagonal-lines absolute inset-0 opacity-40" />
          <p className="relative text-[clamp(4rem,9vw,7rem)] font-extrabold leading-none" dir="ltr">
            <Counter value={branches.length} />
          </p>
          <p className="relative mt-3 text-lg font-semibold">{t("branchesStat")}</p>
        </div>
      </section>

      {/* Values */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading eyebrow={t("valuesEyebrow")} title={t("valuesTitle")} />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[i] ?? Sparkles;
            return (
              <StaggerItem key={v.title}>
                <SpotlightCard className="group h-full p-7">
                  <Icon aria-hidden className="size-9 text-glow transition-transform duration-700 ease-expo group-hover:-rotate-12 group-hover:scale-110" strokeWidth={1.4} />
                  <h3 className="mt-8 text-xl font-bold">{v.title}</h3>
                  <p className="mt-3 text-muted">{v.text}</p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Timeline */}
      <section className="container-site grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={t("timelineEyebrow")} title={t("timelineTitle")} />
        </div>
        <div className="lg:col-span-7">
          <Timeline items={timeline} />
        </div>
      </section>

      {/* Team */}
      <section className="container-site py-20 md:py-28">
        <SectionHeading eyebrow={t("teamEyebrow")} title={t("teamTitle")} />
        <TeamGrid team={team} locale={locale} placeholderLabel={th("placeholderBadge")} />
      </section>

      {/* Legal */}
      <section className="container-site py-20">
        <SectionHeading eyebrow={t("legalEyebrow")} title={t("legalTitle")} />
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { Icon: ShieldCheck, label: t("commercialReg"), value: settings.commercialRegNo },
            { Icon: FileBadge, label: t("taxCard"), value: settings.taxCardNo },
          ].map(({ Icon, label, value }, i) => (
            <ShineBadge key={label} delay={i * 1.4} className="flex items-center gap-5 p-7">
              <span className="bg-signature grid size-14 shrink-0 place-items-center rounded-2xl">
                <Icon aria-hidden className="size-7" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-muted">{label}</p>
                <p className="mt-1 text-xl font-bold" dir={value ? "ltr" : undefined}>
                  {value || t("pending")}
                </p>
              </div>
            </ShineBadge>
          ))}
        </div>
      </section>

      <CtaBand title={th("ctaTitle")} text={th("ctaText")} cta={tc("startProject")} marquee={th("ctaMarquee")} />
    </>
  );
}
