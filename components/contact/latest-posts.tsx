import { ArticleCard } from "@/components/blog/article-card";
import { RevealStagger, RevealItem, SectionReveal } from "@/components/shared/section-reveal";
import type { BlogPost } from "@/types";

interface LatestPostsProps {
  posts: BlogPost[];
  heading?: string;
  limit?: number;
}

export function LatestPosts({ posts, heading = "Latest Posts", limit = 3 }: LatestPostsProps) {
  if (!posts.length) return null;
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="border-t border-stone-200 pt-12 lg:pt-16">
        <SectionReveal>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-10">
            {heading}
          </h2>
        </SectionReveal>

        <RevealStagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          stagger={0.06}
        >
          {posts.slice(0, limit).map((post) => (
            <RevealItem key={post.id}>
              <ArticleCard post={post} />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
