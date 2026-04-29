import Image from "next/image";
import Link from "next/link";
import { listAuthors } from "@/lib/cms";
import { generatePageMetadata } from "@/lib/seo";
import { pickMediaUrl } from "@/lib/cms/transforms";

export const revalidate = 300;

export const metadata = generatePageMetadata({
  title: "Authors",
  description: "Meet the voices behind About a Girl.",
  path: "/authors",
});

export default async function AuthorsPage() {
  const authors = await listAuthors();
  return (
    <section className="pt-32 md:pt-40 pb-24">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-14">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">
            The voices
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">
            Bylines
          </h1>
          <p className="text-lg md:text-xl text-muted mt-5">
            The doctor, the friends and the occasional guest writer publishing on About a Girl.
          </p>
        </div>
        {authors.length === 0 ? (
          <p className="text-muted">Authors will appear here once content has been seeded.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((a) => (
              <Link
                key={String(a.id)}
                href={`/authors/${a.slug ?? a.id}`}
                className="group flex items-center gap-5 p-5 rounded-3xl bg-white border border-stone-200/80 hover:shadow-lg hover:shadow-black/[0.04] transition-shadow"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                  <Image
                    src={pickMediaUrl(a.avatar as never, "thumbnail")}
                    alt={a.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-lg truncate group-hover:text-accent transition-colors">
                    {a.name}
                  </div>
                  {a.bio && (
                    <p className="text-sm text-muted line-clamp-2 mt-1">{a.bio}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
