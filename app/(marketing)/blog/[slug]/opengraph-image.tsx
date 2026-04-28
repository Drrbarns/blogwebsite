import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/cms";
import { siteDefaults } from "@/lib/seo";

export const runtime = "nodejs";

export const alt = "Article preview image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a1a",
            color: "#fff",
            fontSize: 64,
            fontWeight: 800,
          }}
        >
          {siteDefaults.name}
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 72px 60px",
          background:
            "linear-gradient(135deg, #faf9f7 0%, #f1efec 35%, #e7e5e4 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 9999,
              background: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            O
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
            }}
          >
            {siteDefaults.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "8px 16px",
              borderRadius: 9999,
              background: "#ffffff",
              border: "1px solid #e7e5e4",
              fontSize: 18,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 28,
            }}
          >
            {post.category?.name ?? "Article"}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#1a1a1a",
              maxWidth: 980,
            }}
          >
            {post.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#78716c",
            fontWeight: 500,
          }}
        >
          <div>{post.author.name}</div>
          <div>{post.readingTime} min read</div>
        </div>
      </div>
    ),
    size,
  );
}
