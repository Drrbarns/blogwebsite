import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getFullPostBySlug, getAllPostSlugs, getPostByHistoricalSlug, listPosts } from "@/lib/cms";
import {
  generateArticleMetadata,
  getArticleJsonLd,
  getBreadcrumbJsonLd,
} from "@/lib/seo";
import { siteDefaults } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { LexicalContent, extractToc } from "@/components/blog/lexical-renderer";
import { ArticleCard } from "@/components/blog/article-card";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TocScrollSpy } from "@/components/blog/toc-scrollspy";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const full = await getFullPostBySlug(slug);
  if (!full) {
    return { title: "Not found" };
  }
  const meta = generateArticleMetadata(full.post, {
    noIndex: Boolean(full.seo?.noindex),
  });
  if (full.seo?.title) meta.title = full.seo.title;
  if (full.seo?.description) meta.description = full.seo.description;
  if (full.seo?.canonicalURL) {
    meta.alternates = { ...(meta.alternates ?? {}), canonical: full.seo.canonicalURL };
  }
  return meta;
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const full = await getFullPostBySlug(slug);

  if (!full) {
    const historical = await getPostByHistoricalSlug(slug);
    if (historical?.slug) {
      redirect(`/blog/${historical.slug}`);
    }
    notFound();
  }

  const { post, content, relatedPosts } = full;
  const toc = extractToc(content);
  const related = relatedPosts.length
    ? relatedPosts
    : (await listPosts({ limit: 3, excludeIds: [post.id] })).docs;

  const articleJsonLd = getArticleJsonLd(post);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: siteDefaults.url },
    { name: "Blog", url: `${siteDefaults.url}/blog` },
    { name: post.title, url: `${siteDefaults.url}/blog/${post.slug}` },
  ]);

  const canonicalUrl = `${siteDefaults.url}/blog/${post.slug}`;

  return (
    <article className="pt-28 lg:pt-32 pb-24">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="max-w-[880px] mx-auto px-4 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.category?.name}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mb-6">
          {(post.categories ?? [post.category]).filter(Boolean).map((c) => (
            <Link
              key={c!.slug}
              href={`/blog?category=${c!.slug}`}
              className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-surface transition"
            >
              {c!.name}
            </Link>
          ))}
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {post.title}
        </h1>

        <p className="mt-5 text-lg text-muted max-w-[760px] leading-relaxed">
          {post.excerpt}
        </p>

        <div className="mt-8 flex items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface border border-border">
              <Image src={post.author.avatar} alt={post.author.name} fill sizes="40px" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{post.author.name}</div>
              <div className="text-muted">
                {formatDate(post.publishedAt)} · {post.readingTime} min read
              </div>
            </div>
          </div>
          <ShareButtons url={canonicalUrl} title={post.title} />
        </div>
      </header>

      {/* ── Hero image ─────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 my-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ── Body + TOC ─────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
        <div>
          <LexicalContent data={content} />
          <div className="mt-14 pt-8 border-t border-stone-200 flex items-center justify-between">
            <div className="text-sm text-muted">Enjoyed the read?</div>
            <ShareButtons url={canonicalUrl} title={post.title} />
          </div>
        </div>

        {toc.length > 0 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                On this page
              </div>
              <TocScrollSpy items={toc} />
            </div>
          </aside>
        ) : null}
      </div>

      {/* ── Related ────────────────────────────────────────────────────── */}
      {related.length > 0 ? (
        <section className="max-w-[1280px] mx-auto px-4 lg:px-8 mt-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
              Keep reading
            </h2>
            <Link href="/blog" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              All articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.slice(0, 3).map((r) => (
              <ArticleCard key={r.id} post={r} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
