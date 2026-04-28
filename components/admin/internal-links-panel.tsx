"use client";

import { useEffect, useState } from "react";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

interface Suggestion {
  term: string;
  postId: string | number;
  postTitle: string;
  postSlug: string;
  score: number;
}

/**
 * Suggests internal-link targets based on mentions of other published posts
 * inside the draft content.  Calls `/api/ai/internal-links` (no LLM needed —
 * deterministic title matching).
 */
export default function InternalLinksPanel() {
  const { id } = useDocumentInfo();
  const fields = useFormFields(([f]) => ({
    content: f?.content?.value as unknown,
    focusKeyword: f?.["seo.focusKeyword"]?.value as string | undefined,
  }));

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/internal-links", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content: fields.content,
          excludePostId: id,
          focusKeyword: fields.focusKeyword,
        }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
    } catch (err) {
      setError(String((err as Error).message ?? err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (fields.content) run();
    }, 600);
    return () => clearTimeout(t);
     
  }, [fields.content]);

  return (
    <div
      style={{
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: 10,
        padding: 16,
        marginTop: 16,
        background: "var(--theme-elevation-0)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Internal link suggestions</div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            background: "var(--theme-elevation-200)",
            border: "none",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          {loading ? "Analysing…" : "Rescan"}
        </button>
      </div>
      {error && <div style={{ color: "#b91c1c", fontSize: 12, marginBottom: 8 }}>{error}</div>}
      {suggestions.length === 0 ? (
        <div style={{ color: "var(--theme-text-dim)", fontSize: 13 }}>
          No suggestions yet. Mention another post's title or focus keyword in your draft.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {suggestions.map((s) => (
            <li
              key={String(s.postId)}
              style={{
                padding: "8px 10px",
                border: "1px solid var(--theme-elevation-100)",
                borderRadius: 8,
                fontSize: 13,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <div style={{ fontWeight: 600 }}>{s.postTitle}</div>
              <div style={{ color: "var(--theme-text-dim)", fontSize: 12 }}>
                Matches <strong>"{s.term}"</strong> → /blog/{s.postSlug}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
