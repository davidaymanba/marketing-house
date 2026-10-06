import { ArrowUpRight } from "lucide-react";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { StackingCards } from "@/components/motion/StackingCards";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { pick, type Service } from "@/lib/content/types";
import { SectionHeading } from "./SectionHeading";

type Props = {
  locale: string;
  services: Service[];
  eyebrow: string;
  title: string;
  viewLabel: string;
  allLabel: string;
};

export function ServicesStack({ locale, services, eyebrow, title, viewLabel, allLabel }: Props) {
  return (
    <section className="container-site relative py-24 md:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} />

      <StackingCards>
        {services.map((service, i) => (
          <SpotlightCard key={service.id} className="!bg-bg-elevated !backdrop-blur-none shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.8)]">
            <TransitionLink
              href={`/services/${service.slug}`}
              data-cursor="view"
              className="group grid min-h-[min(68vh,560px)] gap-8 p-7 md:grid-cols-12 md:p-12"
            >
              <div className="flex flex-col md:col-span-7">
                <div className="flex items-center justify-between">
                  <span dir="ltr" className="font-display text-sm font-bold text-primary-light">
                    {String(i + 1).padStart(2, "0")}
                    <span className="text-muted"> / {String(services.length).padStart(2, "0")}</span>
                  </span>
                  <span className="grid size-14 place-items-center rounded-2xl border border-line bg-surface/60 text-glow transition-transform duration-700 ease-expo group-hover:rotate-[-8deg] group-hover:scale-110">
                    <ServiceIcon name={service.icon} className="size-7" />
                  </span>
                </div>

                <h3 className="mt-10 text-h2 md:mt-auto">{pick(service.title, locale)}</h3>
                <p className="mt-5 max-w-xl text-lead text-muted">{pick(service.short, locale)}</p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                  <ul className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <li key={tag.en} className="rounded-full border border-line bg-surface/40 px-4 py-1.5 text-sm text-muted">
                        {pick(tag, locale)}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-3 font-semibold">
                    <span className="link-underline">{viewLabel}</span>
                    <span className="bg-signature grid size-11 place-items-center rounded-full transition-transform duration-500 ease-expo group-hover:rotate-45 rtl:group-hover:-rotate-45">
                      <ArrowUpRight aria-hidden className="size-5 rtl:-scale-x-100" />
                    </span>
                  </span>
                </div>
              </div>

              <div className="relative hidden overflow-hidden rounded-[16px] md:col-span-5 md:block">
                <BrandVisual
                  src={service.cover}
                  alt={pick(service.title, locale)}
                  seed={service.slug}
                  hue={service.hue}
                  variant="bars"
                  className="size-full transition-transform duration-[1.2s] ease-expo group-hover:scale-105"
                />
              </div>
            </TransitionLink>
          </SpotlightCard>
        ))}
      </StackingCards>

      <div className="mt-16 flex justify-center">
        <MagneticButton href="/services" variant="ghost" size="lg">
          {allLabel}
        </MagneticButton>
      </div>
    </section>
  );
}
