import { RecentArticles } from "./recent-articles";
import { Sidebar } from "./sidebar";
import type { BlogPost, Tag } from "@/types";

interface ArticlesWithSidebarProps {
  articles: BlogPost[];
  featuredPosts: BlogPost[];
  relatedArticles: BlogPost[];
  popularTags: Tag[];
}

export function ArticlesWithSidebar({
  articles,
  featuredPosts,
  relatedArticles,
  popularTags,
}: ArticlesWithSidebarProps) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        <RecentArticles articles={articles} />
        <Sidebar
          featuredPosts={featuredPosts}
          relatedArticles={relatedArticles}
          popularTags={popularTags}
        />
      </div>
    </section>
  );
}
