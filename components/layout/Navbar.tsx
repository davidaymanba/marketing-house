"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { usePathname } from "@/i18n/navigation";
import { ease } from "@/lib/motion";
import { navItems, type ContactInfo } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

/**
 * Transparent over the hero → glass once scrolled. Hides on scroll-down,
 * reappears on scroll-up. Fullscreen menu below lg.
 */
export function Navbar({ contact }: { contact: ContactInfo }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    setScrolled(y > 40);
    if (Math.abs(delta) > 6) {
      setHidden(y > 240 && delta > 0);
      lastY.current = y;
    }
  });

  // Close the menu on route change; freeze scrolling while it is open.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menuOpen && !lenis ? "hidden" : "";
  }, [menuOpen, lenis]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: ease.expoOut }}
        className="fixed inset-x-0 top-0 z-[90]"
      >
        <div
          className={cn(
            "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-expo",
            "border-b border-transparent",
            scrolled && !menuOpen && "glass border-x-0 border-t-0 !border-b-line shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]",
          )}
        >
          <nav
            aria-label={t("mainNav")}
            className="container-site flex h-[var(--nav-h)] items-center justify-between gap-6"
          >
            <TransitionLink href="/" className="group relative z-[2] flex items-center gap-3">
              <LogoMark className="w-11 transition-transform duration-700 ease-expo group-hover:scale-105" barClassName="transition-transform duration-500 ease-expo" />
              <span className="sr-only">{tc("brand")}</span>
              <span className="flex flex-col leading-none" dir="ltr">
                <span className="font-display text-[0.7rem] font-bold tracking-[0.32em] text-fg">MARKETING</span>
                <span className="font-display mt-1 text-[0.55rem] font-bold tracking-[0.5em] text-primary-light">HOUSE</span>
              </span>
            </TransitionLink>

            <ul className="hidden items-center gap-9 lg:flex">
              {navItems.map((item) => (
                <li key={item.key}>
                  <TransitionLink
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "link-underline text-[0.95rem] font-medium transition-colors duration-300",
                      isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {t(item.key)}
                  </TransitionLink>
                </li>
              ))}
            </ul>

            <div className="relative z-[2] flex items-center gap-5">
              <LanguageSwitcher />
              <div className="hidden lg:block">
                <MagneticButton href="/contact" size="sm">
                  {tc("startProject")}
                </MagneticButton>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                className="glass relative grid size-12 place-items-center rounded-full lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute inset-x-0 top-0 h-[1.5px] rounded bg-fg transition-transform duration-500 ease-expo",
                      menuOpen && "translate-y-[5.25px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-[1.5px] rounded bg-fg transition-transform duration-500 ease-expo",
                      menuOpen && "-translate-y-[5.25px] -rotate-45",
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? <MobileMenu isActive={isActive} onNavigate={() => setMenuOpen(false)} contact={contact} /> : null}
      </AnimatePresence>
    </>
  );
}
