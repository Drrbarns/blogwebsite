/**
 * Synchronous site defaults derived from env vars.  Used by metadataBase,
 * sitemap, robots, RSS/Atom/JSON feeds and JSON-LD where we cannot await on
 * Payload globals. The CMS SiteSettings global may override these per-page
 * via async helpers like generatePageMetadata().
 */

const fallback = (...vals: (string | undefined | null)[]): string => {
  for (const v of vals) {
    if (v && v.trim()) return v.trim();
  }
  return "";
};

export const SITE_URL =
  fallback(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
  ) || "http://localhost:3000";

export const SITE_NAME =
  fallback(process.env.NEXT_PUBLIC_SITE_NAME) || "About a Girl";

export const SITE_DESCRIPTION =
  fallback(process.env.NEXT_PUBLIC_SITE_DESCRIPTION) ||
  "A personal blog about faith, sport, medicine and the small habits in between — written by a doctor.";

export const SITE_OG_IMAGE =
  fallback(process.env.NEXT_PUBLIC_OG_IMAGE) || "/images/og-default.svg";

export const SITE_LOGO = "/images/logo.svg";

export const siteDefaults = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  ogImage: SITE_OG_IMAGE,
  logo: SITE_LOGO,
};
