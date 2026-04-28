/**
 * Typed shapes for the Payload Globals consumed by the public site.
 *
 * These are intentionally loose (every field optional) so that an editor
 * who hasn't filled out a section yet still gets a successful render with
 * sensible defaults instead of a 500.
 */

export type MediaRef = { url?: string | null; alt?: string | null } | string | null | undefined;

export interface SiteSettingsDoc {
  brand?: {
    name?: string;
    tagline?: string;
    description?: string;
    logo?: MediaRef;
    favicon?: MediaRef;
    ogImage?: MediaRef;
  };
  seo?: {
    titleTemplate?: string;
    defaultTitle?: string;
    defaultDescription?: string;
    twitter?: string;
  };
  contact?: { email?: string; phone?: string; address?: string };
}

export interface NavigationDoc {
  brand?: { label?: string; tagline?: string };
  primary?: Array<Record<string, unknown>>;
  cta?: { label?: string; url?: string; enabled?: boolean };
  footer?: {
    tagline?: string;
    columns?: Array<{
      title?: string;
      links?: Array<{ label?: string; url?: string }>;
    }>;
  };
  social?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    facebook?: string;
  };
}

export interface AboutPageDoc {
  hero?: {
    breadcrumbLabel?: string;
    headingHighlight?: string;
    headingRest?: string;
  };
  stats?: {
    heroImage?: MediaRef;
    items?: Array<{
      id?: string;
      value?: string;
      label?: string;
      variant?: "solid" | "image";
      image?: MediaRef;
    }>;
  };
  story?: { paragraphs?: Array<{ text?: string }> };
  services?: {
    items?: Array<{
      id?: string;
      variant?: "image" | "accent" | "dark" | "light";
      title?: string;
      image?: MediaRef;
      items?: Array<{ label?: string }>;
    }>;
  };
  brands?: {
    heading?: string;
    items?: Array<{ id?: string; name?: string; logo?: MediaRef; url?: string }>;
  };
  testimonials?: {
    heading?: string;
    items?: Array<{
      id?: string;
      quote?: string;
      authorName?: string;
      authorRole?: string;
      authorAvatar?: MediaRef;
      image?: MediaRef;
    }>;
  };
  team?: {
    heading?: string;
    subheading?: string;
    members?: Array<{
      id?: string;
      name?: string;
      role?: string;
      photo?: MediaRef;
      bio?: string;
    }>;
  };
  getInTouch?: {
    heading?: string;
    label?: string;
    image?: MediaRef;
    cta?: { label?: string; url?: string };
  };
  seo?: { title?: string; description?: string; ogImage?: MediaRef };
}

export interface ContactPageDoc {
  hero?: {
    breadcrumbLabel?: string;
    heading?: string;
    image?: MediaRef;
  };
  form?: {
    heading?: string;
    submitLabel?: string;
    successMessage?: string;
  };
  latestPosts?: { enabled?: boolean; heading?: string; limit?: number };
  seo?: { title?: string; description?: string; ogImage?: MediaRef };
}

export interface FeaturesPageDoc {
  hero?: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    ctas?: Array<{ label?: string; url?: string; style?: "primary" | "secondary" }>;
  };
  pillars?: {
    items?: Array<{ icon?: string; title?: string; description?: string }>;
  };
  seoChecklist?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    items?: Array<{ label?: string }>;
  };
  tools?: {
    eyebrow?: string;
    heading?: string;
    items?: Array<{ icon?: string; title?: string; description?: string }>;
  };
  seo?: { title?: string; description?: string; ogImage?: MediaRef };
}
