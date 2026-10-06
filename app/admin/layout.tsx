import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { getAdminLocale } from "@/lib/admin/locale";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin");
  return {
    title: { default: t("metaTitle"), template: `%s | ${t("brand")}` },
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#0B0717", colorScheme: "dark" };

/** Admin root layout — English (LTR) by default, Arabic (RTL) via the language toggle. Calm motion, no Lenis or cursor. */
export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  const locale = await getAdminLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={fontVariables}>
      <body className="bg-bg">
        <NextIntlClientProvider>
          <AdminProviders dir={dir}>{children}</AdminProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
