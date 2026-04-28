import type { MetadataRoute } from "next";
import { siteDefaults } from "@/lib/seo";
import {
  getAllPostSlugs,
  listCategories,
  listTags,
  listAuthors,
  listPageSlugs,
} from "@/lib/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, categories, tags, authors, pages] = await Promise.all([
    getAllPostSlugs(),
    listCategories(),
    listTags(),
    listAuthors(),
    listPageSlugs(),
  ]);
  const now = new Date();

  const base = siteDefaults.url;

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/authors`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/blog/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/blog/tags`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const postEntries: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/blog/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${base}/blog/tag/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const authorEntries: MetadataRoute.Sitemap = authors
    .filter((a) => Boolean(a.slug))
    .map((a) => ({
      url: `${base}/authors/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...postEntries,
    ...categoryEntries,
    ...tagEntries,
    ...authorEntries,
    ...pageEntries,
  ];
}
