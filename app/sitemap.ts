import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjects, getServices } from "@/lib/data";
import { alternates, localeUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  const paths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/portfolio", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.8 })),
    ...projects.map((p) => ({ path: `/portfolio/${p.slug}`, priority: 0.6 })),
  ];
  const now = new Date();

  return paths.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: alternates(locale, path).languages },
    })),
  );
}
