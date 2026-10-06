import { pick, type Branch, type SiteSettings } from "@/lib/content/types";
import { localeUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/** Organization (MarketingAgency) with one LocalBusiness per branch. */
export function OrganizationJsonLd({ locale, settings, branches }: { locale: string; settings: SiteSettings; branches: Branch[] }) {
  const orgId = `${siteConfig.url}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "MarketingAgency"],
        "@id": orgId,
        name: siteConfig.name,
        alternateName: "ماركتنج هاوس",
        url: localeUrl(locale),
        logo: `${siteConfig.url}/brand/logo.png`,
        slogan: "We Build Brands",
        email: settings.email,
        telephone: `+2${settings.phone}`,
        ...(settings.taxCardNo ? { taxID: settings.taxCardNo } : {}),
        sameAs: [settings.facebook, settings.instagram, settings.linkedin].filter(Boolean),
        areaServed: { "@type": "Country", name: "Egypt" },
      },
      ...branches.map((b) => ({
        "@type": ["LocalBusiness", "MarketingAgency"],
        "@id": `${siteConfig.url}/#branch-${b.key}`,
        name: `${siteConfig.name} — ${pick(b.city, "en")}`,
        parentOrganization: { "@id": orgId },
        url: localeUrl(locale, "/contact"),
        telephone: `+2${b.phone}`,
        image: `${siteConfig.url}/brand/logo.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: pick(b.address, locale),
          addressLocality: pick(b.city, "en"),
          addressCountry: "EG",
        },
        hasMap: b.mapLink,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inline; content is escaped against </script> breakouts.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
