import { getNavigation, getSiteSettings } from "@/lib/cms";
import { pickMediaUrlOrNull } from "@/lib/cms/transforms";
import { Footer, type FooterColumn, type FooterSocials } from "@/components/layout/footer";

type SiteSettingsDoc = {
  brand?: {
    name?: string;
    tagline?: string;
    description?: string;
    logo?: { url?: string } | string | null;
  };
  contact?: { email?: string; phone?: string; address?: string };
};

type NavigationDoc = {
  brand?: { label?: string; tagline?: string };
  footer?: {
    tagline?: string;
    columns?: Array<{
      title?: string;
      links?: Array<{ label?: string; url?: string }>;
    }>;
  };
  social?: FooterSocials;
};

export async function SiteFooter() {
  const [nav, settings] = await Promise.all([
    getNavigation() as Promise<NavigationDoc | null>,
    getSiteSettings() as Promise<SiteSettingsDoc | null>,
  ]);

  const columns: FooterColumn[] | undefined = nav?.footer?.columns
    ?.filter((c) => c?.title)
    .map((c) => ({
      title: String(c.title),
      links: (c.links ?? [])
        .filter((l) => l?.label && l?.url)
        .map((l) => ({ label: String(l.label), url: String(l.url) })),
    }));

  const brandName =
    settings?.brand?.name ?? nav?.brand?.label ?? "Ontario";
  const brandLogo = pickMediaUrlOrNull(
    settings?.brand?.logo as never,
    "thumbnail",
  );

  return (
    <Footer
      brandName={brandName}
      brandLogoUrl={brandLogo}
      tagline={
        nav?.footer?.tagline ??
        settings?.brand?.tagline ??
        settings?.brand?.description
      }
      columns={columns}
      contact={settings?.contact}
      socials={nav?.social}
      copyright={`© ${new Date().getFullYear()} — ${brandName}. All Rights Reserved.`}
    />
  );
}
