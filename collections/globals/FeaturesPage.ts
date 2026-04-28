import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "../access/roles";

export const FeaturesPage: GlobalConfig = {
  slug: "features-page",
  label: "Features Page",
  admin: {
    group: "Site",
    description: "Edit the public /features page.",
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidatePath } = await import("next/cache");
          revalidatePath("/features");
        } catch {
          /* noop */
        }
      },
    ],
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "What's inside" },
        { name: "heading", type: "text", required: true },
        { name: "subheading", type: "textarea" },
        {
          name: "ctas",
          type: "array",
          maxRows: 2,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
            {
              name: "style",
              type: "select",
              defaultValue: "primary",
              options: [
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "pillars",
      type: "group",
      fields: [
        {
          name: "items",
          type: "array",
          minRows: 1,
          fields: [
            {
              name: "icon",
              type: "select",
              defaultValue: "Sparkles",
              options: [
                "Sparkles",
                "LayoutGrid",
                "Bot",
                "Workflow",
                "Gauge",
                "Shield",
                "Rocket",
                "BookOpen",
                "FileText",
                "MessageSquare",
                "Mail",
                "Search",
                "Globe",
                "LineChart",
                "BarChart3",
              ].map((v) => ({ label: v, value: v })),
            },
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "seoChecklist",
      type: "group",
      label: "SEO checklist banner",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "SEO, by default" },
        { name: "heading", type: "text", defaultValue: "We shipped the checklist so you don’t have to." },
        { name: "description", type: "textarea" },
        { name: "ctaLabel", type: "text", defaultValue: "Read the blog" },
        { name: "ctaUrl", type: "text", defaultValue: "/blog" },
        {
          name: "items",
          type: "array",
          minRows: 1,
          fields: [{ name: "label", type: "text", required: true }],
        },
      ],
    },
    {
      name: "tools",
      type: "group",
      label: "Tools grid",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Every tool, batteries included" },
        { name: "heading", type: "text", defaultValue: "Everything you’d normally bolt on, already here." },
        {
          name: "items",
          type: "array",
          fields: [
            {
              name: "icon",
              type: "select",
              defaultValue: "Sparkles",
              options: [
                "Sparkles",
                "LayoutGrid",
                "Bot",
                "Workflow",
                "Gauge",
                "Shield",
                "Rocket",
                "BookOpen",
                "FileText",
                "MessageSquare",
                "Mail",
                "Search",
                "Globe",
                "LineChart",
                "BarChart3",
              ].map((v) => ({ label: v, value: v })),
            },
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
