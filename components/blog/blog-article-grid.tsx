import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { RevealItem, RevealStagger } from "@/components/shared/section-reveal";
import type { BlogPost } from "@/types";

interface BlogArticleGridProps {
  posts: BlogPost[];
}

export function BlogArticleGrid({ posts }: BlogArticleGridProps) {
  if (!posts.length) return null;
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <RevealStagger
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-12 md:gap-x-8 md:gap-y-10 lg:gap-x-0"
        stagger={0.05}
      >
        {posts.map((post, index) => {
          const tags = post.categories || [post.category];
          return (
            <RevealItem
              key={post.id}
              className={cn(
                "group",
                index % 3 !== 0 &&
                  "lg:border-l lg:border-stone-200 lg:pl-10 xl:pl-14"
              )}
            >
              <article className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag.slug}
                        className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-foreground/60 rounded-md"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground leading-snug mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted mb-3">
                    {post.author.name} on {formatDate(post.publishedAt)}
                  </p>

                  <p className="text-sm text-muted/70 leading-relaxed line-clamp-4">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            </RevealItem>
          );
        })}
      </RevealStagger>
    </section>
  );
}
