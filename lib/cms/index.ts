import "server-only";

/**
 * Unified CMS data entry point.
 *
 * When Payload/DB is unreachable (no DATABASE_URI configured, Supabase cold
 * start in dev, or seed script hasn't been run yet), we transparently fall
 * back to the legacy mock data so `npm run dev` always renders the full site.
 *
 * Once `scripts/seed.ts` has been run against a real database, the fallback
 * is never hit.
 */

import * as mock from "@/lib/data";
import type { BlogPost, Tag, Category, TrendingItem } from "@/types";
import type {
  SiteSettingsDoc,
  NavigationDoc,
  AboutPageDoc,
  ContactPageDoc,
  FeaturesPageDoc,
} from "./docs";
import {
  getBlogPageData as _getBlogPageData,
  getHomepageData as _getHomepageData,
  getPostBySlug as _getPostBySlug,
  getFullPostBySlug as _getFullPostBySlug,
  getPostByHistoricalSlug as _getPostByHistoricalSlug,
  getAllPostSlugs as _getAllPostSlugs,
  listCategories as _listCategories,
  listPosts as _listPosts,
  listTags as _listTags,
  listTrending as _listTrending,
  getCategoryBySlug as _getCategoryBySlug,
  getTagBySlug as _getTagBySlug,
  getAuthorBySlug as _getAuthorBySlug,
  getAuthorPosts as _getAuthorPosts,
  listAuthors as _listAuthors,
  searchPosts as _searchPosts,
  getPageBySlug as _getPageBySlug,
  listPageSlugs as _listPageSlugs,
  getNavigation as _getNavigation,
  getSiteSettings as _getSiteSettings,
  getAboutPage as _getAboutPage,
  getContactPage as _getContactPage,
  getFeaturesPage as _getFeaturesPage,
  type FullPostDoc,
  type AuthorDoc,
} from "./queries";

const dbConfigured = (): boolean => {
  const uri = process.env.DATABASE_URI;
  return Boolean(uri && uri.length > 10);
};

const mockHomepage = () => ({
  heroFeaturedPosts: mock.heroFeaturedPosts,
  freshPosts: mock.freshPosts,
  recentArticles: mock.recentArticles,
  featuredSidebarPosts: mock.featuredSidebarPosts,
  trendingItems: mock.trendingItems,
  categories: mock.categories,
  popularTags: mock.popularTags,
  relatedArticles: mock.relatedArticles,
});

const mockBlog = () => ({
  hero: mock.blogHeroPost,
  gridPosts: mock.blogGridPosts,
  freshPosts: mock.blogFreshPosts,
  trendingItems: mock.blogTrendingItems,
  totalPages: 5,
  currentPage: 1,
});

/**
 * When DB is configured, we ALWAYS return whatever the CMS produced — even an
 * empty array — so editors can see what their changes do. We only fall back to
 * the mock seed data when the DB is missing entirely (no DATABASE_URI set) or
 * the query throws.  This keeps newly-published edits authoritative and
 * prevents stale mock content from leaking through when a section is empty.
 */
const safely = async <T>(primary: () => Promise<T>, fallback: () => T): Promise<T> => {
  if (!dbConfigured()) return fallback();
  try {
    return await primary();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[cms] query failed, falling back to mock data:", (err as Error).message);
    }
    return fallback();
  }
};

export const getHomepageData = (): Promise<ReturnType<typeof mockHomepage>> =>
  safely(() => _getHomepageData() as Promise<ReturnType<typeof mockHomepage>>, mockHomepage);

export const getBlogPageData = (args?: { limit?: number; page?: number }) =>
  safely(() => _getBlogPageData(args) as Promise<ReturnType<typeof mockBlog>>, mockBlog);

export const getPostBySlug = (slug: string): Promise<BlogPost | null> =>
  safely<BlogPost | null>(
    () => _getPostBySlug(slug),
    () => {
      const all: BlogPost[] = [
        ...mock.heroFeaturedPosts,
        ...mock.freshPosts,
        ...mock.recentArticles,
        mock.blogHeroPost,
        ...mock.blogGridPosts,
        ...mock.blogFreshPosts,
      ];
      return all.find((p) => p.slug === slug) ?? null;
    },
  );

const fallbackMockContent = (post: BlogPost | null): FullPostDoc | null => {
  if (!post) return null;
  return {
    post,
    content: {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text:
                  post.excerpt +
                  " This is placeholder copy shown while the CMS is being configured. Once you run the seed script against your Supabase database, the full editorial content will render here.",
              },
            ],
          },
          {
            type: "heading",
            tag: "h2",
            children: [{ type: "text", text: "Why this matters" }],
          },
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text:
                  "The editorial team will replace this section with in-depth analysis, original reporting and supporting media.",
              },
            ],
          },
          {
            type: "heading",
            tag: "h2",
            children: [{ type: "text", text: "What comes next" }],
          },
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text:
                  "Expect practical takeaways, interviews with practitioners and a toolkit you can apply the same day.",
              },
            ],
          },
        ],
      },
    },
    relatedPosts: [...mock.freshPosts, ...mock.recentArticles]
      .filter((p) => p.slug !== post.slug)
      .slice(0, 3),
    seo: null,
  };
};

export const getFullPostBySlug = (slug: string): Promise<FullPostDoc | null> =>
  safely<FullPostDoc | null>(
    () => _getFullPostBySlug(slug),
    () => {
      const all: BlogPost[] = [
        ...mock.heroFeaturedPosts,
        ...mock.freshPosts,
        ...mock.recentArticles,
        mock.blogHeroPost,
        ...mock.blogGridPosts,
        ...mock.blogFreshPosts,
      ];
      const post = all.find((p) => p.slug === slug) ?? null;
      return fallbackMockContent(post);
    },
  );

export const getPostByHistoricalSlug = (slug: string) =>
  safely(() => _getPostByHistoricalSlug(slug), () => null);

export const getAllPostSlugs = (): Promise<string[]> =>
  safely<string[]>(
    () => _getAllPostSlugs(),
    () => {
      const all: BlogPost[] = [
        ...mock.heroFeaturedPosts,
        ...mock.freshPosts,
        ...mock.recentArticles,
        mock.blogHeroPost,
        ...mock.blogGridPosts,
        ...mock.blogFreshPosts,
      ];
      return [...new Set(all.map((p) => p.slug))];
    },
  );

export const listCategories = (): Promise<Category[]> =>
  safely<Category[]>(() => _listCategories(), () => mock.categories);

export const listTags = (): Promise<Tag[]> =>
  safely<Tag[]>(() => _listTags(), () => mock.popularTags);

export const listTrending = (limit = 8): Promise<TrendingItem[]> =>
  safely<TrendingItem[]>(
    () => _listTrending(limit),
    () => mock.trendingItems.slice(0, limit),
  );

export const listPosts = (args?: Parameters<typeof _listPosts>[0]) =>
  safely(
    () => _listPosts(args),
    () => {
      const pool: BlogPost[] = [...mock.freshPosts, ...mock.recentArticles];
      const filtered = args?.categorySlug
        ? pool.filter((p) => p.category.slug === args.categorySlug)
        : pool;
      const limit = args?.limit ?? 12;
      return {
        docs: filtered.slice(0, limit),
        totalDocs: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
        page: 1,
      };
    },
  );

export const getCategoryBySlug = (slug: string): Promise<Category | null> =>
  safely<Category | null>(
    () => _getCategoryBySlug(slug),
    () => mock.categories.find((c) => c.slug === slug) ?? null,
  );

export const getTagBySlug = (slug: string): Promise<Tag | null> =>
  safely<Tag | null>(
    () => _getTagBySlug(slug),
    () => mock.popularTags.find((t) => t.slug === slug) ?? null,
  );

export const getAuthorBySlug = (slug: string): Promise<AuthorDoc | null> =>
  safely<AuthorDoc | null>(() => _getAuthorBySlug(slug), () => null);

export const getAuthorPosts = (authorId: string | number, limit = 24) =>
  safely<BlogPost[]>(() => _getAuthorPosts(authorId, limit), () => []);

export const listAuthors = () =>
  safely<AuthorDoc[]>(() => _listAuthors(), () => []);

export const searchPosts = (q: string, args?: { limit?: number }) =>
  safely<BlogPost[]>(
    () => _searchPosts(q, args),
    () => {
      const pool: BlogPost[] = [
        ...mock.heroFeaturedPosts,
        ...mock.freshPosts,
        ...mock.recentArticles,
        ...mock.blogGridPosts,
        ...mock.blogFreshPosts,
      ];
      const needle = q.toLowerCase();
      return pool
        .filter(
          (p) =>
            p.title.toLowerCase().includes(needle) ||
            p.excerpt.toLowerCase().includes(needle),
        )
        .slice(0, args?.limit ?? 20);
    },
  );

export const getPageBySlug = (slug: string) =>
  safely(() => _getPageBySlug(slug), () => null as unknown);

export const listPageSlugs = () =>
  safely<string[]>(() => _listPageSlugs(), () => []);

export const getNavigation = (): Promise<NavigationDoc | null> =>
  safely<NavigationDoc | null>(
    () => _getNavigation() as Promise<NavigationDoc | null>,
    () => null,
  );

export const getSiteSettings = (): Promise<SiteSettingsDoc | null> =>
  safely<SiteSettingsDoc | null>(
    () => _getSiteSettings() as Promise<SiteSettingsDoc | null>,
    () => null,
  );

export const getAboutPage = (): Promise<AboutPageDoc | null> =>
  safely<AboutPageDoc | null>(
    () => _getAboutPage() as Promise<AboutPageDoc | null>,
    () => null,
  );

export const getContactPage = (): Promise<ContactPageDoc | null> =>
  safely<ContactPageDoc | null>(
    () => _getContactPage() as Promise<ContactPageDoc | null>,
    () => null,
  );

export const getFeaturesPage = (): Promise<FeaturesPageDoc | null> =>
  safely<FeaturesPageDoc | null>(
    () => _getFeaturesPage() as Promise<FeaturesPageDoc | null>,
    () => null,
  );

export type { AuthorDoc } from "./queries";
export type {
  SiteSettingsDoc,
  NavigationDoc,
  AboutPageDoc,
  ContactPageDoc,
  FeaturesPageDoc,
  MediaRef,
} from "./docs";
