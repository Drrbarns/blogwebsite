import type { CollectionBeforeChangeHook } from "payload";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Generates a slug from `title` (or `name`) when absent. When the slug changes
 * between versions, pushes the previous slug into `slugHistory` so we can
 * issue 301 redirects.
 */
export const ensureSlug =
  (sourceField: string = "title"): CollectionBeforeChangeHook =>
  async ({ data, originalDoc, operation }) => {
    const source = (data?.[sourceField] as string | undefined) ?? "";
    const current = (data?.slug as string | undefined)?.trim();

    if (!current && source) {
      data.slug = slugify(source);
    } else if (current) {
      data.slug = slugify(current);
    }

    if (
      operation === "update" &&
      originalDoc?.slug &&
      data.slug &&
      originalDoc.slug !== data.slug
    ) {
      const history = Array.isArray(originalDoc.slugHistory)
        ? originalDoc.slugHistory
        : [];
      data.slugHistory = [
        ...history,
        {
          slug: originalDoc.slug,
          changedAt: new Date().toISOString(),
        },
      ];
    }

    return data;
  };
