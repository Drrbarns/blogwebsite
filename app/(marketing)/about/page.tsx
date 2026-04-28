import { generatePageMetadata } from "@/lib/seo";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStatsGrid } from "@/components/about/about-stats-grid";
import { AboutStory } from "@/components/about/about-story";
import { AboutServicesGrid } from "@/components/about/about-services-grid";
import { BrandsStrip } from "@/components/about/brands-strip";
import { Testimonial } from "@/components/about/testimonial";
import { TeamGrid } from "@/components/about/team-grid";
import { GetInTouch } from "@/components/blog/get-in-touch";
import { Newsletter } from "@/components/home/newsletter";
import { getAboutPage } from "@/lib/cms";
import { pickMediaUrlOrNull, pickMediaAlt } from "@/lib/cms/transforms";
import {
  aboutHeroImage,
  aboutStats,
  aboutStoryParagraphs,
  aboutServices,
  aboutBrands,
  aboutTestimonials,
  aboutTeam,
} from "@/lib/data";
import type {
  Stat,
  ServiceCard,
  BrandLogo,
  TestimonialItem,
  TeamMember,
} from "@/types";

type BrandWithLogo = BrandLogo & { logoUrl?: string | null; href?: string | null };

export const revalidate = 60;

export async function generateMetadata() {
  const about = await getAboutPage();
  return generatePageMetadata({
    title: about?.seo?.title ?? "About",
    description:
      about?.seo?.description ??
      "Learn the story behind us — a team of designers, writers, and strategists building modern editorial experiences.",
    path: "/about",
    ogImage: pickMediaUrlOrNull(about?.seo?.ogImage as never) ?? undefined,
  });
}

export default async function AboutPage() {
  const about = await getAboutPage();

  const heroImageUrl =
    pickMediaUrlOrNull(about?.stats?.heroImage as never, "wide") ?? aboutHeroImage;
  const heroImageAlt =
    pickMediaAlt(about?.stats?.heroImage as never, "Our story behind the stories") ||
    "Our story";

  const cmsStats = about?.stats?.items ?? [];
  const stats: Stat[] =
    cmsStats.length > 0
      ? cmsStats
          .filter((s) => Boolean(s?.value && s?.label))
          .map((s, idx) => ({
            id: s.id ?? `stat-${idx}`,
            value: String(s.value),
            label: String(s.label),
            variant: (s.variant ?? "solid") as "solid" | "image",
            image: pickMediaUrlOrNull(s.image as never, "wide") ?? undefined,
          }))
      : aboutStats;

  const storyParagraphs: string[] =
    (about?.story?.paragraphs?.length ?? 0) > 0
      ? about!.story!.paragraphs!
          .map((p) => p?.text ?? "")
          .filter((t) => t.length)
      : aboutStoryParagraphs;

  const services: ServiceCard[] =
    (about?.services?.items?.length ?? 0) > 0
      ? about!.services!.items!.map((s, idx) => ({
          id: s?.id ?? `svc-${idx}`,
          title: s?.title ?? "",
          variant: (s?.variant ?? "accent") as ServiceCard["variant"],
          image: pickMediaUrlOrNull(s?.image as never, "card") ?? undefined,
          items:
            s?.items && s.items.length > 0
              ? s.items.map((i) => i?.label ?? "").filter(Boolean)
              : undefined,
        }))
      : aboutServices;

  const brands: BrandWithLogo[] =
    (about?.brands?.items?.length ?? 0) > 0
      ? about!.brands!.items!
          .filter((b) => Boolean(b?.name))
          .map((b, idx) => ({
            id: b!.id ?? `brand-${idx}`,
            name: String(b!.name),
            logoUrl: pickMediaUrlOrNull(b!.logo as never, "thumbnail"),
            href: b!.url ?? null,
          }))
      : aboutBrands;

  const testimonials: TestimonialItem[] =
    (about?.testimonials?.items?.length ?? 0) > 0
      ? about!.testimonials!.items!
          .filter((t) => Boolean(t?.quote && t?.authorName))
          .map((t, idx) => ({
            id: t!.id ?? `t-${idx}`,
            quote: String(t!.quote),
            author: {
              name: String(t!.authorName),
              role: t!.authorRole ?? "",
              avatar:
                pickMediaUrlOrNull(t!.authorAvatar as never, "thumbnail") ??
                "/images/avatar.svg",
            },
            image:
              pickMediaUrlOrNull(t!.image as never, "wide") ??
              "/images/placeholder-cover.svg",
          }))
      : aboutTestimonials;

  const team: TeamMember[] =
    (about?.team?.members?.length ?? 0) > 0
      ? about!.team!.members!
          .filter((m) => Boolean(m?.name))
          .map((m, idx) => ({
            id: m!.id ?? `tm-${idx}`,
            name: String(m!.name),
            role: m!.role ?? "",
            image:
              pickMediaUrlOrNull(m!.photo as never, "card") ??
              "/images/placeholder-portrait.svg",
          }))
      : aboutTeam;

  const getInTouch = about?.getInTouch;

  return (
    <>
      <AboutHero
        breadcrumbLabel={about?.hero?.breadcrumbLabel}
        headingHighlight={about?.hero?.headingHighlight}
        headingRest={about?.hero?.headingRest}
      />
      <AboutStatsGrid
        heroImage={heroImageUrl}
        heroImageAlt={heroImageAlt}
        stats={stats}
      />
      <AboutStory paragraphs={storyParagraphs} />
      <AboutServicesGrid services={services} />
      <BrandsStrip
        brands={brands}
        heading={about?.brands?.heading ?? "Trusted by ambitious teams"}
      />
      <Testimonial items={testimonials} heading={about?.testimonials?.heading} />
      <TeamGrid
        members={team}
        title={about?.team?.heading}
        description={about?.team?.subheading}
      />
      <GetInTouch
        heading={getInTouch?.heading}
        label={getInTouch?.label}
        imageUrl={pickMediaUrlOrNull(getInTouch?.image as never, "wide")}
        ctaLabel={getInTouch?.cta?.label}
        ctaHref={getInTouch?.cta?.url}
      />
      <Newsletter />
    </>
  );
}
