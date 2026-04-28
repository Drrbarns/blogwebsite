import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, listPosts, listCategories } from "@/lib/cms";
import { ArticleCard } from "@/components/blog/article-card";
import { generatePageMetadata } from "@/lib/seo";
import { siteDefaults } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const cats = await listCategories();
    return cats.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return generatePageMetadata({
    title: `${cat.name} — Articles`,
    description: `Deep-dive articles, interviews and analysis on ${cat.name.toLowerCase()}.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const { docs, totalPages, totalDocs } = await listPosts({
    categorySlug: slug,
    limit: 9,
    page,
    sort: "-publishedAt",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} — ${siteDefaults.name}`,
    url: `${siteDefaults.url}/blog/category/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: docs.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1 + (page - 1) * 9,
        url: `${siteDefaults.url}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-32 md:pt-40">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted mb-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{cat.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
              Category
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              {cat.name}
            </h1>
            <p className="text-lg md:text-xl text-muted mt-5">
              {totalDocs} {totalDocs === 1 ? "article" : "articles"} on {cat.name.toLowerCase()}.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          {docs.length === 0 ? (
            <p className="text-muted">No articles yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {docs.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <Link
                    key={p}
                    href={`/blog/category/${slug}${p === 1 ? "" : `?page=${p}`}`}
                    className={`w-10 h-10 rounded-full inline-flex items-center justify-center text-sm font-semibold ${
                      p === page
                        ? "bg-foreground text-white"
                        : "bg-white border border-stone-200 text-foreground hover:bg-stone-50"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
