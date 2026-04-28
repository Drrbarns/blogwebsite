import type { CollectionConfig } from "payload";
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { canEditPost, isAdminOrEditor, publishedOnly } from "./access/roles";
import {
  readingTimeField,
  seoField,
  slugField,
} from "./fields/seo";
import { ensureSlug } from "./hooks/slug";
import { computeReadingTime } from "./hooks/readingTime";
import { publishQualityGate } from "./hooks/publishGate";
import { pingIndexNow } from "./hooks/indexnow";
import { computeAndStoreSeoScore } from "./hooks/seoScore";
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "./hooks/revalidate";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Post",
    plural: "Posts",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "authors",
      "category",
      "_status",
      "publishedAt",
      "updatedAt",
    ],
    group: "Content",
    preview: (doc) => {
      const base =
        process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
      const slug = (doc as { slug?: string }).slug ?? "";
      const secret = process.env.PREVIEW_SECRET ?? "";
      return `${base}/api/preview?secret=${encodeURIComponent(
        secret,
      )}&slug=${encodeURIComponent(slug)}&collection=posts`;
    },
    livePreview: {
      url: ({ data }) => {
        const base =
          process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
        const slug = (data as { slug?: string })?.slug ?? "";
        return `${base}/blog/${slug}`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  access: {
    read: publishedOnly,
    create: ({ req }) => {
      const u = req.user as { roles?: string[] } | null | undefined;
      return Array.isArray(u?.roles)
        ? u!.roles!.some((r) =>
            ["admin", "editor", "author", "contributor"].includes(r),
          )
        : false;
    },
    update: canEditPost,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [
      ensureSlug("title"),
      computeReadingTime,
      computeAndStoreSeoScore,
      publishQualityGate,
    ],
    afterChange: [revalidateAfterChange("posts"), pingIndexNow],
    afterDelete: [revalidateAfterDelete("posts")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              maxLength: 140,
            },
            {
              name: "excerpt",
              type: "textarea",
              required: true,
              maxLength: 320,
              admin: {
                description:
                  "Shown on the homepage, blog index, RSS feed and social preview cards.",
              },
            },
            {
              name: "content",
              type: "richText",
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({
                    enabledHeadingSizes: ["h2", "h3", "h4"],
                  }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                  LinkFeature({
                    enabledCollections: ["posts", "pages"],
                  }),
                  UploadFeature({
                    collections: {
                      media: {
                        fields: [
                          { name: "caption", type: "text" },
                          { name: "credit", type: "text" },
                        ],
                      },
                    },
                  }),
                  BlocksFeature({
                    blocks: [
                      {
                        slug: "callout",
                        labels: { singular: "Callout", plural: "Callouts" },
                        fields: [
                          {
                            name: "variant",
                            type: "select",
                            defaultValue: "info",
                            options: [
                              { label: "Info", value: "info" },
                              { label: "Warning", value: "warning" },
                              { label: "Success", value: "success" },
                              { label: "Quote", value: "quote" },
                            ],
                          },
                          { name: "title", type: "text" },
                          {
                            name: "body",
                            type: "textarea",
                            required: true,
                          },
                        ],
                      },
                      {
                        slug: "codeBlock",
                        labels: { singular: "Code", plural: "Code blocks" },
                        fields: [
                          { name: "language", type: "text", defaultValue: "ts" },
                          { name: "code", type: "code", required: true },
                        ],
                      },
                      {
                        slug: "embed",
                        labels: { singular: "Embed", plural: "Embeds" },
                        fields: [
                          {
                            name: "provider",
                            type: "select",
                            required: true,
                            options: [
                              { label: "YouTube", value: "youtube" },
                              { label: "Vimeo", value: "vimeo" },
                              { label: "Twitter / X", value: "twitter" },
                              { label: "Generic iframe", value: "iframe" },
                            ],
                          },
                          { name: "url", type: "text", required: true },
                          { name: "caption", type: "text" },
                        ],
                      },
                    ],
                  }),
                ],
              }),
            },
          ],
        },
        {
          label: "Taxonomy",
          fields: [
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              required: true,
              admin: {
                description: "Primary category (used for URL + breadcrumb).",
              },
            },
            {
              name: "categories",
              type: "relationship",
              relationTo: "categories",
              hasMany: true,
              admin: {
                description:
                  "Additional categories surfaced as chips on the post and blog index.",
              },
            },
            {
              name: "tags",
              type: "relationship",
              relationTo: "tags",
              hasMany: true,
            },
            {
              name: "authors",
              type: "relationship",
              relationTo: "users",
              hasMany: true,
              required: true,
              defaultValue: ({ user }) => (user ? [user.id] : []),
            },
          ],
        },
      ],
    },
    // ── Sidebar fields ──────────────────────────────────────────────────────
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Surface this post in the hero carousel.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
    ...slugField(),
    readingTimeField,
    seoField(),
    {
      name: "seoPanel",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/admin/seo-panel#default",
        },
      },
    },
    {
      name: "internalLinksPanel",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/admin/internal-links-panel#default",
        },
      },
    },
    {
      name: "serpPreview",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/admin/serp-preview#default",
        },
      },
    },
    {
      name: "relatedPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
      admin: {
        position: "sidebar",
        description: "Hand-pick 2-3 related posts. Auto-suggested by the Internal Link panel.",
      },
    },
    {
      name: "overridePublishGate",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Skip SEO-score and alt-text checks for this publish (admins only).",
      },
      access: {
        update: ({ req }) => {
          const u = req.user as { roles?: string[] } | null | undefined;
          return Array.isArray(u?.roles)
            ? u!.roles!.some((r) => r === "admin" || r === "editor")
            : false;
        },
      },
    },
  ],
};
