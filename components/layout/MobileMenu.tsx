"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/brand/SocialIcons";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { localeDir } from "@/i18n/routing";
import { ease, wipe } from "@/lib/motion";
import { navItems, type ContactInfo } from "@/lib/site";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  contact: ContactInfo;
};

/** Fullscreen menu: diagonal background wipe + big links rising from masks. */
export function MobileMenu({ isActive, onNavigate, contact }: MobileMenuProps) {
  const t = useTranslations("nav");
  const dir = localeDir(useLocale());

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t("menu")}
      className="fixed inset-0 z-[85] flex flex-col bg-bg lg:hidden"
      initial={{ clipPath: wipe.hiddenStart(dir) }}
      animate={{ clipPath: wipe.visible(), transition: { duration: 0.9, ease: ease.smooth } }}
      exit={{ clipPath: wipe.hiddenStart(dir), transition: { duration: 0.7, ease: ease.smooth, delay: 0.15 } }}
    >
      <div aria-hidden className="diagonal-lines absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_60%)]" />
      <div aria-hidden className="absolute -bottom-1/4 start-1/4 size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.35),transparent_65%)]" />

      <nav className="container-site relative flex flex-1 flex-col justify-center pt-[var(--nav-h)]">
        <ul className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <li key={item.key} className="reveal-mask">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%", transition: { duration: 0.9, ease: ease.expoOut, delay: 0.35 + i * 0.07 } }}
                exit={{ y: "110%", transition: { duration: 0.4, ease: ease.smooth, delay: i * 0.03 } }}
              >
                <TransitionLink
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "group flex items-baseline gap-4 py-1 text-[clamp(2.5rem,11vw,4.5rem)] font-extrabold leading-[1.15]",
                    isActive(item.href) ? "text-gradient" : "text-fg",
                  )}
                >
                  <span className="font-display text-xs font-bold text-primary-light" dir="ltr">
                    0{i + 1}
                  </span>
                  <span className="transition-transform duration-500 ease-expo group-hover:translate-x-3 rtl:group-hover:-translate-x-3">
                    {t(item.key)}
                  </span>
                </TransitionLink>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="container-site relative flex flex-wrap items-center justify-between gap-4 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.6, ease: ease.expoOut } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <div className="hairline mb-4 w-full" />
        <a href={`tel:+2${contact.phone}`} dir="ltr" className="text-lg font-semibold">
          {contact.phone}
        </a>
        <div className="flex gap-3">
          {[
            { href: contact.facebook, Icon: FacebookIcon, label: "Facebook" },
            { href: contact.instagram, Icon: InstagramIcon, label: "Instagram" },
            { href: contact.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
          ].filter((x) => x.href).map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="glass grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-fg"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
