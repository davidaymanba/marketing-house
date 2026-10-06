import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "./site";

/** Absolute URL for a locale + path ("/" → "/en"). */
export function localeUrl(locale: string, path = "/") {
  const clean = path === "/" ? "" : path;
  return `${siteConfig.url}/${locale}${clean}`;
}

/** hreflang alternates for every locale + x-default (→ English). */
export function alternates(locale: string, path = "/") {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, path)])),
      "x-default": localeUrl(routing.defaultLocale, path),
    },
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      title,
      description,
      url: localeUrl(locale, path),
      locale: locale === "ar" ? "ar_EG" : "en_US",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
