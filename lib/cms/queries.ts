import "server-only";

import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";

import type { Where } from "payload";

import type { BlogPost, Category, Tag, TrendingItem } from "@/types";
import { getPayload } from "./payload";
import { toBlogPost, toBlogPosts, toCategory, toTag } from "./transforms";

type PostSort = "-publishedAt" | "publishedAt" | "-createdAt";

const isDraft = async () => {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
};

/**
 * Fetch published posts with optional filters. Wrapped in unstable_cache so
 * server components get fast, deduped reads between RSC renders.  Cache tag
 * `posts` is busted from the Payload afterChange hook.
 */
export const listPosts = async ({
  limit = 12,
  page = 1,
  sort = "-publishedAt",
  categorySlug,
  tagSlug,
  featured,
  excludeIds = [],
  q,
}: {
  limit?: number;
  page?: number;
  sort?: PostSort;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  excludeIds?: string[];
  q?: string;
} = {}): Promise<{ docs: BlogPost[]; totalDocs: number; totalPages: number; page: number }> => {
  const draft = await isDraft();
  const key = [
    "list-posts",
    String(limit),
    String(page),
    sort,
    categorySlug ?? "",
    tagSlug ?? "",
    featured === undefined ? "" : String(featured),
    excludeIds.join(","),
    q ?? "",
    draft ? "draft" : "pub",
  ];

  const run = async () => {
    const payload = await getPayload();
    const where: Where = {};
    const and: Where[] = [];

    if (!draft) and.push({ _status: { equals: "published" } });

    if (categorySlug) {
      const categoryResult = await payload.find({
        collection: "categories",
        where: { slug: { equals: categorySlug } },
        limit: 1,
        depth: 0,
      });
      const catId = categoryResult.docs?.[0]?.id;
      if (catId) {
        and.push({
          or: [
            { category: { equals: catId } },
            { categories: { in: [catId] } },
          ],
        });
      } else {
        return { docs: [], totalDocs: 0, totalPages: 0, page: 1 };
      }
    }

    if (tagSlug) {
      const tagResult = await payload.find({
        collection: "tags",
        where: { slug: { equals: tagSlug } },
        limit: 1,
        depth: 0,
      });
      const tagId = tagResult.docs?.[0]?.id;
      if (tagId) and.push({ tags: { in: [tagId] } });
      else return { docs: [], totalDocs: 0, totalPages: 0, page: 1 };
    }

    if (typeof featured === "boolean") and.push({ featured: { equals: featured } });

    if (excludeIds.length) and.push({ id: { not_in: excludeIds } });

    if (q) {
      and.push({
        or: [
          { title: { like: q } },
          { excerpt: { like: q } },
        ],
      });
    }

    if (and.length) where.and = and;

    const res = await payload.find({
      collection: "posts",
      where,
      limit,
      page,
      sort,
      depth: 2,
      draft,
    });

    return {
      docs: toBlogPosts(res.docs as unknown as Parameters<typeof toBlogPost>[0][]),
      totalDocs: res.totalDocs,
      totalPages: res.totalPages,
      page: res.page ?? 1,
    };
  };

  return unstable_cache(run, key, { tags: ["posts"], revalidate: 60 })();
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const draft = await isDraft();
  const run = async () => {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "posts",
      where: {
        and: [
          { slug: { equals: slug } },
          draft ? {} : { _status: { equals: "published" } },
        ],
      },
      limit: 1,
      depth: 2,
      draft,
    });
    const doc = res.docs?.[0];
    return doc ? toBlogPost(doc as unknown as Parameters<typeof toBlogPost>[0]) : null;
  };

  return unstable_cache(run, ["post", slug, draft ? "draft" : "pub"], {
    tags: ["posts", `post:${slug}`],
    revalidate: 60,
  })();
};

export type FullPostDoc = {
  post: BlogPost;
  content: unknown;
  relatedPosts: BlogPost[];
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    canonicalURL?: string | null;
    noindex?: boolean | null;
    ogImage?: { url?: string | null } | string | null;
  } | null;
};

export const getFullPostBySlug = async (slug: string): Promise<FullPostDoc | null> => {
  const draft = await isDraft();
  const payload = await getPayload();
  const res = await payload.find({
    collection: "posts",
    where: {
      and: [
        { slug: { equals: slug } },
        draft ? {} : { _status: { equals: "published" } },
      ],
    },
    limit: 1,
    depth: 2,
    draft,
  });
  const doc = res.docs?.[0] as unknown as (Parameters<typeof toBlogPost>[0] & {
    content?: unknown;
    relatedPosts?: Parameters<typeof toBlogPost>[0][];
    seo?: FullPostDoc["seo"];
  }) | undefined;

  if (!doc) return null;

  return {
    post: toBlogPost(doc),
    content: doc.content,
    relatedPosts: Array.isArray(doc.relatedPosts)
      ? doc.relatedPosts.map(toBlogPost)
      : [],
    seo: doc.seo ?? null,
  };
};

/**
 * Lookup a post by a historical slug. Used to 301 when the slug changes.
 */
export const getPostByHistoricalSlug = async (
  slug: string,
): Promise<{ slug: string } | null> => {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "posts",
    where: { "slugHistory.slug": { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const doc = res.docs?.[0] as { slug?: string } | undefined;
  return doc?.slug ? { slug: doc.slug } : null;
};

export const getAllPostSlugs = async (): Promise<string[]> => {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    limit: 1000,
    depth: 0,
  });
  return (res.docs ?? []).map((d) => (d as { slug?: string }).slug ?? "").filter(Boolean);
};

export const listCategories = async (): Promise<Category[]> => {
  const run = async () => {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "categories",
      limit: 50,
      sort: "name",
      depth: 0,
    });
    return (res.docs ?? []).map((d) =>
      toCategory(d as Parameters<typeof toCategory>[0]),
    );
  };
  return unstable_cache(run, ["list-categories"], {
    tags: ["categories"],
    revalidate: 300,
  })();
};

export const listTags = async (): Promise<Tag[]> => {
  const run = async () => {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "tags",
      limit: 100,
      sort: "name",
      depth: 0,
    });
    return (res.docs ?? []).map((d) =>
      toTag(d as Parameters<typeof toTag>[0]),
    );
  };
  return unstable_cache(run, ["list-tags"], {
    tags: ["tags"],
    revalidate: 300,
  })();
};

/**
 * Derive trending items from the most recently viewed/commented posts.  For
 * now this just returns the latest N posts — Phase 3 analytics will plug into
 * this fn directly.
 */
export const listTrending = async (limit = 8): Promise<TrendingItem[]> => {
  const { docs } = await listPosts({ limit });
  return docs.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
  }));
};

export const getHomepageData = async () => {
  const [hero, fresh, recent, featured, trending, categories, tags] = await Promise.all([
    listPosts({ limit: 3, featured: true, sort: "-publishedAt" }),
    listPosts({ limit: 6, sort: "-publishedAt" }),
    listPosts({ limit: 3, sort: "-publishedAt" }),
    listPosts({ limit: 1, featured: true }),
    listTrending(6),
    listCategories(),
    listTags(),
  ]);

  return {
    heroFeaturedPosts: hero.docs.length ? hero.docs : fresh.docs.slice(0, 3),
    freshPosts: fresh.docs,
    recentArticles: recent.docs,
    featuredSidebarPosts: featured.docs,
    trendingItems: trending,
    categories,
    popularTags: tags,
    relatedArticles: recent.docs.slice(0, 3),
  };
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const run = async () => {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs?.[0];
    return doc ? toCategory(doc as Parameters<typeof toCategory>[0]) : null;
  };
  return unstable_cache(run, ["category", slug], {
    tags: ["categories", `category:${slug}`],
    revalidate: 300,
  })();
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  const run = async () => {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "tags",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs?.[0];
    return doc ? toTag(doc as Parameters<typeof toTag>[0]) : null;
  };
  return unstable_cache(run, ["tag", slug], {
    tags: ["tags", `tag:${slug}`],
    revalidate: 300,
  })();
};

export type AuthorDoc = {
  id: string | number;
  name: string;
  slug?: string;
  email?: string;
  bio?: string;
  avatar?: unknown;
  social?: Record<string, string | undefined>;
};

export const getAuthorBySlug = async (slug: string): Promise<AuthorDoc | null> => {
  const run = async () => {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "users",
      where: {
        or: [
          { slug: { equals: slug } },
          { email: { equals: slug } },
        ],
      },
      limit: 1,
      depth: 1,
    });
    const doc = res.docs?.[0] as AuthorDoc | undefined;
    return doc ?? null;
  };
  return unstable_cache(run, ["author", slug], {
    tags: ["authors", `author:${slug}`],
    revalidate: 300,
  })();
};

export const getAuthorPosts = async (
  authorId: string | number,
  limit = 24,
): Promise<BlogPost[]> => {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "posts",
    where: {
      and: [
        { authors: { in: [authorId] } },
        { _status: { equals: "published" } },
      ],
    },
    limit,
    depth: 2,
    sort: "-publishedAt",
  });
  return toBlogPosts(res.docs as unknown as Parameters<typeof toBlogPost>[0][]);
};

export const listAuthors = async (): Promise<AuthorDoc[]> => {
  const payload = await getPayload();
  const res = await payload.find({
    collection: "users",
    where: {
      roles: { in: ["admin", "editor", "author", "contributor"] },
    },
    limit: 100,
    depth: 1,
  });
  return res.docs as unknown as AuthorDoc[];
};

/**
 * Full-text search using Payload's search plugin collection.
 */
export const searchPosts = async (
  q: string,
  { limit = 20 }: { limit?: number } = {},
): Promise<BlogPost[]> => {
  if (!q.trim()) return [];
  const payload = await getPayload();
  const res = await payload.find({
    collection: "search",
    where: {
      or: [
        { title: { like: q } },
        { excerpt: { like: q } },
      ],
    },
    limit,
    depth: 2,
  });
  const docs = (res.docs ?? [])
    .map((d) => (d as { doc?: { value?: unknown; relationTo?: string } }).doc?.value)
    .filter(Boolean);
  return toBlogPosts(docs as unknown as Parameters<typeof toBlogPost>[0][]);
};

export const getPageBySlug = async (slug: string) => {
  const draft = await isDraft();
  const run = async () => {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "pages",
      where: {
        and: [
          { slug: { equals: slug } },
          draft ? {} : { _status: { equals: "published" } },
        ],
      },
      limit: 1,
      depth: 2,
      draft,
    });
    return res.docs?.[0] ?? null;
  };
  return unstable_cache(run, ["page", slug, draft ? "draft" : "pub"], {
    tags: ["pages", `page:${slug}`],
    revalidate: 60,
  })();
};

export const listPageSlugs = async (): Promise<string[]> => {
  try {
    const payload = await getPayload();
    const res = await payload.find({
      collection: "pages",
      where: { _status: { equals: "published" } },
      limit: 1000,
      depth: 0,
    });
    return (res.docs ?? [])
      .map((d) => (d as { slug?: string }).slug ?? "")
      .filter(Boolean);
  } catch {
    return [];
  }
};

export const getNavigation = async () => {
  const run = async () => {
    const payload = await getPayload();
    try {
      return await payload.findGlobal({ slug: "navigation", depth: 1 });
    } catch {
      return null;
    }
  };
  return unstable_cache(run, ["navigation"], {
    tags: ["navigation"],
    revalidate: 300,
  })();
};

export const getSiteSettings = async () => {
  const run = async () => {
    const payload = await getPayload();
    try {
      return await payload.findGlobal({ slug: "site-settings", depth: 1 });
    } catch {
      return null;
    }
  };
  return unstable_cache(run, ["site-settings"], {
    tags: ["site-settings"],
    revalidate: 300,
  })();
};

export const getAboutPage = async () => {
  const run = async () => {
    const payload = await getPayload();
    try {
      return await payload.findGlobal({ slug: "about-page", depth: 2 });
    } catch {
      return null;
    }
  };
  return unstable_cache(run, ["about-page"], {
    tags: ["about-page"],
    revalidate: 300,
  })();
};

export const getContactPage = async () => {
  const run = async () => {
    const payload = await getPayload();
    try {
      return await payload.findGlobal({ slug: "contact-page", depth: 2 });
    } catch {
      return null;
    }
  };
  return unstable_cache(run, ["contact-page"], {
    tags: ["contact-page"],
    revalidate: 300,
  })();
};

export const getFeaturesPage = async () => {
  const run = async () => {
    const payload = await getPayload();
    try {
      return await payload.findGlobal({ slug: "features-page", depth: 2 });
    } catch {
      return null;
    }
  };
  return unstable_cache(run, ["features-page"], {
    tags: ["features-page"],
    revalidate: 300,
  })();
};

export const getBlogPageData = async ({
  limit = 6,
  page = 1,
}: { limit?: number; page?: number } = {}) => {
  const [featured, grid, fresh, trending] = await Promise.all([
    listPosts({ limit: 1, featured: true }),
    listPosts({ limit: 3, page: 1, sort: "-publishedAt" }),
    listPosts({ limit, page, sort: "-publishedAt" }),
    listTrending(6),
  ]);

  return {
    hero: featured.docs[0] ?? fresh.docs[0] ?? null,
    gridPosts: grid.docs,
    freshPosts: fresh.docs,
    trendingItems: trending,
    totalPages: fresh.totalPages,
    currentPage: fresh.page,
  };
};
