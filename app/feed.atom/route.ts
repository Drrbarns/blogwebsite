import { siteDefaults } from "@/lib/seo";
import { listPosts } from "@/lib/cms";

export const revalidate = 300;
export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const { docs } = await listPosts({ limit: 50, sort: "-publishedAt" });
  const base = siteDefaults.url;
  const updated = docs[0]
    ? new Date(docs[0].publishedAt).toISOString()
    : new Date().toISOString();

  const entries = docs
    .map((p) => {
      const url = `${base}/blog/${p.slug}`;
      const published = new Date(p.publishedAt).toISOString();
      return `
  <entry>
    <title>${escapeXml(p.title)}</title>
    <id>${url}</id>
    <link href="${url}" />
    <updated>${published}</updated>
    <published>${published}</published>
    <summary>${escapeXml(p.excerpt)}</summary>
    <author><name>${escapeXml(p.author.name)}</name></author>
    <category term="${escapeXml(p.category?.name ?? "General")}" />
  </entry>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteDefaults.name)}</title>
  <subtitle>${escapeXml(siteDefaults.description)}</subtitle>
  <link rel="self" href="${base}/feed.atom" />
  <link href="${base}" />
  <updated>${updated}</updated>
  <id>${base}/</id>
  ${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
