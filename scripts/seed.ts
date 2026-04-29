/**
 * Idempotent seed script.
 *
 *   npm run seed
 *
 * Creates:
 *   - Admin user (env: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD)
 *   - Categories from lib/data/posts.ts + lib/data/site-config.ts
 *   - Tags from lib/data/posts.ts
 *   - Posts from lib/data/posts.ts + lib/data/blog-posts.ts
 *     (cover images are downloaded from Unsplash and uploaded to Supabase).
 */
import { Buffer } from "node:buffer";
import { getPayload } from "payload";
import config from "../payload.config";

import {
  categories as mockCategories,
  heroFeaturedPosts,
  freshPosts,
  recentArticles,
  featuredSidebarPosts,
  relatedArticles,
  popularTags,
} from "../lib/data/posts";
import {
  blogHeroPost,
  blogGridPosts,
  blogFreshPosts,
} from "../lib/data/blog-posts";
import { footerCategories, siteConfig } from "../lib/data/site-config";
import {
  aboutHeroImage,
  aboutStats,
  aboutStoryParagraphs,
  aboutServices,
  aboutBrands,
  aboutTestimonials,
  aboutTeam,
} from "../lib/data/about";
import type { BlogPost, Category, Tag } from "../types";

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>;

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD ?? "change-me-long-password";

const log = (...args: unknown[]) => console.log("[seed]", ...args);

async function upsertUser(payload: PayloadInstance) {
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  });
  if (existing.docs.length) {
    log("admin user already exists:", ADMIN_EMAIL);
    return existing.docs[0];
  }
  const user = await payload.create({
    collection: "users",
    data: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "About a Girl",
      roles: ["admin"],
    },
  });
  log("created admin user:", ADMIN_EMAIL);
  return user;
}

async function upsertMediaFromUrl(
  payload: PayloadInstance,
  url: string,
  alt: string,
) {
  const key = url.split("?")[0];
  const existing = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
  });
  if (existing.docs.length) return existing.docs[0];

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename =
      key
        .split("/")
        .pop()
        ?.replace(/[^a-zA-Z0-9_.-]/g, "-")
        .slice(0, 60) ?? `image-${Date.now()}.jpg`;
    const mimeType = res.headers.get("content-type") ?? "image/jpeg";

    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: {
        data: buffer,
        mimetype: mimeType,
        name: filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".webp")
          ? filename
          : `${filename}.jpg`,
        size: buffer.length,
      },
    });
    return doc;
  } catch (err) {
    log("media upload failed, skipping:", url, (err as Error).message);
    return null;
  }
}

async function upsertCategory(
  payload: PayloadInstance,
  cat: Category,
): Promise<{ id: string | number } | null> {
  const existing = await payload.find({
    collection: "categories",
    where: { slug: { equals: cat.slug } },
    limit: 1,
  });
  if (existing.docs.length) return existing.docs[0] as { id: string | number };
  try {
    const doc = await payload.create({
      collection: "categories",
      data: {
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
      },
    });
    return doc as unknown as { id: string | number };
  } catch (err) {
    log("category create failed:", cat.slug, (err as Error).message);
    return null;
  }
}

async function upsertTag(
  payload: PayloadInstance,
  tag: Tag,
): Promise<{ id: string | number } | null> {
  const existing = await payload.find({
    collection: "tags",
    where: { slug: { equals: tag.slug } },
    limit: 1,
  });
  if (existing.docs.length) return existing.docs[0] as { id: string | number };
  try {
    const doc = await payload.create({
      collection: "tags",
      data: { name: tag.name, slug: tag.slug },
    });
    return doc as unknown as { id: string | number };
  } catch (err) {
    log("tag create failed:", tag.slug, (err as Error).message);
    return null;
  }
}

const demoContent = (p: BlogPost) => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    children: [
      {
        type: "paragraph",
        version: 1,
        children: [{ type: "text", version: 1, text: p.excerpt }],
      },
      {
        type: "heading",
        tag: "h2",
        version: 1,
        children: [{ type: "text", version: 1, text: "Why it matters" }],
      },
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            version: 1,
            text:
              "This seeded article exists so you can see the full layout end to end. Replace it in the Payload admin under /admin.",
          },
        ],
      },
      {
        type: "heading",
        tag: "h2",
        version: 1,
        children: [{ type: "text", version: 1, text: "Key takeaways" }],
      },
      {
        type: "list",
        listType: "bullet",
        version: 1,
        children: [
          {
            type: "listitem",
            version: 1,
            children: [
              { type: "text", version: 1, text: "Ship the homepage." },
            ],
          },
          {
            type: "listitem",
            version: 1,
            children: [
              { type: "text", version: 1, text: "Wire real content." },
            ],
          },
          {
            type: "listitem",
            version: 1,
            children: [
              { type: "text", version: 1, text: "Iterate on SEO." },
            ],
          },
        ],
      },
    ],
    direction: null,
  },
});

async function upsertPost(
  payload: PayloadInstance,
  post: BlogPost,
  authorId: string | number,
  catIdMap: Map<string, string | number>,
  tagIdMap: Map<string, string | number>,
) {
  const existing = await payload.find({
    collection: "posts",
    where: { slug: { equals: post.slug } },
    limit: 1,
  });
  if (existing.docs.length) {
    log("post exists, skipping:", post.slug);
    return existing.docs[0];
  }

  const cover = await upsertMediaFromUrl(
    payload,
    post.coverImage,
    `${post.title} — cover image`,
  );
  if (!cover) {
    log("skipping post, no cover image:", post.slug);
    return null;
  }

  const primaryCatId = catIdMap.get(post.category.slug);
  if (!primaryCatId) {
    log("skipping post, unknown category:", post.slug, post.category.slug);
    return null;
  }
  const extraCatIds =
    post.categories
      ?.map((c) => catIdMap.get(c.slug))
      .filter((id): id is string | number => Boolean(id)) ?? [];

  const tagIds: (string | number)[] = [];
  const titleWords = post.title.toLowerCase();
  for (const t of Array.from(tagIdMap.entries())) {
    if (titleWords.includes(t[0].replace(/-/g, " "))) {
      tagIds.push(t[1]);
    }
  }

  try {
    const doc = await payload.create({
      collection: "posts",
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: demoContent(post),
        category: primaryCatId,
        categories: extraCatIds,
        tags: tagIds,
        authors: [authorId],
        coverImage: (cover as { id: string | number }).id,
        featured: Boolean(post.featured),
        publishedAt: new Date(post.publishedAt).toISOString(),
        readingTime: post.readingTime,
        _status: "published",
      },
    });
    log("created post:", post.slug);
    return doc;
  } catch (err) {
    log("post create failed:", post.slug, (err as Error).message);
    return null;
  }
}

async function main() {
  if (!process.env.DATABASE_URI) {
    throw new Error("DATABASE_URI is not set — copy .env.local.example first");
  }

  log("connecting to Payload...");
  const payload = await getPayload({ config });

  const admin = await upsertUser(payload);

  const catIdMap = new Map<string, string | number>();
  const allCats = [
    ...mockCategories,
    ...footerCategories.map((c) => ({ ...c, color: undefined })),
    { name: "News", slug: "news" },
    { name: "Business", slug: "business" },
    { name: "Recent", slug: "recent" },
  ];
  const seen = new Set<string>();
  for (const c of allCats) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    const doc = await upsertCategory(payload, c as Category);
    if (doc) catIdMap.set(c.slug, doc.id);
  }
  log(`categories ready: ${catIdMap.size}`);

  const tagIdMap = new Map<string, string | number>();
  for (const t of popularTags) {
    const doc = await upsertTag(payload, t);
    if (doc) tagIdMap.set(t.slug, doc.id);
  }
  log(`tags ready: ${tagIdMap.size}`);

  const allPosts: BlogPost[] = [
    ...heroFeaturedPosts,
    ...freshPosts,
    ...recentArticles,
    ...featuredSidebarPosts,
    ...relatedArticles,
    blogHeroPost,
    ...blogGridPosts,
    ...blogFreshPosts,
  ];
  const postsSeen = new Set<string>();
  for (const p of allPosts) {
    if (postsSeen.has(p.slug)) continue;
    postsSeen.add(p.slug);
    await upsertPost(
      payload,
      p,
      (admin as { id: string | number }).id,
      catIdMap,
      tagIdMap,
    );
  }
  log(`posts ready: ${postsSeen.size}`);

  await seedGlobals(payload);

  log("seed complete");
}

async function seedGlobals(payload: PayloadInstance) {
  log("seeding globals...");

  await safeUpdateGlobal(payload, "site-settings", {
    brand: {
      name: siteConfig.name,
      tagline: "Faith. Sport. Medicine. Life in between.",
      description: siteConfig.description,
    },
    seo: {
      titleTemplate: `%s — ${siteConfig.name}`,
      defaultTitle: siteConfig.name,
      defaultDescription: siteConfig.description,
      twitter: siteConfig.links.twitter
        ? `@${siteConfig.links.twitter.split("/").pop()}`
        : "@aboutagirl",
    },
    contact: {
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      address: siteConfig.contact.address,
    },
  });

  await safeUpdateGlobal(payload, "navigation", {
    brand: { label: siteConfig.name, tagline: "A girl with many sides." },
    primary: [
      { label: "Home", type: "custom", url: "/" },
      { label: "Blog", type: "custom", url: "/blog" },
      { label: "Features", type: "custom", url: "/features" },
      { label: "About", type: "custom", url: "/about" },
      { label: "Contact", type: "custom", url: "/contact" },
    ],
    cta: { label: "Subscribe", url: "/newsletter", enabled: true },
    footer: {
      tagline:
        "A modern editorial platform built on Next.js 16 and Payload — designed for teams who care about craft, speed, and SEO.",
      columns: [
        {
          title: "Explore",
          links: [
            { label: "All articles", url: "/blog" },
            { label: "Authors", url: "/authors" },
            { label: "Categories", url: "/blog/categories" },
            { label: "Search", url: "/search" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", url: "/about" },
            { label: "Features", url: "/features" },
            { label: "Contact", url: "/contact" },
            { label: "Newsletter", url: "/newsletter" },
          ],
        },
      ],
    },
    social: {
      twitter: siteConfig.links.twitter,
      instagram: siteConfig.links.instagram,
      linkedin: siteConfig.links.linkedin,
      facebook: siteConfig.links.facebook,
      youtube: siteConfig.links.youtube,
    },
  });

  const aboutHeroMedia = await upsertMediaFromUrl(
    payload,
    aboutHeroImage,
    "About hero image",
  );
  const statItems = [];
  for (const s of aboutStats) {
    const item: Record<string, unknown> = {
      value: s.value,
      label: s.label,
      variant: s.variant,
    };
    if (s.variant === "image" && s.image) {
      const m = await upsertMediaFromUrl(payload, s.image, `${s.label} stat image`);
      if (m) item.image = (m as { id: string | number }).id;
    }
    statItems.push(item);
  }

  const serviceItems = [];
  for (const svc of aboutServices) {
    const item: Record<string, unknown> = {
      variant: svc.variant,
      title: svc.title ?? "",
    };
    if (svc.variant === "image" && svc.image) {
      const m = await upsertMediaFromUrl(payload, svc.image, `${svc.title || svc.id} service image`);
      if (m) item.image = (m as { id: string | number }).id;
    } else if (svc.items?.length) {
      item.items = svc.items.map((label) => ({ label }));
    }
    serviceItems.push(item);
  }

  const testimonialItems = [];
  for (const t of aboutTestimonials) {
    const item: Record<string, unknown> = {
      quote: t.quote,
      authorName: t.author.name,
      authorRole: t.author.role,
    };
    if (t.image) {
      const m = await upsertMediaFromUrl(payload, t.image, `${t.author.name} testimonial image`);
      if (m) item.image = (m as { id: string | number }).id;
    }
    if (t.author.avatar) {
      const m = await upsertMediaFromUrl(payload, t.author.avatar, `${t.author.name} avatar`);
      if (m) item.authorAvatar = (m as { id: string | number }).id;
    }
    testimonialItems.push(item);
  }

  const teamMembers = [];
  for (const m of aboutTeam) {
    const item: Record<string, unknown> = {
      name: m.name,
      role: m.role,
    };
    if (m.image) {
      const media = await upsertMediaFromUrl(payload, m.image, `${m.name} headshot`);
      if (media) item.photo = (media as { id: string | number }).id;
    }
    teamMembers.push(item);
  }

  await safeUpdateGlobal(payload, "about-page", {
    hero: {
      breadcrumbLabel: "About Us",
      headingHighlight: "The Story",
      headingRest: "Behind the Stories",
    },
    stats: {
      heroImage: aboutHeroMedia
        ? (aboutHeroMedia as { id: string | number }).id
        : undefined,
      items: statItems,
    },
    story: {
      paragraphs: aboutStoryParagraphs.map((text) => ({ text })),
    },
    services: { items: serviceItems },
    brands: {
      heading: "Trusted by ambitious teams",
      items: aboutBrands.map((b) => ({ name: b.name })),
    },
    testimonials: {
      heading: "What readers are saying",
      items: testimonialItems,
    },
    team: {
      heading: "Our Professionals",
      subheading:
        "The people who keep the press running, the design tight and every story shipping on time.",
      members: teamMembers,
    },
    getInTouch: {
      heading: "Get In Touch",
      label: "Available for Work",
      cta: { label: "Get in Touch", url: "/contact" },
    },
    seo: {
      title: "About",
      description:
        "Learn the story behind us — a team of designers, writers, and strategists building modern editorial experiences.",
    },
  });

  await safeUpdateGlobal(payload, "contact-page", {
    hero: {
      breadcrumbLabel: "Contact Us",
      heading: "Let's start a conversation",
    },
    form: {
      heading: "Drop Us a Line",
      submitLabel: "Send message",
      successMessage: "Thanks — we'll be in touch within one business day.",
    },
    latestPosts: { enabled: true, heading: "Latest Posts", limit: 3 },
    seo: {
      title: "Contact",
      description: "Get in touch with our editorial team — we'd love to hear from you.",
    },
  });

  await safeUpdateGlobal(payload, "features-page", {
    hero: {
      eyebrow: "What's inside",
      heading: "The blog platform your editors actually want to use.",
      subheading:
        "A WordPress-grade CMS, a God-tier SEO engine and a front-end engineered for speed — all on Next.js 16 and Supabase.",
      ctas: [
        { label: "Open the CMS", url: "/admin", style: "primary" },
        { label: "See it in action →", url: "/blog", style: "secondary" },
      ],
    },
    pillars: {
      items: [
        { icon: "Sparkles", title: "God-tier SEO engine", description: "Yoast-style scoring, SERP previews, schema validation, IndexNow pings, canonical middleware and auto-internal-linking — all built-in." },
        { icon: "LayoutGrid", title: "Page builder + blocks", description: "Stack polished blocks (Hero, Feature grid, CTA, FAQ, Split, Video…) without code. Lexical rich-text for long-form." },
        { icon: "Bot", title: "AI assistance", description: "Auto-generated alt text, internal-link suggestions, and a writing assistant for titles, excerpts and outlines." },
        { icon: "Workflow", title: "Editorial workflow", description: "Drafts, versions, autosave, scheduled publishing, live preview and role-based access control." },
        { icon: "Gauge", title: "Next.js 16 performance", description: "Incremental static regeneration, on-demand revalidation, Turbopack dev, next/image with Supabase media." },
        { icon: "Shield", title: "Publish quality gate", description: "Enforce a minimum SEO score, require alt text and valid schema before publishing — configurable per brand." },
      ],
    },
    seoChecklist: {
      eyebrow: "SEO, by default",
      heading: "We shipped the checklist so you don't have to.",
      description:
        "Every post passes through a scoring engine, a schema validator and an IndexNow ping — before a human clicks publish.",
      ctaLabel: "Read the blog",
      ctaUrl: "/blog",
      items: [
        { label: "Dynamic generateMetadata per page" },
        { label: "Article, Breadcrumb, FAQ & Person JSON-LD" },
        { label: "Multi-sitemap + RSS / Atom / JSON feeds" },
        { label: "Slug history 301 redirects" },
        { label: "IndexNow ping on publish (Bing, Yandex)" },
        { label: "Auto OG image generation per post" },
        { label: "Broken link checker cron" },
        { label: "404 logging + top-paths dashboard" },
      ],
    },
    tools: {
      eyebrow: "Every tool, batteries included",
      heading: "Everything you'd normally bolt on, already here.",
      items: [
        { icon: "BookOpen", title: "Rich Lexical editor", description: "Headings, callouts, code, embeds, uploads." },
        { icon: "FileText", title: "Page collection", description: "Reusable blocks, nested SEO fields, live preview." },
        { icon: "MessageSquare", title: "Comments + moderation", description: "Threaded discussions with email alerts." },
        { icon: "Mail", title: "Newsletter", description: "Double opt-in subscribers, broadcasts via Resend." },
        { icon: "Search", title: "Site search", description: "Typeahead ⌘K, dedicated /search results view." },
        { icon: "Globe", title: "Hreflang + i18n", description: "Payload localization + per-locale sitemaps." },
        { icon: "LineChart", title: "First-party analytics", description: "Privacy-safe pageview tracker + dashboard." },
        { icon: "BarChart3", title: "Per-post insights", description: "Score trend, reading time, top referrers." },
        { icon: "Rocket", title: "One-click deploy", description: "Vercel + Supabase, env-driven, migrations on build." },
      ],
    },
    seo: {
      title: "Features",
      description:
        "Everything you need to run a premium editorial site — a God-tier SEO engine, a WordPress-grade CMS, AI assistance, comments, newsletter and first-party analytics.",
    },
  });

  log("globals seeded");
}

async function safeUpdateGlobal(
  payload: PayloadInstance,
  slug: string,
  data: Record<string, unknown>,
) {
  try {
    await payload.updateGlobal({ slug: slug as never, data: data as never });
    log("global updated:", slug);
  } catch (err) {
    log("global update failed:", slug, (err as Error).message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
