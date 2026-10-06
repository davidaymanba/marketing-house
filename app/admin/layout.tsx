import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "لوحة التحكم | ماركتنج هاوس", template: "%s | لوحة التحكم" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0B0717", colorScheme: "dark" };

/** Admin root layout — Arabic / RTL only, calm motion, no Lenis or cursor. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body className="bg-bg">
        <NextIntlClientProvider locale="ar">
          <AdminProviders>{children}</AdminProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
