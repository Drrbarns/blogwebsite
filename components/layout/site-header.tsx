import { getNavigation, getSiteSettings } from "@/lib/cms";
import { pickMediaUrlOrNull } from "@/lib/cms/transforms";
import { Navbar } from "@/components/navigation/navbar";

type NavItem = { label: string; href: string; external?: boolean | null };
type NavbarCtaLink = { label: string; href: string } | null;

type NavigationDoc = {
  brand?: { label?: string; tagline?: string };
  primary?: Array<Record<string, unknown>>;
  cta?: { label?: string; url?: string; enabled?: boolean };
};

type SiteSettingsDoc = {
  brand?: { name?: string; logo?: { url?: string } | string | null };
};

function resolveHref(item: Record<string, unknown>): string {
  const type = (item.type as string | undefined) ?? "custom";
  if (type === "custom" && typeof item.url === "string") return item.url;
  if (type === "page" && item.page && typeof item.page === "object") {
    const slug = (item.page as { slug?: string }).slug;
    return slug ? `/${slug}` : "/";
  }
  if (type === "post" && item.post && typeof item.post === "object") {
    const slug = (item.post as { slug?: string }).slug;
    return slug ? `/blog/${slug}` : "/blog";
  }
  if (type === "category" && item.category && typeof item.category === "object") {
    const slug = (item.category as { slug?: string }).slug;
    return slug ? `/blog/category/${slug}` : "/blog";
  }
  return (item.url as string) ?? "#";
}

export async function SiteHeader() {
  const [nav, settings] = await Promise.all([
    getNavigation() as Promise<NavigationDoc | null>,
    getSiteSettings() as Promise<SiteSettingsDoc | null>,
  ]);

  let links: NavItem[] | undefined;
  if (nav?.primary && Array.isArray(nav.primary) && nav.primary.length) {
    links = nav.primary.map((entry) => ({
      label: String(entry.label ?? ""),
      href: resolveHref(entry),
      external:
        typeof entry.external === "boolean" ? (entry.external as boolean) : null,
    }));
  }

  let cta: NavbarCtaLink = undefined as unknown as NavbarCtaLink;
  if (nav?.cta && nav.cta.enabled === false) {
    cta = null;
  } else if (nav?.cta?.label && nav.cta.url) {
    cta = { label: nav.cta.label, href: nav.cta.url };
  }

  const brandName =
    settings?.brand?.name ?? nav?.brand?.label ?? undefined;
  const brandLogo = pickMediaUrlOrNull(
    settings?.brand?.logo as never,
    "thumbnail",
  );

  return (
    <Navbar
      links={links}
      cta={cta}
      brandName={brandName}
      brandLogoUrl={brandLogo}
    />
  );
}
