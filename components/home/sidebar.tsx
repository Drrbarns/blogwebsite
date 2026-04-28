"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { SafeImage } from "@/components/shared/safe-image";
import type { BlogPost, Tag } from "@/types";

interface SidebarProps {
  featuredPosts: BlogPost[];
  relatedArticles: BlogPost[];
  popularTags: Tag[];
}

export function Sidebar({
  featuredPosts,
  relatedArticles,
  popularTags,
}: SidebarProps) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const featured = featuredPosts[featuredIdx];

  return (
    <aside className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 space-y-8">
      {/* Featured Posts */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">
          Featured Posts
        </h3>

        {featured && (
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group bg-stone-100">
            <Link href={`/blog/${featured.slug}`} className="absolute inset-0">
              <SafeImage
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                sizes="380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h4 className="font-display text-base font-bold text-white leading-snug mb-1.5">
                  {featured.title}
                </h4>
                <p className="text-xs text-white/70 font-medium">
                  {featured.author.name} on{" "}
                  {formatDate(featured.publishedAt)}
                </p>
              </div>
            </Link>
          </div>
        )}

        {featuredPosts.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {featuredPosts.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFeaturedIdx(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  idx === featuredIdx
                    ? "bg-foreground w-5"
                    : "bg-stone-300 hover:bg-stone-400"
                )}
                aria-label={`View featured post ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Related Articles */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">
          Related Articles
        </h3>

        <div className="space-y-4">
          {relatedArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="flex items-center gap-3.5 group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                <SafeImage
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  {formatDate(article.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">
          Popular Tags
        </h3>

        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/blog?tag=${tag.slug}`}
              className="inline-flex items-center px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-foreground/60 rounded-lg hover:bg-stone-200 hover:text-foreground/80 transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
