import type { BlogPost } from "@/types";
import { siteDefaults } from "./defaults";

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteDefaults.name,
    url: siteDefaults.url,
    description: siteDefaults.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteDefaults.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteDefaults.name,
    url: siteDefaults.url,
    logo: `${siteDefaults.url}${siteDefaults.logo}`,
  };
}

export function getBlogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteDefaults.name} Blog`,
    url: `${siteDefaults.url}/blog`,
    description: siteDefaults.description,
    publisher: {
      "@type": "Organization",
      name: siteDefaults.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteDefaults.url}${siteDefaults.logo}`,
      },
    },
  };
}

export function getArticleJsonLd(post: BlogPost) {
  const url = `${siteDefaults.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteDefaults.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteDefaults.url}${siteDefaults.logo}`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category?.name,
    keywords: [post.category?.name, ...(post.categories?.map((c) => c.name) ?? [])]
      .filter(Boolean)
      .join(", "),
    url,
  };
}

export function getBreadcrumbJsonLd(
  trail: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((node, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: node.name,
      item: node.url,
    })),
  };
}
