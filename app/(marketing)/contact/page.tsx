import { generatePageMetadata } from "@/lib/seo";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactSection } from "@/components/contact/contact-section";
import { LatestPosts } from "@/components/contact/latest-posts";
import { Newsletter } from "@/components/home/newsletter";
import {
  getContactPage,
  getSiteSettings,
  getNavigation,
  listPosts,
} from "@/lib/cms";
import { pickMediaUrlOrNull } from "@/lib/cms/transforms";

export const revalidate = 60;

export async function generateMetadata() {
  const contact = await getContactPage();
  return generatePageMetadata({
    title: contact?.seo?.title ?? "Contact",
    description:
      contact?.seo?.description ??
      "Get in touch with our editorial team — we'd love to hear from you.",
    path: "/contact",
    ogImage: pickMediaUrlOrNull(contact?.seo?.ogImage as never) ?? undefined,
  });
}

export default async function ContactPage() {
  const [contact, settings, navigation, latest] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
    getNavigation(),
    listPosts({ limit: 3 }),
  ]);

  const heroImage = pickMediaUrlOrNull(contact?.hero?.image as never, "wide");
  const showLatest = contact?.latestPosts?.enabled !== false;

  return (
    <>
      <ContactHero
        breadcrumbLabel={contact?.hero?.breadcrumbLabel}
        heading={contact?.hero?.heading}
        imageUrl={heroImage}
      />
      <ContactSection
        email={settings?.contact?.email}
        phone={settings?.contact?.phone}
        address={settings?.contact?.address}
        socials={navigation?.social ?? {}}
        formHeading={contact?.form?.heading}
        submitLabel={contact?.form?.submitLabel}
        successMessage={contact?.form?.successMessage}
      />
      {showLatest && (
        <LatestPosts
          posts={latest.docs}
          heading={contact?.latestPosts?.heading}
          limit={contact?.latestPosts?.limit ?? 3}
        />
      )}
      <Newsletter />
    </>
  );
}
