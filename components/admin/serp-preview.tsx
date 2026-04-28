"use client";

import { useState } from "react";
import { useFormFields } from "@payloadcms/ui";

/**
 * Shows a live Google SERP and Twitter/X card preview for the post being
 * edited.  Mounted inside the SEO tab of the post edit view.
 */
export default function SerpPreview() {
  const [tab, setTab] = useState<"google" | "twitter">("google");
  const fields = useFormFields(([f]) => ({
    title: f?.title?.value as string | undefined,
    slug: f?.slug?.value as string | undefined,
    excerpt: f?.excerpt?.value as string | undefined,
    metaTitle: f?.["seo.title"]?.value as string | undefined,
    metaDescription: f?.["seo.description"]?.value as string | undefined,
  }));

  const siteOrigin =
    typeof window !== "undefined"
      ? window.location.origin.replace(/^https?:\/\//, "")
      : "example.com";
  const url = `${siteOrigin} › blog › ${fields.slug ?? "your-post"}`;
  const title = (fields.metaTitle || fields.title) ?? "Your post title";
  const description = (fields.metaDescription || fields.excerpt) ?? "Your meta description will appear here.";

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        <TabButton active={tab === "google"} onClick={() => setTab("google")}>
          Google
        </TabButton>
        <TabButton active={tab === "twitter"} onClick={() => setTab("twitter")}>
          Twitter / X
        </TabButton>
      </div>

      {tab === "google" ? (
        <div
          style={{
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: 8,
            padding: 16,
            background: "#ffffff",
            fontFamily: "Arial, sans-serif",
            color: "#202124",
          }}
        >
          <div style={{ fontSize: 12, color: "#5f6368" }}>{url}</div>
          <div
            style={{
              fontSize: 20,
              lineHeight: 1.3,
              color: "#1a0dab",
              marginTop: 4,
              fontWeight: 500,
            }}
          >
            {truncate(title, 60)}
          </div>
          <div style={{ fontSize: 13, color: "#4d5156", marginTop: 4, lineHeight: 1.5 }}>
            {truncate(description, 155)}
          </div>
        </div>
      ) : (
        <div
          style={{
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: 16,
            overflow: "hidden",
            background: "#000",
            color: "#fff",
            maxWidth: 360,
          }}
        >
          <div
            style={{
              aspectRatio: "1.91/1",
              background:
                "linear-gradient(135deg, #f97316, #7c3aed)",
              display: "flex",
              alignItems: "flex-end",
              padding: 14,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Preview card
          </div>
          <div style={{ padding: 14, background: "#111" }}>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{siteOrigin}</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
              {truncate(title, 70)}
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              {truncate(description, 125)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 999,
        border: "1px solid var(--theme-elevation-150)",
        background: active ? "var(--theme-elevation-200)" : "transparent",
        color: "inherit",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
