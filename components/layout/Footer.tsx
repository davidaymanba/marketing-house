import { Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand/SocialIcons";
import { RevealText } from "@/components/motion/RevealText";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/lib/content/types";
import { getBranches, getSettings } from "@/lib/data";
import { navItems } from "@/lib/site";
import { BackToTop } from "./BackToTop";
import { FooterWordmark } from "./FooterWordmark";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const [settings, branches] = await Promise.all([getSettings(), getBranches()]);
  const { commercialRegNo, taxCardNo } = settings;
  const socials = [
    { href: settings.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: settings.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: settings.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
    { href: `https://wa.me/${settings.whatsapp}`, Icon: WhatsappIcon, label: "WhatsApp" },
  ].filter((x) => x.href);

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-bg-elevated/40">
      <div aria-hidden className="diagonal-lines absolute inset-y-0 end-0 w-1/3 opacity-30 [mask-image:linear-gradient(to_left,black,transparent)] rtl:[mask-image:linear-gradient(to_right,black,transparent)]" />
      <div aria-hidden className="absolute -top-40 start-1/2 h-80 w-[60%] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container-site relative pt-20 md:pt-28">
        {/* CTA */}
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">{t("eyebrow")}</p>
            <RevealText as="h2" split="words" className="text-h2">
              {t("headline")}
            </RevealText>
          </div>
          <MagneticButton href="/contact" size="lg">
            {tc("startProject")}
          </MagneticButton>
        </div>

        <div className="hairline my-14 md:my-20" />

        {/* Columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-6 !text-muted">{t("explore")}</h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <TransitionLink href={item.href} className="link-underline text-fg/90 hover:text-fg">
                    {tn(item.key)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow mb-6 !text-muted">{t("contact")}</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:+2${settings.phone}`} data-cursor="call" className="group flex items-center gap-3">
                  <Phone aria-hidden className="size-4 text-primary-light transition-transform duration-500 group-hover:rotate-12" />
                  <span dir="ltr" className="link-underline">{settings.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="group flex items-center gap-3 break-all">
                  <Mail aria-hidden className="size-4 shrink-0 text-primary-light transition-transform duration-500 group-hover:-rotate-12" />
                  <span className="link-underline">{settings.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-5">
            <h3 className="eyebrow mb-6 !text-muted">{t("branches")}</h3>
            <ul className="grid gap-5 sm:grid-cols-3">
              {branches.map((branch) => (
                <li key={branch.key}>
                  <a href={branch.mapLink} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="mb-1.5 flex items-center gap-2 font-semibold">
                      <MapPin aria-hidden className="size-4 text-primary-light transition-transform duration-500 group-hover:-translate-y-0.5" />
                      {pick(branch.city, locale)}
                    </span>
                    <span className="block text-sm leading-relaxed text-muted transition-colors group-hover:text-fg">
                      {pick(branch.address, locale)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="eyebrow mb-6 !text-muted">{t("follow")}</h3>
            <ul className="flex flex-wrap gap-3">
              {socials.map(({ href, Icon, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group relative grid size-11 place-items-center overflow-hidden rounded-full border border-line text-muted transition-colors duration-500 hover:border-transparent hover:text-white"
                  >
                    <span aria-hidden className="bg-signature absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-expo group-hover:translate-y-0" />
                    <Icon className="relative size-[18px] transition-transform duration-500 ease-expo group-hover:scale-110" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative mt-20 px-2 md:mt-28">
        <FooterWordmark />
      </div>

      <div className="container-site relative">
        <div className="hairline mt-10" />
        <div className="flex flex-col gap-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {tc("brand")}. {t("rights")}.
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <span>{commercialRegNo ? t("commercialRegNo", { number: commercialRegNo }) : t("commercialReg")}</span>
            <span aria-hidden className="text-primary">|</span>
            <span>{taxCardNo ? t("taxCardNo", { number: taxCardNo }) : t("taxCard")}</span>
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
