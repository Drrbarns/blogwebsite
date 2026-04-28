import type { Metadata } from "next";
import type { BlogPost } from "@/types";
import { siteDefaults } from "./defaults";

interface MetadataArgs {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage,
  noIndex = false,
  canonical,
}: MetadataArgs = {}): Metadata {
  const pageTitle = title
    ? `${title} — ${siteDefaults.name}`
    : `${siteDefaults.name} — Fresh Ideas, Insightful Stories & Practical Tips`;
  const pageDescription = description || siteDefaults.description;
  const url = canonical ?? `${siteDefaults.url}${path}`;
  const image = ogImage || siteDefaults.ogImage;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteDefaults.url),
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${siteDefaults.url}/rss.xml`,
        "application/atom+xml": `${siteDefaults.url}/feed.atom`,
        "application/json": `${siteDefaults.url}/feed.json`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteDefaults.name,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function generateArticleMetadata(
  post: BlogPost,
  opts?: { noIndex?: boolean },
): Metadata {
  const url = `${siteDefaults.url}/blog/${post.slug}`;
  const title = `${post.title} — ${siteDefaults.name}`;
  const description = post.excerpt;

  return {
    title,
    description,
    metadataBase: new URL(siteDefaults.url),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteDefaults.name,
      locale: "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author.name],
      section: post.category?.name,
      tags: post.categories?.map((c) => c.name),
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage],
    },
    robots: opts?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
