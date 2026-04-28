import { generatePageMetadata, getBlogJsonLd } from "@/lib/seo";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogArticleGrid } from "@/components/blog/blog-article-grid";
import { BlogTrendingStrip } from "@/components/blog/blog-trending-strip";
import { BlogFreshGrid } from "@/components/blog/blog-fresh-grid";
import { GetInTouch } from "@/components/blog/get-in-touch";
import { Newsletter } from "@/components/home/newsletter";
import { Pagination } from "@/components/shared/pagination";
import { getBlogPageData } from "@/lib/cms";

export const revalidate = 60;

export const metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Explore our latest articles on AI, technology, business, and trends.",
  path: "/blog",
});

type BlogSearchParams = Promise<{ page?: string }>;

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: BlogSearchParams;
}) {
  const sp = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(sp.page ?? 1));

  const { hero, gridPosts, freshPosts, trendingItems, totalPages, currentPage } =
    await getBlogPageData({ page, limit: 6 });

  const blogJsonLd = getBlogJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {hero ? <BlogHero post={hero} /> : null}
      <BlogArticleGrid posts={gridPosts} />
      <BlogTrendingStrip items={trendingItems} />
      <BlogFreshGrid posts={freshPosts} />
      <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={Math.max(totalPages, 1)} />
      </div>
      <GetInTouch />
      <Newsletter />
    </>
  );
}
