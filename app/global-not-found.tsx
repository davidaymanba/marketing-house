import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import "./globals.css";

export const metadata: Metadata = { title: "404 | Marketing House" };

/** Fallback for URLs outside the localized routes (bypasses all layouts). */
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body className="grid min-h-svh place-items-center text-center">
        <main className="container-site">
          <p dir="ltr" className="text-gradient text-[clamp(7rem,28vw,20rem)] font-extrabold leading-none tracking-[-0.06em]">
            404
          </p>
          <p className="text-h3">{en.notFound.title}</p>
          <p className="mt-2 text-muted" lang="ar" dir="rtl">{ar.notFound.title}</p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="/en" className="bg-signature rounded-full px-8 py-4 font-semibold">{en.nav.home}</a>
            <a href="/ar" className="rounded-full border border-line px-8 py-4 font-semibold" lang="ar">{ar.nav.home}</a>
          </div>
        </main>
      </body>
    </html>
  );
}
