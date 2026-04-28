import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "../access/roles";

/**
 * Editor-managed content for the public /about page.
 * Each section maps 1:1 to a component on the page so editors get a
 * predictable, WYSIWYG-style editing experience.
 */
export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  admin: {
    group: "Site",
    description: "Edit the public /about page — every section here is rendered on the page.",
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
          revalidatePath("/about");
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
      label: "Hero",
      fields: [
        { name: "breadcrumbLabel", type: "text", defaultValue: "About Us" },
        {
          name: "headingHighlight",
          type: "text",
          defaultValue: "The Story",
          admin: { description: "First part of the heading, rendered in accent colour." },
        },
        {
          name: "headingRest",
          type: "text",
          defaultValue: "Behind the Stories",
          admin: { description: "Rest of the heading, rendered in foreground colour." },
        },
      ],
    },
    {
      name: "stats",
      type: "group",
      label: "Stats grid",
      fields: [
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          admin: { description: "Tall portrait shown next to the stats." },
        },
        {
          name: "items",
          type: "array",
          label: "Stat cards",
          minRows: 0,
          maxRows: 4,
          fields: [
            { name: "value", type: "text", required: true, admin: { description: "e.g. 50+" } },
            { name: "label", type: "text", required: true },
            {
              name: "variant",
              type: "select",
              required: true,
              defaultValue: "solid",
              options: [
                { label: "Solid colour card", value: "solid" },
                { label: "Image background card", value: "image" },
              ],
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              admin: { condition: (_, sibling) => sibling.variant === "image" },
            },
          ],
        },
      ],
    },
    {
      name: "story",
      type: "group",
      fields: [
        {
          name: "paragraphs",
          type: "array",
          minRows: 1,
          fields: [
            { name: "text", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "services",
      type: "group",
      label: "Services grid",
      fields: [
        {
          name: "items",
          type: "array",
          minRows: 1,
          maxRows: 12,
          fields: [
            {
              name: "variant",
              type: "select",
              required: true,
              defaultValue: "accent",
              options: [
                { label: "Accent (red)", value: "accent" },
                { label: "Dark", value: "dark" },
                { label: "Light", value: "light" },
                { label: "Image only", value: "image" },
              ],
            },
            { name: "title", type: "text", admin: { description: "Hidden when variant is Image-only." } },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              admin: { condition: (_, sibling) => sibling.variant === "image" },
            },
            {
              name: "items",
              type: "array",
              admin: {
                description: "Bullet list (only used for non-image variants).",
                condition: (_, sibling) => sibling.variant !== "image",
              },
              fields: [
                { name: "label", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "brands",
      type: "group",
      fields: [
        { name: "heading", type: "text", defaultValue: "Trusted by ambitious teams" },
        {
          name: "items",
          type: "array",
          minRows: 0,
          fields: [
            { name: "name", type: "text", required: true },
            { name: "logo", type: "upload", relationTo: "media" },
            { name: "url", type: "text" },
          ],
        },
      ],
    },
    {
      name: "testimonials",
      type: "group",
      fields: [
        { name: "heading", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "quote", type: "textarea", required: true },
            { name: "authorName", type: "text", required: true },
            { name: "authorRole", type: "text" },
            { name: "authorAvatar", type: "upload", relationTo: "media" },
            { name: "image", type: "upload", relationTo: "media" },
          ],
        },
      ],
    },
    {
      name: "team",
      type: "group",
      fields: [
        { name: "heading", type: "text", defaultValue: "Meet the Team" },
        { name: "subheading", type: "text" },
        {
          name: "members",
          type: "array",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "role", type: "text", required: true },
            { name: "photo", type: "upload", relationTo: "media" },
            { name: "bio", type: "textarea" },
            {
              name: "socials",
              type: "group",
              fields: [
                { name: "twitter", type: "text" },
                { name: "linkedin", type: "text" },
                { name: "instagram", type: "text" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "getInTouch",
      type: "group",
      label: "Get in touch banner",
      fields: [
        { name: "heading", type: "text", defaultValue: "Get In Touch" },
        { name: "label", type: "text", defaultValue: "Available for Work" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { description: "Wide background image for the banner." },
        },
        {
          name: "cta",
          type: "group",
          fields: [
            { name: "label", type: "text", defaultValue: "Get in Touch" },
            { name: "url", type: "text", defaultValue: "/contact" },
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
