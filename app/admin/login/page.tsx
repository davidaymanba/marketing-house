import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/brand/LogoMark";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const t = await getTranslations("admin.login");

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      {/* Brand side */}
      <section className="relative hidden overflow-hidden bg-bg-elevated lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div aria-hidden className="diagonal-lines absolute inset-0 opacity-30" />
        <div aria-hidden className="absolute size-[60%] rounded-full bg-primary/30 blur-[120px]" />
        <LogoMark variant="glow" className="relative w-64" barClassName="admin-bar" />
        <p dir="ltr" className="font-display relative mt-10 text-sm font-bold tracking-[0.5em] text-fg">
          MARKETING <span className="text-primary-light">HOUSE</span>
        </p>
        <p className="relative mt-4 text-muted">{t("tagline")}</p>
      </section>

      {/* Form side */}
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <LogoMark className="mb-10 w-16 lg:hidden" />
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mb-8 mt-2 text-muted">{t("subtitle")}</p>
          {!isSupabaseConfigured ? (
            <p role="alert" className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
              {t("notConfigured")}
            </p>
          ) : null}
          {error === "forbidden" ? (
            <p role="alert" className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
              {t("forbidden")}
            </p>
          ) : null}
          <LoginForm disabled={!isSupabaseConfigured} />
        </div>
      </section>
    </main>
  );
}
