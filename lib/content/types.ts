/** Content models shared by the seed data, the Supabase data layer and the UI. */

export type L = { ar: string; en: string };
export type LocaleKey = keyof L;

export type ServiceIcon =
  | "palette"
  | "share"
  | "pen"
  | "camera"
  | "megaphone"
  | "trending"
  | "code"
  | "search";

export type Service = {
  id: string;
  slug: string;
  icon: ServiceIcon;
  title: L;
  short: L;
  description: L;
  tags: L[];
  deliverables: { title: L; text: L }[];
  process: { title: L; text: L }[];
  faqs: { q: L; a: L }[];
  cover: string | null;
  hue: number;
};

export type ProjectCategory = { id: string; slug: string; name: L };

export type Project = {
  id: string;
  slug: string;
  title: L;
  client: L;
  categorySlug: string;
  year: number;
  serviceSlugs: string[];
  summary: L;
  challenge: L;
  solution: L;
  results: { value: number; suffix: string; label: L }[];
  cover: string | null;
  gallery: string[];
  hue: number;
  featured: boolean;
  isPlaceholder: boolean;
};

export type Testimonial = {
  id: string;
  name: L;
  role: L;
  company: L;
  quote: L;
  photo: string | null;
  rating: number;
  isPlaceholder: boolean;
};

export type Client = { id: string; name: string; logo: string | null; isPlaceholder: boolean };

export type TeamMember = {
  id: string;
  name: L;
  role: L;
  photo: string | null;
  socials: { linkedin?: string; instagram?: string; facebook?: string };
  isPlaceholder: boolean;
};

export type Branch = {
  id: string;
  key: string;
  name: L;
  city: L;
  address: L;
  phone: string;
  whatsapp: string;
  mapEmbedUrl: string;
  mapLink: string;
  workingHours: L;
  isMain: boolean;
  /** Position on the stylized Egypt map (0–100). */
  mapX: number;
  mapY: number;
};

export type SiteSettings = {
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  commercialRegNo: string;
  taxCardNo: string;
  stats: { projects: number; clients: number; years: number; campaigns: number };
  seoTitle: L;
  seoDescription: L;
};

export const pick = (value: L, locale: string) => (locale === "en" ? value.en : value.ar);
