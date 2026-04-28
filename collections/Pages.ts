import type { CollectionConfig } from "payload";
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { isAdminOrEditor, publishedOnly } from "./access/roles";
import { allPageBlocks } from "./blocks";
import { seoField, slugField } from "./fields/seo";
import { ensureSlug } from "./hooks/slug";
import {
  revalidateAfterChange,
  revalidateAfterDelete,
} from "./hooks/revalidate";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Page", plural: "Pages" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    group: "Content",
    livePreview: {
      url: ({ data }) => {
        const base =
          process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
        const slug = (data as { slug?: string })?.slug ?? "";
        return slug === "home" ? base : `${base}/${slug}`;
      },
    },
  },
  versions: {
    drafts: { autosave: { interval: 800 } },
    maxPerDoc: 25,
  },
  access: {
    read: publishedOnly,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [ensureSlug("title")],
    afterChange: [revalidateAfterChange("pages")],
    afterDelete: [revalidateAfterDelete("pages")],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "hero",
      type: "group",
      admin: { description: "Optional page hero — leave blank to use title only." },
      fields: [
        { name: "heading", type: "text" },
        { name: "subheading", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "content",
      type: "richText",
      admin: {
        description:
          "Simple long-form body. For more structured layouts use the Layout blocks below.",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          LinkFeature({ enabledCollections: ["posts", "pages"] }),
          UploadFeature({ collections: { media: { fields: [] } } }),
        ],
      }),
    },
    {
      name: "layout",
      label: "Layout blocks",
      type: "blocks",
      blocks: allPageBlocks,
      admin: {
        description:
          "Compose the page visually by stacking blocks. Each block renders with on-brand styling via the page renderer.",
      },
    },
    ...slugField(),
    seoField(),
  ],
};
