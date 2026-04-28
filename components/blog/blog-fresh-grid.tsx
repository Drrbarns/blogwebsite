import Link from "next/link";
import { Clock } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { RevealItem, RevealStagger } from "@/components/shared/section-reveal";
import { formatDate, formatReadingTime } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogFreshGridProps {
  posts: BlogPost[];
}

export function BlogFreshGrid({ posts }: BlogFreshGridProps) {
  const rows: BlogPost[][] = [];
  for (let i = 0; i < posts.length; i += 2) {
    rows.push(posts.slice(i, i + 2));
  }

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="space-y-12 lg:space-y-16">
        {rows.map((row, rowIdx) => (
          <RevealStagger
            key={rowIdx}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
            stagger={0.07}
          >
            {row.map((post) => (
              <RevealItem key={post.id}>
              <article className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-stone-100">
                    <SafeImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-foreground rounded-full shadow-sm">
                        Recent
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full">
                      <Clock className="w-3 h-3" />
                      {formatReadingTime(post.readingTime)}
                    </div>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-snug mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted mb-3">
                    {post.author.name} on {formatDate(post.publishedAt)}
                  </p>

                  <p className="text-sm text-muted/70 leading-relaxed line-clamp-3 max-w-lg">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
              </RevealItem>
            ))}
          </RevealStagger>
        ))}
      </div>
    </section>
  );
}
