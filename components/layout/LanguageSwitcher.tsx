"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransitionRouter } from "@/components/providers/TransitionProvider";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Switches locale on the current path, through the page transition. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { navigate } = useTransitionRouter();
  const next = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      lang={next}
      onClick={() => navigate(pathname, { locale: next })}
      className={cn(
        "link-underline text-sm font-semibold text-muted transition-colors duration-300 hover:text-fg",
        className,
      )}
    >
      {t("switchLanguage")}
      <span className="sr-only" lang={locale}> — {t("switchLanguageLabel")}</span>
    </button>
  );
}
