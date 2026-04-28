import Link from "next/link";
import { listPosts } from "@/lib/cms";
import { ArticleCard } from "@/components/blog/article-card";
import { NotFoundLogger } from "@/components/shared/not-found-logger";
import { SearchForm } from "@/components/search/search-form";

export default async function NotFound() {
  let recent: Awaited<ReturnType<typeof listPosts>>["docs"] = [];
  try {
    const res = await listPosts({ limit: 3, sort: "-publishedAt" });
    recent = res.docs;
  } catch {
    /* ignore */
  }

  return (
    <section className="pt-32 md:pt-40 pb-24">
      <NotFoundLogger />
      <div className="max-w-[880px] mx-auto px-4 lg:px-8 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
          404
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight">
          We can’t find that page
        </h1>
        <p className="text-muted text-lg md:text-xl mt-5 max-w-xl mx-auto">
          The URL might be typed incorrectly or the article may have moved. Try searching or
          pick one of the popular reads below.
        </p>

        <div className="mt-10 max-w-lg mx-auto">
          <SearchForm />
        </div>

        <div className="flex items-center justify-center gap-3 mt-7">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-foreground text-white font-semibold text-sm"
          >
            Back to homepage
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-stone-200 font-semibold text-sm"
          >
            Browse the blog
          </Link>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 mt-20">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/60 mb-6 text-center">
            Popular reads
          </div>
          <div className="grid md:grid-cols-3 gap-x-6 gap-y-10">
            {recent.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
