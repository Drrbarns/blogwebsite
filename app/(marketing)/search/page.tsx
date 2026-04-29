import { searchPosts } from "@/lib/cms";
import { ArticleCard } from "@/components/blog/article-card";
import { generatePageMetadata } from "@/lib/seo";
import { SearchForm } from "@/components/search/search-form";

export const revalidate = 0;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return generatePageMetadata({
    title: q ? `Search — ${q}` : "Search",
    description: "Search the About a Girl archive — faith, sport, medicine and life.",
    path: `/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    noIndex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query.length >= 2 ? await searchPosts(query, { limit: 24 }) : [];

  return (
    <section className="pt-32 md:pt-40 pb-24">
      <div className="max-w-[960px] mx-auto px-4 lg:px-8">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
          Search
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          Find the piece you’re after
        </h1>
        <p className="text-muted mt-4 text-lg">
          Type a keyword, author name, or phrase.
        </p>

        <div className="mt-8">
          <SearchForm defaultValue={query} autoFocus />
        </div>

        {query.length >= 2 && (
          <div className="mt-10 text-muted text-sm">
            {results.length === 0
              ? `No results for “${query}”.`
              : `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”.`}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 mt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {results.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
