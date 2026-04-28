import type { BlogPost, Category, Author, Tag } from "@/types";

/**
 * Translation layer between Payload documents and the frontend's typed UI
 * contracts.  Keeping this thin & explicit lets us keep shipping the site
 * even while the CMS schema evolves.
 */

type MediaDoc = {
  id?: string | number;
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
  sizes?: Record<string, { url?: string | null }>;
};

type UserDoc = {
  id: string | number;
  name?: string | null;
  email?: string | null;
  avatar?: MediaDoc | string | null;
};

type CategoryDoc = {
  id: string | number;
  name: string;
  slug: string;
  color?: string | null;
  description?: string | null;
};

type TagDoc = {
  id: string | number;
  name: string;
  slug: string;
};

type PostDoc = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  readingTime?: number | null;
  featured?: boolean | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  coverImage?: MediaDoc | string | null;
  category?: CategoryDoc | string | number | null;
  categories?: (CategoryDoc | string | number)[] | null;
  tags?: (TagDoc | string | number)[] | null;
  authors?: (UserDoc | string | number)[] | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogImage?: MediaDoc | string | null;
    canonicalURL?: string | null;
    noindex?: boolean | null;
  } | null;
};

/**
 * A neutral SVG placeholder shipped from /public — used only when Payload has
 * no media for a slot.  We deliberately avoid an external URL so empty CMS
 * slots remain visually obvious to editors instead of looking like real photos.
 */
const FALLBACK_IMAGE = "/images/placeholder-cover.svg";

const isObj = <T>(v: T | string | number | null | undefined): v is T =>
  typeof v === "object" && v !== null;

export const pickMediaUrl = (
  media: MediaDoc | string | null | undefined,
  size?: keyof NonNullable<MediaDoc["sizes"]>,
): string => {
  if (!media) return FALLBACK_IMAGE;
  if (typeof media === "string") return media;
  if (size && media.sizes?.[size]?.url) return media.sizes[size].url!;
  return media.url ?? FALLBACK_IMAGE;
};

/**
 * Same as pickMediaUrl but returns null instead of the placeholder, so callers
 * can decide between "render an image" or "render no image" cleanly.
 */
export const pickMediaUrlOrNull = (
  media: MediaDoc | string | null | undefined,
  size?: keyof NonNullable<MediaDoc["sizes"]>,
): string | null => {
  if (!media) return null;
  if (typeof media === "string") return media || null;
  if (size && media.sizes?.[size]?.url) return media.sizes[size].url!;
  return media.url ?? null;
};

export const pickMediaAlt = (
  media: MediaDoc | string | null | undefined,
  fallback = "",
): string => {
  if (!media || typeof media === "string") return fallback;
  return media.alt ?? fallback;
};

const AVATAR_FALLBACK = "/images/avatar.svg";

export const toAuthor = (user: UserDoc | string | number | null | undefined): Author => {
  if (!user || !isObj<UserDoc>(user)) {
    return { name: "Editorial Team", avatar: AVATAR_FALLBACK };
  }
  return {
    name: user.name ?? user.email ?? "Anonymous",
    avatar:
      isObj<MediaDoc>(user.avatar)
        ? pickMediaUrl(user.avatar, "thumbnail")
        : typeof user.avatar === "string"
          ? user.avatar
          : AVATAR_FALLBACK,
  };
};

export const toCategory = (
  cat: CategoryDoc | string | number | null | undefined,
): Category => {
  if (!cat || !isObj<CategoryDoc>(cat)) {
    return { name: "General", slug: "general" };
  }
  return {
    name: cat.name,
    slug: cat.slug,
    color: cat.color ?? undefined,
  };
};

export const toTag = (t: TagDoc | string | number | null | undefined): Tag => {
  if (!t || !isObj<TagDoc>(t)) {
    return { name: "Untitled", slug: "untitled" };
  }
  return { name: t.name, slug: t.slug };
};

export const toBlogPost = (doc: PostDoc): BlogPost => {
  const primaryCategory = toCategory(doc.category);
  const allCategories = Array.isArray(doc.categories) && doc.categories.length > 0
    ? doc.categories.map(toCategory)
    : undefined;
  const primaryAuthor = Array.isArray(doc.authors) && doc.authors.length > 0
    ? toAuthor(doc.authors[0])
    : toAuthor(null);

  return {
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    coverImage: pickMediaUrl(doc.coverImage, "wide"),
    category: primaryCategory,
    categories: allCategories,
    author: primaryAuthor,
    publishedAt: doc.publishedAt ?? doc.createdAt ?? new Date().toISOString(),
    readingTime: doc.readingTime ?? 3,
    featured: Boolean(doc.featured),
  };
};

export const toBlogPosts = (docs: PostDoc[] | null | undefined): BlogPost[] =>
  (docs ?? []).map(toBlogPost);
