import Link from "next/link";
import { Clock } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { RevealItem, RevealStagger, SectionReveal } from "@/components/shared/section-reveal";
import { formatDate, formatReadingTime } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface RecentArticlesProps {
  articles: BlogPost[];
  heading?: string;
}

export function RecentArticles({ articles, heading = "Recent Articles" }: RecentArticlesProps) {
  if (!articles.length) return null;
  return (
    <div className="flex-1 min-w-0">
      <SectionReveal>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-8 lg:mb-10">
          {heading}
        </h2>
      </SectionReveal>

      <RevealStagger className="flex flex-col gap-8 lg:gap-10" stagger={0.06}>
        {articles.map((article) => (
          <RevealItem key={article.id}>
            <article className="group">
              <Link
                href={`/blog/${article.slug}`}
                className="flex gap-5 md:gap-6"
              >
                <div className="relative flex-shrink-0 w-[180px] md:w-[220px] aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                  <SafeImage
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    sizes="220px"
                  />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full">
                    <Clock className="w-2.5 h-2.5" />
                    {formatReadingTime(article.readingTime)}
                  </div>
                </div>

                <div className="flex flex-col justify-center min-w-0 py-1">
                  <h3 className="font-display text-base md:text-lg lg:text-xl font-bold text-foreground leading-snug group-hover:text-accent transition-colors mb-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted mb-2">
                    {article.author.name} on {formatDate(article.publishedAt)}
                  </p>

                  <p className="hidden md:line-clamp-2 text-sm text-muted/80 leading-relaxed mb-3">
                    {article.excerpt}
                  </p>

                  <div>
                    <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-foreground/60 rounded-full">
                      {article.category.name}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          </RevealItem>
        ))}
      </RevealStagger>
    </div>
  );
}
