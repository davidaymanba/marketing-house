import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  let locale: string = routing.defaultLocale;

  if (hasLocale(routing.locales, requested)) {
    locale = requested;
  } else {
    // Routes outside [locale] (the admin) use the dashboard language cookie.
    const { getAdminLocale } = await import("@/lib/admin/locale");
    locale = await getAdminLocale();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
