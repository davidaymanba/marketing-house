/** Static site constants. Contact details, branches and socials live in the DB (lib/data.ts). */

export const siteConfig = {
  name: "Marketing House",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

/** Primary navigation. Labels live in messages under `nav.*`. */
export const navItems = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

/** Public contact info passed from server layouts to client chrome. */
export type ContactInfo = {
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};
