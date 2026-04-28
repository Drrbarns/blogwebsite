import { ArticleCard } from "@/components/blog/article-card";
import { RevealItem, RevealStagger, SectionReveal } from "@/components/shared/section-reveal";
import type { BlogPost } from "@/types";

interface FreshOffPressProps {
  posts: BlogPost[];
  heading?: string;
}

export function FreshOffPress({ posts, heading = "Fresh off the Press" }: FreshOffPressProps) {
  if (!posts.length) return null;
  const firstRow = posts.slice(0, 3);
  const secondRow = posts.slice(3, 6);

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <SectionReveal>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-8 lg:mb-10">
          {heading}
        </h2>
      </SectionReveal>

      <RevealStagger
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 mb-6 lg:mb-7"
        stagger={0.06}
      >
        {firstRow.map((post) => (
          <RevealItem key={post.id}>
            <ArticleCard post={post} size="large" />
          </RevealItem>
        ))}
      </RevealStagger>

      {secondRow.length > 0 && (
        <RevealStagger
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
          stagger={0.06}
          delay={0.05}
        >
          {secondRow.map((post) => (
            <RevealItem key={post.id}>
              <ArticleCard post={post} />
            </RevealItem>
          ))}
        </RevealStagger>
      )}
    </section>
  );
}
