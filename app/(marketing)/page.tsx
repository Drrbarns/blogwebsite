import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrendingStrip } from "@/components/home/trending-strip";
import { BlogCategories } from "@/components/home/blog-categories";
import { FreshOffPress } from "@/components/home/fresh-off-press";
import { ArticlesWithSidebar } from "@/components/home/articles-with-sidebar";
import { Pagination } from "@/components/shared/pagination";
import { Newsletter } from "@/components/home/newsletter";
import { getHomepageData } from "@/lib/cms";
import { getWebsiteJsonLd, getOrganizationJsonLd, getBlogJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default async function HomePage() {
  const {
    heroFeaturedPosts,
    trendingItems,
    categories,
    freshPosts,
    recentArticles,
    featuredSidebarPosts,
    relatedArticles,
    popularTags,
  } = await getHomepageData();

  const websiteJsonLd = getWebsiteJsonLd();
  const orgJsonLd = getOrganizationJsonLd();
  const blogJsonLd = getBlogJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <HeroCarousel posts={heroFeaturedPosts} />
      <TrendingStrip items={trendingItems} />
      <BlogCategories categories={categories} />
      <FreshOffPress posts={freshPosts} />

      <ArticlesWithSidebar
        articles={recentArticles}
        featuredPosts={featuredSidebarPosts}
        relatedArticles={relatedArticles}
        popularTags={popularTags}
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8">
        <Pagination currentPage={1} totalPages={3} />
      </div>

      <Newsletter />
    </>
  );
}
