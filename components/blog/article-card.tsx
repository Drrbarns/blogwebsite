import Link from "next/link";
import { Clock } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { formatDate, formatReadingTime } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface ArticleCardProps {
  post: BlogPost;
  size?: "default" | "large";
  /** Hide the "Recent" pill — useful inside curated lists. */
  hideBadge?: boolean;
}

export function ArticleCard({ post, size = "default", hideBadge = false }: ArticleCardProps) {
  const isLarge = size === "large";

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className={`relative overflow-hidden rounded-2xl ${
            isLarge ? "aspect-[4/3]" : "aspect-[4/3]"
          } mb-4 bg-stone-100`}
        >
          <SafeImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes={
              isLarge
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
          />

          {!hideBadge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-foreground rounded-full shadow-sm">
                {post.category?.name ?? "Recent"}
              </span>
            </div>
          )}

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full">
            <Clock className="w-3 h-3" />
            {formatReadingTime(post.readingTime)}
          </div>
        </div>

        <h3
          className={`font-display font-bold text-foreground leading-snug group-hover:text-accent transition-colors ${
            isLarge
              ? "text-lg md:text-xl lg:text-[22px]"
              : "text-base md:text-lg"
          }`}
        >
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-muted">
          {post.author.name} on {formatDate(post.publishedAt)}
        </p>
      </Link>
    </article>
  );
}
