import { siteDefaults } from "@/lib/seo";
import { listPosts } from "@/lib/cms";

export const revalidate = 300;
export const dynamic = "force-static";

export async function GET() {
  const { docs } = await listPosts({ limit: 50, sort: "-publishedAt" });
  const base = siteDefaults.url;

  const body = {
    version: "https://jsonfeed.org/version/1.1",
    title: siteDefaults.name,
    home_page_url: base,
    feed_url: `${base}/feed.json`,
    description: siteDefaults.description,
    language: "en",
    items: docs.map((p) => ({
      id: `${base}/blog/${p.slug}`,
      url: `${base}/blog/${p.slug}`,
      title: p.title,
      summary: p.excerpt,
      image: p.coverImage,
      date_published: new Date(p.publishedAt).toISOString(),
      authors: [{ name: p.author.name }],
      tags: [p.category?.name, ...(p.categories?.map((c) => c.name) ?? [])].filter(
        Boolean,
      ),
    })),
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
