"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setAdminLocale } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

/** Toggles the dashboard language (cookie) and re-renders the admin. */
export function AdminLocaleSwitch({ compact, className }: { compact?: boolean; className?: string }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      disabled={pending}
      lang={next}
      title={compact ? t("switchLanguageLabel") : undefined}
      onClick={() =>
        startTransition(async () => {
          await setAdminLocale(next);
          router.refresh();
        })
      }
      className={cn(
        "flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-muted transition-colors hover:bg-surface/60 hover:text-fg disabled:opacity-50",
        compact && "justify-center px-0",
        className,
      )}
    >
      <Languages aria-hidden className="size-4 shrink-0" />
      {compact ? <span className="sr-only">{t("switchLanguageLabel")}</span> : <span>{t("switchLanguage")}</span>}
    </button>
  );
}
