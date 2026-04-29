import Link from "next/link";
import { listTags } from "@/lib/cms";
import { generatePageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = generatePageMetadata({
  title: "Browse by tag",
  description: "A tag cloud of every theme touched on across About a Girl — faith, sport, medicine and life.",
  path: "/blog/tags",
});

export default async function TagsIndex() {
  const tags = await listTags();

  return (
    <section className="pt-32 md:pt-40 pb-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-4">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Tags</span>
        </div>
        <div className="max-w-2xl mb-12">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            Tag cloud
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">
            Follow the threads
          </h1>
          <p className="text-lg md:text-xl text-muted mt-5">
            Every tag we use to stitch stories together — click one to see the rest of the
            conversation.
          </p>
        </div>

        {tags.length === 0 ? (
          <p className="text-muted">Tags will appear here once content has been seeded.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((t) => (
              <Link
                key={t.slug}
                href={`/blog/tag/${t.slug}`}
                className="inline-flex items-center rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground hover:text-white transition-colors"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
