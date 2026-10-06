/**
 * Declarative admin resources. The same config drives the generic CRUD UI
 * (client) and the server-side validation (Server Actions), so they never drift.
 * Labels are i18n keys under admin.fields.*
 */

export type SubField = { name: string; label: string; type: "text" | "textarea" | "number"; dir?: "ltr" };

export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "url" | "slug"; required?: boolean; dir?: "ltr" }
  | { name: string; label: string; type: "number"; min?: number; max?: number }
  | { name: string; label: string; type: "bilingual"; textarea?: boolean; required?: boolean }
  | { name: string; label: string; type: "boolean" }
  | { name: string; label: string; type: "image" }
  | { name: string; label: string; type: "select"; options: "categories" | "icons" }
  | { name: string; label: string; type: "multiselect"; options: "services" }
  | { name: string; label: string; type: "list"; itemFields: SubField[] }
  | { name: string; label: string; type: "object"; itemFields: SubField[] }
  | { name: string; label: string; type: "gallery" };

export type Resource = {
  key: ResourceKey;
  table: string;
  /** Column shown as the row title (Arabic) and subtitle (English). */
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
};

export type ResourceKey =
  | "services"
  | "projects"
  | "project_categories"
  | "testimonials"
  | "team_members"
  | "clients"
  | "branches";

const biItem = (a: string, b: string): SubField[] => [
  { name: `${a}_ar`, label: `${a}`, type: "text" },
  { name: `${a}_en`, label: `${a}`, type: "text", dir: "ltr" },
  { name: `${b}_ar`, label: `${b}`, type: "textarea" },
  { name: `${b}_en`, label: `${b}`, type: "textarea", dir: "ltr" },
];

export const resources: Record<ResourceKey, Resource> = {
  services: {
    key: "services",
    table: "services",
    titleField: "title_ar",
    subtitleField: "title_en",
    imageField: "cover_image",
    fields: [
      { name: "title", label: "title", type: "bilingual", required: true },
      { name: "slug", label: "slug", type: "slug", required: true },
      { name: "icon", label: "icon", type: "select", options: "icons" },
      { name: "hue", label: "hue", type: "number", min: 0, max: 360 },
      { name: "short", label: "short", type: "bilingual", textarea: true },
      { name: "description", label: "description", type: "bilingual", textarea: true },
      { name: "cover_image", label: "cover", type: "image" },
      { name: "tags", label: "tags", type: "list", itemFields: [{ name: "ar", label: "ar", type: "text" }, { name: "en", label: "en", type: "text", dir: "ltr" }] },
      { name: "deliverables", label: "deliverables", type: "list", itemFields: biItem("title", "text") },
      { name: "process_steps", label: "process", type: "list", itemFields: biItem("title", "text") },
      { name: "faqs", label: "faqs", type: "list", itemFields: biItem("q", "a") },
    ],
  },
  projects: {
    key: "projects",
    table: "projects",
    titleField: "title_ar",
    subtitleField: "title_en",
    imageField: "cover_image",
    fields: [
      { name: "title", label: "title", type: "bilingual", required: true },
      { name: "slug", label: "slug", type: "slug", required: true },
      { name: "client", label: "client", type: "bilingual" },
      { name: "category_id", label: "category", type: "select", options: "categories" },
      { name: "year", label: "year", type: "number", min: 1990, max: 2100 },
      { name: "service_slugs", label: "services", type: "multiselect", options: "services" },
      { name: "summary", label: "summary", type: "bilingual", textarea: true },
      { name: "challenge", label: "challenge", type: "bilingual", textarea: true },
      { name: "solution", label: "solution", type: "bilingual", textarea: true },
      {
        name: "results",
        label: "results",
        type: "list",
        itemFields: [
          { name: "value", label: "value", type: "number" },
          { name: "suffix", label: "suffix", type: "text", dir: "ltr" },
          { name: "label_ar", label: "label", type: "text" },
          { name: "label_en", label: "label", type: "text", dir: "ltr" },
        ],
      },
      { name: "cover_image", label: "cover", type: "image" },
      { name: "gallery", label: "gallery", type: "gallery" },
      { name: "hue", label: "hue", type: "number", min: 0, max: 360 },
      { name: "is_featured", label: "featured", type: "boolean" },
      { name: "is_placeholder", label: "isPlaceholder", type: "boolean" },
    ],
  },
  project_categories: {
    key: "project_categories",
    table: "project_categories",
    titleField: "name_ar",
    subtitleField: "name_en",
    fields: [
      { name: "name", label: "name", type: "bilingual", required: true },
      { name: "slug", label: "slug", type: "slug", required: true },
    ],
  },
  testimonials: {
    key: "testimonials",
    table: "testimonials",
    titleField: "name_ar",
    subtitleField: "company_ar",
    imageField: "photo",
    fields: [
      { name: "name", label: "name", type: "bilingual", required: true },
      { name: "role", label: "role", type: "bilingual" },
      { name: "company", label: "company", type: "bilingual" },
      { name: "quote", label: "quote", type: "bilingual", textarea: true, required: true },
      { name: "photo", label: "photo", type: "image" },
      { name: "rating", label: "rating", type: "number", min: 1, max: 5 },
      { name: "is_placeholder", label: "isPlaceholder", type: "boolean" },
    ],
  },
  team_members: {
    key: "team_members",
    table: "team_members",
    titleField: "name_ar",
    subtitleField: "role_ar",
    imageField: "photo",
    fields: [
      { name: "name", label: "name", type: "bilingual", required: true },
      { name: "role", label: "role", type: "bilingual" },
      { name: "photo", label: "photo", type: "image" },
      {
        name: "socials",
        label: "socials",
        type: "object",
        itemFields: [
          { name: "linkedin", label: "linkedin", type: "text", dir: "ltr" },
          { name: "instagram", label: "instagram", type: "text", dir: "ltr" },
          { name: "facebook", label: "facebook", type: "text", dir: "ltr" },
        ],
      },
      { name: "is_placeholder", label: "isPlaceholder", type: "boolean" },
    ],
  },
  clients: {
    key: "clients",
    table: "clients",
    titleField: "name",
    imageField: "logo",
    fields: [
      { name: "name", label: "name", type: "text", required: true, dir: "ltr" },
      { name: "logo", label: "logo", type: "image" },
      { name: "url", label: "url", type: "url", dir: "ltr" },
      { name: "is_placeholder", label: "isPlaceholder", type: "boolean" },
    ],
  },
  branches: {
    key: "branches",
    table: "branches",
    titleField: "name_ar",
    subtitleField: "address_ar",
    fields: [
      { name: "name", label: "name", type: "bilingual", required: true },
      { name: "key", label: "key", type: "slug", required: true },
      { name: "city", label: "city", type: "bilingual", required: true },
      { name: "address", label: "address", type: "bilingual", textarea: true, required: true },
      { name: "phone", label: "phone", type: "text", dir: "ltr" },
      { name: "whatsapp", label: "whatsapp", type: "text", dir: "ltr" },
      { name: "working_hours", label: "workingHours", type: "bilingual" },
      { name: "map_embed_url", label: "mapEmbedUrl", type: "url", dir: "ltr" },
      { name: "map_link", label: "mapLink", type: "url", dir: "ltr" },
      { name: "map_x", label: "mapX", type: "number", min: 0, max: 100 },
      { name: "map_y", label: "mapY", type: "number", min: 0, max: 100 },
      { name: "is_main", label: "isMain", type: "boolean" },
    ],
  },
};

export const isResourceKey = (k: string): k is ResourceKey => k in resources;

/** Empty form values for a new row. */
export function emptyValues(resource: Resource): Record<string, unknown> {
  const v: Record<string, unknown> = { is_published: true };
  for (const f of resource.fields) {
    if (f.type === "bilingual") {
      v[`${f.name}_ar`] = "";
      v[`${f.name}_en`] = "";
    } else if (f.type === "boolean") v[f.name] = false;
    else if (f.type === "number") v[f.name] = f.name === "year" ? new Date().getFullYear() : f.name === "rating" ? 5 : f.name === "hue" ? 270 : 50;
    else if (f.type === "list" || f.type === "multiselect" || f.type === "gallery") v[f.name] = [];
    else if (f.type === "object") v[f.name] = {};
    else v[f.name] = f.type === "select" && f.options === "icons" ? "palette" : "";
  }
  return v;
}
