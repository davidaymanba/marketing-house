"use client";

import { useAnimate } from "motion/react";
import { useLocale } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { localeDir, type Locale } from "@/i18n/routing";
import { ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ease } from "@/lib/motion";
import { scrollToTarget, useLenis } from "./SmoothScroll";

type NavigateOptions = { locale?: Locale };
type TransitionContextValue = {
  navigate: (href: string, options?: NavigateOptions) => void;
  transitioning: boolean;
};

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  transitioning: false,
});

export const useTransitionRouter = () => useContext(TransitionContext);

/**
 * Page transitions: a diagonal purple panel (logo angle) sweeps across, the
 * route changes underneath while covered, then the panel exits on the far side.
 * Browser back/forward navigates instantly (no cover), as does reduced motion.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const dir = localeDir(locale);
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const pending = useRef(false);
  const [transitioning, setTransitioning] = useState(false);

  const cover = useCallback(async () => {
    const root = scope.current;
    if (!root) return;
    const from = dir === "rtl" ? "100%" : "-100%";
    root.style.visibility = "visible";
    await Promise.all([
      animate('[data-panel="a"]', { x: [from, "0%"] }, { duration: 0.7, ease: ease.smooth }),
      animate('[data-panel="b"]', { x: [from, "0%"] }, { duration: 0.7, ease: ease.smooth, delay: 0.08 }),
      animate("[data-transition-logo]", { opacity: [0, 1], scale: [0.85, 1] }, { duration: 0.4, delay: 0.4 }),
    ]);
  }, [animate, dir, scope]);

  const reveal = useCallback(async () => {
    const root = scope.current;
    if (!root) return;
    const to = dir === "rtl" ? "-100%" : "100%";
    await Promise.all([
      animate("[data-transition-logo]", { opacity: 0, scale: 0.9 }, { duration: 0.25 }),
      animate('[data-panel="b"]', { x: to }, { duration: 0.75, ease: ease.smooth, delay: 0.1 }),
      animate('[data-panel="a"]', { x: to }, { duration: 0.75, ease: ease.smooth, delay: 0.18 }),
    ]);
    root.style.visibility = "hidden";
  }, [animate, dir, scope]);

  const navigate = useCallback(
    (href: string, options?: NavigateOptions) => {
      const targetLocale = options?.locale ?? locale;
      const samePage = href === pathname && targetLocale === locale;
      if (samePage || pending.current) return;

      if (reduced) {
        router.push(href, { locale: targetLocale as Locale });
        return;
      }

      pending.current = true;
      setTransitioning(true);
      lenis?.stop();
      cover().then(() => {
        router.push(href, { locale: targetLocale as Locale, scroll: false });
      });
    },
    [cover, lenis, locale, pathname, reduced, router],
  );

  // Route committed while covered → reset scroll, then reveal the new page.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    scrollToTarget(lenis, 0, true);
    lenis?.start();
    requestAnimationFrame(() => ScrollTrigger.refresh());
    reveal().then(() => setTransitioning(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  return (
    <TransitionContext.Provider value={{ navigate, transitioning }}>
      {children}
      <div
        ref={scope}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
        style={{ visibility: "hidden" }}
      >
        {/* Skewed track at the logo angle; panels translate along it. */}
        <div
          className="absolute inset-y-0"
          style={{
            insetInlineStart: "-50vh",
            width: "calc(100vw + 100vh)",
            transform: "skewX(-38deg)",
          }}
        >
          <div data-panel="a" className="absolute inset-0 bg-primary-deep" style={{ transform: "translateX(-100%)" }} />
          <div data-panel="b" className="bg-signature absolute inset-0" style={{ transform: "translateX(-100%)" }} />
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <div data-transition-logo style={{ opacity: 0 }}>
            <LogoMark variant="solid" className="w-24 animate-pulse text-white md:w-32" />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link>;

/** Drop-in replacement for the i18n <Link> that plays the page transition. */
export function TransitionLink({ href, locale, onClick, target, ...rest }: TransitionLinkProps) {
  const { navigate } = useTransitionRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (target === "_blank" || typeof href !== "string" || href.includes("#")) return;
    event.preventDefault();
    navigate(href, { locale: locale as Locale | undefined });
  };

  return <Link href={href} locale={locale} target={target} onClick={handleClick} {...rest} />;
}
