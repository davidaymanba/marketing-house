import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import {
  seedBranches,
  seedCategories,
  seedClients,
  seedProjects,
  seedServices,
  seedSettings,
  seedTeam,
  seedTestimonials,
} from "./content/seed";
import type {
  Branch,
  Client,
  Project,
  ProjectCategory,
  Service,
  ServiceIcon,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./content/types";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./supabase/env";

/** Cache tag shared by every public content read; admin mutations revalidate it. */
export const CONTENT_TAG = "content";

/**
 * Anon client whose fetches are cached (ISR) and tagged for on-demand revalidation.
 * RLS guarantees only published rows are returned.
 */
const db = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, next: { tags: [CONTENT_TAG], revalidate: 3600 } }),
      },
    })
  : null;

type Row = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : "");
const n = (v: unknown, d = 0) => (typeof v === "number" ? v : Number(v ?? d) || d);
const arr = <T,>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);
const L = (r: Row, key: string) => ({ ar: s(r[`${key}_ar`]), en: s(r[`${key}_en`]) });

/** Runs a query; falls back to seed data when Supabase is missing or errors. */
async function load<T>(fallback: T, query: () => PromiseLike<{ data: unknown; error: { message: string } | null }>, map: (data: unknown) => T): Promise<T> {
  if (!db) return fallback;
  try {
    const { data, error } = await query();
    if (error) throw new Error(error.message);
    return map(data);
  } catch (e) {
    console.error("[data] Supabase read failed, using seed fallback:", (e as Error).message);
    return fallback;
  }
}

/* ------------------------------- mappers -------------------------------- */

const mapService = (r: Row): Service => ({
  id: s(r.id),
  slug: s(r.slug),
  icon: (s(r.icon) || "palette") as ServiceIcon,
  hue: n(r.hue, 270),
  cover: s(r.cover_image) || null,
  title: L(r, "title"),
  short: L(r, "short"),
  description: L(r, "description"),
  tags: arr<{ ar: string; en: string }>(r.tags),
  deliverables: arr<Row>(r.deliverables).map((d) => ({ title: L(d, "title"), text: L(d, "text") })),
  process: arr<Row>(r.process_steps).map((d) => ({ title: L(d, "title"), text: L(d, "text") })),
  faqs: arr<Row>(r.faqs).map((f) => ({ q: L(f, "q"), a: L(f, "a") })),
});

const mapCategory = (r: Row): ProjectCategory => ({ id: s(r.id), slug: s(r.slug), name: L(r, "name") });

const mapProject = (r: Row): Project => {
  const category = r.project_categories as Row | null;
  const images = arr<Row>(r.project_images).sort((a, b) => n(a.sort_order) - n(b.sort_order));
  return {
    id: s(r.id),
    slug: s(r.slug),
    title: L(r, "title"),
    client: L(r, "client"),
    categorySlug: category ? s(category.slug) : "",
    year: n(r.year, new Date().getFullYear()),
    serviceSlugs: arr<string>(r.service_slugs),
    summary: L(r, "summary"),
    challenge: L(r, "challenge"),
    solution: L(r, "solution"),
    results: arr<Row>(r.results).map((x) => ({ value: n(x.value), suffix: s(x.suffix), label: L(x, "label") })),
    cover: s(r.cover_image) || null,
    gallery: images.map((i) => s(i.url)).filter(Boolean),
    hue: n(r.hue, 270),
    featured: Boolean(r.is_featured),
    isPlaceholder: Boolean(r.is_placeholder),
  };
};

const mapTestimonial = (r: Row): Testimonial => ({
  id: s(r.id),
  name: L(r, "name"),
  role: L(r, "role"),
  company: L(r, "company"),
  quote: L(r, "quote"),
  photo: s(r.photo) || null,
  rating: n(r.rating, 5),
  isPlaceholder: Boolean(r.is_placeholder),
});

const mapClient = (r: Row): Client => ({ id: s(r.id), name: s(r.name), logo: s(r.logo) || null, isPlaceholder: Boolean(r.is_placeholder) });

const mapTeam = (r: Row): TeamMember => ({
  id: s(r.id),
  name: L(r, "name"),
  role: L(r, "role"),
  photo: s(r.photo) || null,
  socials: (r.socials as TeamMember["socials"]) ?? {},
  isPlaceholder: Boolean(r.is_placeholder),
});

const mapBranch = (r: Row): Branch => ({
  id: s(r.id),
  key: s(r.key),
  name: L(r, "name"),
  city: L(r, "city"),
  address: L(r, "address"),
  phone: s(r.phone),
  whatsapp: s(r.whatsapp),
  mapEmbedUrl: s(r.map_embed_url),
  mapLink: s(r.map_link),
  workingHours: L(r, "working_hours"),
  isMain: Boolean(r.is_main),
  mapX: n(r.map_x, 50),
  mapY: n(r.map_y, 50),
});

const mapSettings = (r: Row | null): SiteSettings =>
  r
    ? {
        phone: s(r.phone) || seedSettings.phone,
        whatsapp: s(r.whatsapp) || seedSettings.whatsapp,
        email: s(r.email) || seedSettings.email,
        facebook: s(r.facebook),
        instagram: s(r.instagram),
        linkedin: s(r.linkedin),
        commercialRegNo: s(r.commercial_reg_no),
        taxCardNo: s(r.tax_card_no),
        stats: { projects: n(r.stat_projects), clients: n(r.stat_clients), years: n(r.stat_years), campaigns: n(r.stat_campaigns) },
        seoTitle: L(r, "seo_title"),
        seoDescription: L(r, "seo_description"),
      }
    : seedSettings;

/* ----------------------------- public reads ----------------------------- */

const PROJECT_SELECT = "*, project_categories(slug), project_images(url, sort_order)";

export const getServices = cache(() =>
  load(seedServices, () => db!.from("services").select("*").order("sort_order"), (d) => arr<Row>(d).map(mapService)),
);

export const getService = cache(async (slug: string) => (await getServices()).find((x) => x.slug === slug) ?? null);

export const getCategories = cache(() =>
  load(seedCategories, () => db!.from("project_categories").select("*").order("sort_order"), (d) => arr<Row>(d).map(mapCategory)),
);

export const getProjects = cache(() =>
  load(seedProjects, () => db!.from("projects").select(PROJECT_SELECT).order("sort_order"), (d) => arr<Row>(d).map(mapProject)),
);

export const getProject = cache(async (slug: string) => (await getProjects()).find((p) => p.slug === slug) ?? null);

export const getTestimonials = cache(() =>
  load(seedTestimonials, () => db!.from("testimonials").select("*").order("sort_order"), (d) => arr<Row>(d).map(mapTestimonial)),
);

export const getClients = cache(() =>
  load(seedClients, () => db!.from("clients").select("*").order("sort_order"), (d) => arr<Row>(d).map(mapClient)),
);

export const getTeam = cache(() =>
  load(seedTeam, () => db!.from("team_members").select("*").order("sort_order"), (d) => arr<Row>(d).map(mapTeam)),
);

export const getBranches = cache(() =>
  load(seedBranches, () => db!.from("branches").select("*").order("sort_order"), (d) => arr<Row>(d).map(mapBranch)),
);

export const getSettings = cache(() =>
  load(seedSettings, () => db!.from("site_settings").select("*").eq("id", 1).maybeSingle(), (d) => mapSettings(d as Row | null)),
);
