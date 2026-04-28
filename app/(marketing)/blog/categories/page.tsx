import Link from "next/link";
import { listCategories, listPosts } from "@/lib/cms";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = generatePageMetadata({
  title: "Browse by category",
  description: "Explore every topic published on Ontario — design, code, business and culture.",
  path: "/blog/categories",
});

export default async function CategoriesIndex() {
  const cats = await listCategories();

  const counts = await Promise.all(
    cats.map(async (c) => {
      try {
        const { totalDocs } = await listPosts({
          limit: 1,
          page: 1,
          categorySlug: c.slug,
        });
        return { slug: c.slug, name: c.name, count: totalDocs };
      } catch {
        return { slug: c.slug, name: c.name, count: 0 };
      }
    }),
  );

  return (
    <section className="pt-32 md:pt-40 pb-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-4">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Categories</span>
        </div>
        <div className="max-w-2xl mb-12">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Directory
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">
            Every topic in one place
          </h1>
          <p className="text-lg md:text-xl text-muted mt-5">
            Dive into {cats.length || "our"} {cats.length === 1 ? "category" : "categories"} covering the
            ideas, interviews and industry signals shaping what’s next.
          </p>
        </div>

        {counts.length === 0 ? (
          <p className="text-muted">Categories will appear here once content has been seeded.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {counts.map(({ slug, name, count }) => (
              <Link
                key={slug}
                href={`/blog/category/${slug}`}
                className="group rounded-3xl border border-stone-200 bg-white p-6 hover:shadow-lg hover:shadow-black/[0.04] hover:border-stone-300 transition-all"
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                  {count} {count === 1 ? "article" : "articles"}
                </div>
                <div className="font-display text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {name}
                </div>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Browse
                  <span aria-hidden>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
