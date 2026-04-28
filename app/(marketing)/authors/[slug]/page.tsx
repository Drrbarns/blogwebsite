import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getAuthorPosts, listAuthors } from "@/lib/cms";
import { ArticleCard } from "@/components/blog/article-card";
import { generatePageMetadata } from "@/lib/seo";
import { siteDefaults } from "@/lib/seo";
import { pickMediaUrl } from "@/lib/cms/transforms";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
  const authors = await listAuthors();
  return authors
    .map((a) => a.slug)
    .filter((s): s is string => typeof s === "string" && s.length > 0)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  return generatePageMetadata({
    title: `${author.name} — Author`,
    description: author.bio ?? `Articles by ${author.name}.`,
    path: `/authors/${slug}`,
  });
}

export default async function AuthorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = await getAuthorPosts(author.id, 60);
  const avatar = pickMediaUrl(author.avatar as never, "card");
  const socials: { label: string; url?: string }[] = [
    { label: "Twitter", url: author.social?.twitter },
    { label: "LinkedIn", url: author.social?.linkedin },
    { label: "GitHub", url: author.social?.github },
    { label: "Website", url: author.social?.website },
  ].filter((s) => Boolean(s.url));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${siteDefaults.url}/authors/${slug}`,
    image: avatar,
    description: author.bio,
    sameAs: socials.map((s) => s.url).filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-32 md:pt-40">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            <div className="relative shrink-0 w-40 h-40 md:w-56 md:h-56 rounded-[32px] overflow-hidden bg-stone-100">
              <Image
                src={avatar}
                alt={author.name}
                fill
                className="object-cover"
                sizes="224px"
                priority
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
                Author
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                {author.name}
              </h1>
              {/* @ts-expect-error headline not in base type */}
              {author.headline && (
                <p className="text-xl md:text-2xl text-foreground/80 mt-3">
                  {/* @ts-expect-error headline not in base type */}
                  {author.headline}
                </p>
              )}
              {author.bio && (
                <p className="text-lg text-muted mt-5 max-w-2xl leading-relaxed">
                  {author.bio}
                </p>
              )}
              {socials.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-stone-200 text-sm font-semibold text-foreground hover:bg-stone-50"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Articles by {author.name.split(" ")[0]}
            </h2>
            <Link href="/blog" className="text-sm font-semibold text-foreground hover:text-accent">
              All articles →
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-muted">No articles yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {posts.map((p) => (
                <ArticleCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
