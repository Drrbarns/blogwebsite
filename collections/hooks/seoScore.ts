import type { CollectionBeforeChangeHook } from "payload";
import { computeSeoScore, flattenLexical } from "../../lib/seo/score";

/**
 * Stores the latest SEO score on the document so editors see it at a glance
 * from the list view and so we can query for low-scoring posts.
 */
export const computeAndStoreSeoScore: CollectionBeforeChangeHook = ({ data }) => {
  try {
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
    if (!data.seo) data.seo = {};
    data.seo.score = result.score;
  } catch {
    // non-fatal
  }
  return data;
};
