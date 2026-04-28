/**
 * Yoast-inspired SEO scoring engine.
 *
 * Runs both server-side (Payload hooks, publish gate) and client-side
 * (admin panel preview).  No external dependencies — every check is deterministic
 * and operates on plain post fields plus a flattened content string.
 */

export type SeoVerdict = "good" | "ok" | "warning" | "bad";

export interface SeoCheckResult {
  id: string;
  label: string;
  description: string;
  verdict: SeoVerdict;
  weight: number;
}

export interface SeoScoreResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  verdict: SeoVerdict;
  checks: SeoCheckResult[];
  readability: {
    score: number;
    verdict: SeoVerdict;
    sentenceCount: number;
    wordCount: number;
    averageSentenceLength: number;
    readingEase: number;
    label: string;
  };
}

export interface SeoInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  headings?: { level: number; text: string }[];
  internalLinks?: number;
  externalLinks?: number;
  images?: { alt?: string }[];
  coverAlt?: string;
  publishedAt?: string | Date;
}

const VERDICT_WEIGHT: Record<SeoVerdict, number> = {
  good: 1,
  ok: 0.7,
  warning: 0.4,
  bad: 0,
};

const lowered = (s?: string) => (s ?? "").toLowerCase();

const check = (
  id: string,
  label: string,
  description: string,
  verdict: SeoVerdict,
  weight = 1,
): SeoCheckResult => ({ id, label, description, verdict, weight });

/** Simplified Flesch Reading Ease approximation. */
const computeReadability = (content: string) => {
  const text = content.replace(/\s+/g, " ").trim();
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const sentenceCount = sentences.length || 1;
  const wordCount = words.length;
  const syllableCount = words.reduce(
    (sum, w) => sum + countSyllables(w.toLowerCase()),
    0,
  );
  const averageSentenceLength = wordCount / sentenceCount;
  const averageSyllablesPerWord = syllableCount / Math.max(wordCount, 1);
  const readingEase =
    206.835 - 1.015 * averageSentenceLength - 84.6 * averageSyllablesPerWord;

  let verdict: SeoVerdict;
  let label: string;
  if (readingEase >= 70) {
    verdict = "good";
    label = "Easy to read";
  } else if (readingEase >= 50) {
    verdict = "ok";
    label = "Fairly readable";
  } else if (readingEase >= 30) {
    verdict = "warning";
    label = "Difficult";
  } else {
    verdict = "bad";
    label = "Very difficult";
  }

  const score = Math.max(
    0,
    Math.min(100, Math.round(((readingEase - 20) / 80) * 100)),
  );

  return {
    score,
    verdict,
    sentenceCount,
    wordCount,
    averageSentenceLength: Number(averageSentenceLength.toFixed(1)),
    readingEase: Number(readingEase.toFixed(1)),
    label,
  };
};

const countSyllables = (word: string) => {
  const w = word.replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const matches = w
    .replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

export const computeSeoScore = (input: SeoInput): SeoScoreResult => {
  const focus = lowered(input.focusKeyword).trim();
  const title = input.title ?? "";
  const metaTitle = input.metaTitle ?? title;
  const metaDesc = input.metaDescription ?? input.excerpt ?? "";
  const content = input.content ?? "";
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const checks: SeoCheckResult[] = [];

  // Title length
  const titleLen = title.length;
  checks.push(
    check(
      "titleLength",
      "Title length",
      titleLen === 0
        ? "Title is empty."
        : titleLen < 30
          ? `Title is ${titleLen} chars — aim for 50-60.`
          : titleLen <= 65
            ? `Title is a healthy ${titleLen} characters.`
            : `Title is ${titleLen} chars — may truncate in SERPs.`,
      titleLen === 0
        ? "bad"
        : titleLen < 30 || titleLen > 70
          ? "warning"
          : "good",
    ),
  );

  // Meta description length
  const descLen = metaDesc.length;
  checks.push(
    check(
      "metaDescription",
      "Meta description",
      descLen === 0
        ? "Missing meta description."
        : descLen < 120
          ? `Only ${descLen} chars — aim for 140-160.`
          : descLen <= 170
            ? `Great at ${descLen} characters.`
            : `Too long (${descLen}) — may get truncated.`,
      descLen === 0
        ? "bad"
        : descLen < 120 || descLen > 180
          ? "warning"
          : "good",
    ),
  );

  // Slug
  checks.push(
    check(
      "slug",
      "Slug",
      !input.slug
        ? "No slug set."
        : /^[a-z0-9-]+$/.test(input.slug)
          ? "Slug is SEO-friendly."
          : "Slug should be lowercase kebab-case.",
      !input.slug
        ? "bad"
        : /^[a-z0-9-]+$/.test(input.slug)
          ? "good"
          : "warning",
    ),
  );

  // Word count
  checks.push(
    check(
      "wordCount",
      "Content length",
      wordCount < 300
        ? `Only ${wordCount} words — aim for 800+.`
        : wordCount < 800
          ? `${wordCount} words — decent.`
          : `${wordCount} words — great depth.`,
      wordCount < 300 ? "bad" : wordCount < 600 ? "warning" : "good",
      1.5,
    ),
  );

  // Focus keyword presence
  if (focus) {
    const contentLower = content.toLowerCase();
    const titleHas = lowered(title).includes(focus);
    const descHas = lowered(metaDesc).includes(focus);
    const slugHas = lowered(input.slug).includes(
      focus.replace(/\s+/g, "-"),
    );
    const bodyHas = contentLower.includes(focus);

    const firstP = content
      .split(/\n{2,}|\r\n\r\n/)
      .find((p) => p.trim().length > 0)
      ?.toLowerCase();
    const introHas = firstP ? firstP.includes(focus) : false;

    const hits = (contentLower.match(new RegExp(focus, "g")) ?? []).length;
    const density = wordCount ? (hits * focus.split(/\s+/).length) / wordCount : 0;

    checks.push(
      check(
        "keywordInTitle",
        "Focus keyword in title",
        titleHas
          ? "Focus keyword is in the title."
          : "Missing focus keyword from title.",
        titleHas ? "good" : "bad",
        1.4,
      ),
      check(
        "keywordInDescription",
        "Focus keyword in meta description",
        descHas ? "Nice — keyword in description." : "Missing from description.",
        descHas ? "good" : "warning",
      ),
      check(
        "keywordInSlug",
        "Focus keyword in slug",
        slugHas ? "Keyword is in the slug." : "Add the keyword to the slug.",
        slugHas ? "good" : "warning",
      ),
      check(
        "keywordInIntro",
        "Focus keyword in intro paragraph",
        introHas ? "Keyword appears in the intro." : "Add it to the first paragraph.",
        introHas ? "good" : "warning",
      ),
      check(
        "keywordInBody",
        "Focus keyword in body",
        bodyHas ? "Keyword is in the body." : "Keyword is missing from the body.",
        bodyHas ? "good" : "bad",
      ),
      check(
        "keywordDensity",
        "Keyword density",
        density === 0
          ? "Zero density — add the focus keyword."
          : density < 0.005
            ? `Density ${(density * 100).toFixed(2)}% — slightly low.`
            : density <= 0.025
              ? `Healthy density of ${(density * 100).toFixed(2)}%.`
              : `Over-optimised at ${(density * 100).toFixed(2)}%.`,
        density === 0
          ? "bad"
          : density < 0.005 || density > 0.03
            ? "warning"
            : "good",
      ),
    );
  } else {
    checks.push(
      check(
        "focusKeyword",
        "Focus keyword",
        "Set a focus keyword in the SEO tab to unlock deeper analysis.",
        "warning",
      ),
    );
  }

  // Headings
  const headings = input.headings ?? [];
  const h2Count = headings.filter((h) => h.level === 2).length;
  checks.push(
    check(
      "headings",
      "Subheading structure",
      headings.length === 0
        ? "No subheadings — add H2s to break up the article."
        : h2Count === 0
          ? "Missing H2 headings — use them to structure the post."
          : `${h2Count} H2 heading${h2Count === 1 ? "" : "s"} detected.`,
      headings.length === 0 ? "bad" : h2Count === 0 ? "warning" : "good",
    ),
  );

  // Images
  const imgs = input.images ?? [];
  const missingAlt = imgs.filter((i) => !i.alt?.trim()).length;
  checks.push(
    check(
      "images",
      "Images have alt text",
      imgs.length === 0
        ? "No inline images found."
        : missingAlt === 0
          ? "All images have alt text."
          : `${missingAlt} image${missingAlt === 1 ? "" : "s"} missing alt text.`,
      imgs.length === 0
        ? "warning"
        : missingAlt === 0
          ? "good"
          : missingAlt / imgs.length < 0.3
            ? "warning"
            : "bad",
    ),
  );

  // Internal/external links
  const internal = input.internalLinks ?? 0;
  const external = input.externalLinks ?? 0;
  checks.push(
    check(
      "internalLinks",
      "Internal links",
      internal === 0
        ? "No internal links — link to other posts to improve crawl."
        : `${internal} internal link${internal === 1 ? "" : "s"}.`,
      internal === 0 ? "warning" : "good",
    ),
    check(
      "externalLinks",
      "Outbound links",
      external === 0
        ? "No outbound citations — consider citing a source."
        : `${external} outbound link${external === 1 ? "" : "s"}.`,
      external === 0 ? "warning" : "good",
    ),
  );

  // Excerpt
  checks.push(
    check(
      "excerpt",
      "Excerpt",
      !input.excerpt
        ? "Missing excerpt — used on social cards."
        : input.excerpt.length < 80
          ? `Excerpt is only ${input.excerpt.length} chars.`
          : "Excerpt looks good.",
      !input.excerpt
        ? "bad"
        : input.excerpt.length < 80
          ? "warning"
          : "good",
    ),
  );

  // Readability
  const readability = computeReadability(content);
  checks.push(
    check(
      "readability",
      "Readability",
      `${readability.label} (ease ${readability.readingEase}).`,
      readability.verdict,
    ),
  );

  // Score aggregation
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const weighted = checks.reduce(
    (s, c) => s + VERDICT_WEIGHT[c.verdict] * c.weight,
    0,
  );
  const score = Math.round((weighted / totalWeight) * 100);
  const grade: SeoScoreResult["grade"] =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";
  const verdict: SeoVerdict =
    score >= 80 ? "good" : score >= 60 ? "ok" : score >= 40 ? "warning" : "bad";

  return { score, grade, verdict, checks, readability };
};

/**
 * Naive Lexical → plain text + heading extraction.
 * Accepts the Payload serialized Lexical shape `{ root: { children: [...] } }`.
 */
export const flattenLexical = (
  doc: unknown,
): {
  text: string;
  headings: { level: number; text: string }[];
  images: { alt?: string }[];
  internalLinks: number;
  externalLinks: number;
} => {
  const out = {
    text: "",
    headings: [] as { level: number; text: string }[],
    images: [] as { alt?: string }[],
    internalLinks: 0,
    externalLinks: 0,
  };

  const root = (doc as { root?: { children?: unknown[] } })?.root;
  if (!root?.children) return out;

  const walk = (nodes: unknown[]) => {
    for (const n of nodes) {
      const node = n as {
        type?: string;
        text?: string;
        tag?: string;
        children?: unknown[];
        url?: string;
        fields?: { url?: string; linkType?: string; doc?: unknown; alt?: string };
        value?: { alt?: string; url?: string };
        relationTo?: string;
      };

      const type = node.type;
      if (typeof node.text === "string") out.text += `${node.text} `;

      if (type === "heading" && node.tag) {
        const level = Number(String(node.tag).replace(/[^0-9]/g, "")) || 2;
        const text = extractText(node.children ?? []);
        out.headings.push({ level, text });
      }

      if (type === "link" || type === "autolink") {
        const url = node.fields?.url ?? node.url ?? "";
        const linkType = node.fields?.linkType ?? "custom";
        if (linkType === "internal" || url.startsWith("/")) {
          out.internalLinks += 1;
        } else if (/^https?:\/\//i.test(url)) {
          out.externalLinks += 1;
        }
      }

      if (type === "upload") {
        const alt =
          (node.fields as { alt?: string } | undefined)?.alt ??
          (node.value as { alt?: string } | undefined)?.alt;
        out.images.push({ alt });
      }

      if (Array.isArray(node.children)) walk(node.children);
    }
  };

  const extractText = (nodes: unknown[]): string => {
    let t = "";
    for (const n of nodes) {
      const node = n as { text?: string; children?: unknown[] };
      if (typeof node.text === "string") t += node.text;
      if (Array.isArray(node.children)) t += extractText(node.children);
    }
    return t.trim();
  };

  walk(root.children);
  out.text = out.text.replace(/\s+/g, " ").trim();
  return out;
};
