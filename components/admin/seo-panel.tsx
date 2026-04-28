"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormFields } from "@payloadcms/ui";
import { computeSeoScore, flattenLexical, type SeoCheckResult, type SeoVerdict } from "@/lib/seo/score";

const VERDICT_STYLE: Record<SeoVerdict, { bg: string; fg: string; label: string }> = {
  good: { bg: "#d1fae5", fg: "#065f46", label: "Good" },
  ok: { bg: "#dbeafe", fg: "#1e40af", label: "OK" },
  warning: { bg: "#fef3c7", fg: "#92400e", label: "Improve" },
  bad: { bg: "#fee2e2", fg: "#991b1b", label: "Fix" },
};

/**
 * Admin sidebar panel — displays a live SEO score plus the individual checks
 * that drive it.  Reads form state via `useFormFields` so the numbers update
 * without a save.
 */
export default function SeoPanel() {
  const [, setDummy] = useState(0);

  const fields = useFormFields(([f]) => ({
    title: f?.title?.value as string | undefined,
    excerpt: f?.excerpt?.value as string | undefined,
    slug: f?.slug?.value as string | undefined,
    content: f?.content?.value as unknown,
    focusKeyword: f?.["seo.focusKeyword"]?.value as string | undefined,
    metaTitle: f?.["seo.title"]?.value as string | undefined,
    metaDescription: f?.["seo.description"]?.value as string | undefined,
  }));

  const result = useMemo(() => {
    const lex = flattenLexical(fields.content);
    return computeSeoScore({
      title: fields.title ?? "",
      slug: fields.slug ?? "",
      excerpt: fields.excerpt ?? "",
      content: lex.text,
      focusKeyword: fields.focusKeyword,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
      headings: lex.headings,
      images: lex.images,
      internalLinks: lex.internalLinks,
      externalLinks: lex.externalLinks,
    });
  }, [fields]);

  useEffect(() => {
    const t = setInterval(() => setDummy((n) => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: 10,
        padding: 16,
        background: "var(--theme-elevation-0)",
        marginTop: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <ScoreGauge value={result.score} verdict={result.verdict} grade={result.grade} />
        <div>
          <div style={{ fontSize: 12, color: "var(--theme-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
            SEO Score
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {result.score}/100 · {result.grade}
          </div>
          <div style={{ fontSize: 12, color: "var(--theme-text-dim)", marginTop: 2 }}>
            {result.readability.label} · {result.readability.wordCount} words
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {result.checks.map((c) => (
          <CheckRow key={c.id} check={c} />
        ))}
      </div>
    </div>
  );
}

function CheckRow({ check }: { check: SeoCheckResult }) {
  const style = VERDICT_STYLE[check.verdict];
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        fontSize: 13,
        padding: "6px 8px",
        borderRadius: 6,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          borderRadius: 4,
          padding: "2px 6px",
          background: style.bg,
          color: style.fg,
          whiteSpace: "nowrap",
          flexShrink: 0,
          marginTop: 1,
          textTransform: "uppercase",
          letterSpacing: 0.3,
        }}
      >
        {style.label}
      </span>
      <div>
        <div style={{ fontWeight: 600 }}>{check.label}</div>
        <div style={{ color: "var(--theme-text-dim)", fontSize: 12 }}>
          {check.description}
        </div>
      </div>
    </div>
  );
}

function ScoreGauge({ value, verdict, grade }: { value: number; verdict: SeoVerdict; grade: string }) {
  const style = VERDICT_STYLE[verdict];
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (Math.max(0, Math.min(100, value)) / 100);
  return (
    <div style={{ position: "relative", width: 64, height: 64 }}>
      <svg width={64} height={64} viewBox="0 0 64 64">
        <circle cx={32} cy={32} r={radius} stroke="var(--theme-elevation-100)" strokeWidth={6} fill="none" />
        <circle
          cx={32}
          cy={32}
          r={radius}
          stroke={style.fg}
          strokeWidth={6}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dasharray 300ms ease-out" }}
        />
        <text
          x={32}
          y={37}
          textAnchor="middle"
          fontWeight={700}
          fontSize={16}
          fill="currentColor"
        >
          {grade}
        </text>
      </svg>
    </div>
  );
}
