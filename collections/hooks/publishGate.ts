import type { CollectionBeforeChangeHook } from "payload";
import { APIError } from "payload";
import { computeSeoScore, flattenLexical } from "../../lib/seo/score";

type GateSettings = {
  enabled?: boolean;
  minScore?: number;
  requireAltText?: boolean;
};

/**
 * Blocks publishing a post when it fails the configured SEO gate.
 * Admins can override the gate by setting `overridePublishGate: true` on the
 * draft doc (hidden admin-only field) — useful for emergency publishes.
 */
export const publishQualityGate: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  const becomingPublished =
    data._status === "published" &&
    ((originalDoc as { _status?: string } | undefined)?._status !== "published" ||
      operation === "create");

  if (!becomingPublished) return data;

  if (data.overridePublishGate) return data;

  type Settings = { seo?: { publishGate?: GateSettings } } | null;
  let settings: Settings = null;
  try {
    const raw = await req.payload.findGlobal({
      slug: "site-settings",
      depth: 0,
    });
    settings = raw as unknown as Settings;
  } catch {
    return data;
  }

  const gate = (settings?.seo?.publishGate ?? {}) as GateSettings;
  if (!gate.enabled) return data;

  const min = gate.minScore ?? 60;
  const lex = flattenLexical(data.content);
  const result = computeSeoScore({
    title: data.title ?? "",
    slug: data.slug ?? "",
    excerpt: data.excerpt ?? "",
    content: lex.text,
    focusKeyword: data.seo?.focusKeyword,
    metaTitle: data.seo?.title,
    metaDescription: data.seo?.description,
    headings: lex.headings,
    images: lex.images,
    internalLinks: lex.internalLinks,
    externalLinks: lex.externalLinks,
  });

  if (result.score < min) {
    throw new APIError(
      `SEO score ${result.score} is below the required minimum of ${min}. Open the SEO panel and address the red checks, or toggle "Override publish gate" in the sidebar.`,
      400,
    );
  }

  if (gate.requireAltText && lex.images.some((i) => !i.alt?.trim())) {
    throw new APIError(
      "One or more images in this post are missing alt text. Add alt text or toggle Override publish gate.",
      400,
    );
  }

  return data;
};
