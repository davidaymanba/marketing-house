import "server-only";
import { cookies } from "next/headers";

/** The dashboard language is a per-browser preference (cookie), English by default. */
export const ADMIN_LOCALE_COOKIE = "mh-admin-locale";
export type AdminLocale = "en" | "ar";

export async function getAdminLocale(): Promise<AdminLocale> {
  const value = (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value;
  return value === "ar" ? "ar" : "en";
}

/** Picks the localized column of a bilingual pair for admin lists. */
export const adminPick = (locale: AdminLocale, ar: unknown, en: unknown) =>
  String((locale === "en" ? en || ar : ar || en) ?? "");
