import type { Field, GroupField } from "payload";

/**
 * Reusable SEO field group. Attach with: ...seoField()
 *
 * In Phase 2 the custom SEO scoring panel, SERP preview and auto-internal-link
 * components will be plugged into these fields via `admin.components`.
 */
export const seoField = (): GroupField => ({
  name: "seo",
  label: "SEO",
  type: "group",
  admin: {
    position: "sidebar",
    description:
      "Search engine optimization metadata. Overrides defaults when present.",
  },
  fields: [
    {
      name: "title",
      label: "Meta title",
      type: "text",
      maxLength: 70,
      admin: {
        description: "Recommended: 50-60 characters.",
      },
    },
    {
      name: "description",
      label: "Meta description",
      type: "textarea",
      maxLength: 200,
      admin: {
        description: "Recommended: 140-160 characters.",
      },
    },
    {
      name: "focusKeyword",
      label: "Focus keyword",
      type: "text",
      admin: {
        description:
          "Primary keyword this content should rank for. Used by the SEO scoring engine.",
      },
    },
    {
      name: "relatedKeywords",
      type: "text",
      hasMany: true,
      admin: {
        description: "Supporting keywords / synonyms (optional).",
      },
    },
    {
      name: "score",
      type: "number",
      admin: {
        readOnly: true,
        description: "Live SEO score (0-100) computed from the scoring engine.",
      },
    },
    {
      name: "ogImage",
      label: "Open Graph image",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Leave blank to auto-generate at build time from the post cover image.",
      },
    },
    {
      name: "canonicalURL",
      label: "Canonical URL",
      type: "text",
      admin: {
        description:
          "Override the default canonical when syndicating content from elsewhere.",
      },
    },
    {
      name: "noindex",
      label: "Hide from search engines (noindex)",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "nofollow",
      label: "Mark all outbound links as nofollow",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "structuredData",
      label: "Custom JSON-LD",
      type: "json",
      admin: {
        description:
          "Advanced: merge / override the auto-generated Article schema.",
      },
    },
  ],
});

/**
 * Slug + reading-time + slug-history fields reused across post-like collections.
 */
export const slugField = (): Field[] => [
  {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description:
        "URL path segment. Changing this automatically records the old slug in History for 301 redirects.",
    },
  },
  {
    name: "slugHistory",
    type: "array",
    admin: {
      readOnly: true,
      position: "sidebar",
      description: "Previous slugs (auto-redirected 301 → current).",
    },
    fields: [
      { name: "slug", type: "text" },
      { name: "changedAt", type: "date" },
    ],
  },
];

export const readingTimeField: Field = {
  name: "readingTime",
  type: "number",
  admin: {
    readOnly: true,
    position: "sidebar",
    description: "Calculated automatically from the content on save.",
  },
};
