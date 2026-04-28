import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, listPageSlugs } from "@/lib/cms";
import { generatePageMetadata } from "@/lib/seo";
import { PageBlocks } from "@/components/page-blocks";
import { LexicalContent } from "@/components/blog/lexical-renderer";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

const RESERVED = new Set([
  "blog",
  "authors",
  "search",
  "api",
  "admin",
  "sitemap.xml",
  "robots.txt",
  "rss.xml",
  "feed.atom",
  "feed.json",
  "_next",
]);

export async function generateStaticParams() {
  try {
    const slugs = await listPageSlugs();
    return slugs
      .filter((s) => s && !RESERVED.has(s))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

type PageDoc = {
  title: string;
  excerpt?: string;
  content?: unknown;
  layout?: unknown[];
  seo?: {
    title?: string;
    description?: string;
    ogImage?: { url?: string } | string | null;
    noindex?: boolean;
  };
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  const page = (await getPageBySlug(slug)) as PageDoc | null;
  if (!page) return {};
  return generatePageMetadata({
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? page.excerpt ?? "",
    path: `/${slug}`,
    ogImage:
      typeof page.seo?.ogImage === "object"
        ? (page.seo?.ogImage as { url?: string } | null)?.url
        : (page.seo?.ogImage as string | undefined),
    noIndex: Boolean(page.seo?.noindex),
  });
}

export default async function DynamicPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  const page = (await getPageBySlug(slug)) as PageDoc | null;
  if (!page) notFound();

  return (
    <article className="pt-28 md:pt-36">
      {!page.layout?.length && (
        <header className="max-w-[880px] mx-auto px-4 lg:px-8 mb-12 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-lg md:text-xl text-muted mt-4 max-w-2xl mx-auto">
              {page.excerpt}
            </p>
          )}
        </header>
      )}
      {Array.isArray(page.layout) && page.layout.length > 0 && (
        <PageBlocks blocks={page.layout as never} />
      )}
      {Boolean(page.content) && (
        <div className="max-w-[720px] mx-auto px-4 lg:px-8 pb-24 prose prose-stone prose-lg">
          <LexicalContent data={page.content} />
        </div>
      )}
    </article>
  );
}
