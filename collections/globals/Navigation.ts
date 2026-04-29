import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "../access/roles";
import { revalidateAfterChange } from "../hooks/revalidate";

/**
 * Single source of truth for header + footer + mobile navigation.
 * Editors can reorder links, create nested dropdowns, and push CTA buttons
 * without a deploy.
 */
export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: {
    group: "Site",
    description: "Menus rendered by the navbar, footer, and mobile drawer.",
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        try {
          const { revalidatePath } = await import("next/cache");
          revalidatePath("/", "layout");
        } catch (err) {
          req.payload.logger?.warn?.(
            { err },
            "navigation revalidate failed",
          );
        }
      },
    ],
  },
  fields: [
    {
      name: "brand",
      type: "group",
      fields: [
        { name: "label", type: "text", defaultValue: "About a Girl" },
        { name: "tagline", type: "text" },
      ],
    },
    {
      name: "primary",
      label: "Header links",
      type: "array",
      admin: {
        description: "Displayed in the sticky top navbar.",
      },
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "type",
          type: "select",
          required: true,
          defaultValue: "custom",
          options: [
            { label: "Custom URL", value: "custom" },
            { label: "Page", value: "page" },
            { label: "Post", value: "post" },
            { label: "Category", value: "category" },
          ],
        },
        {
          name: "url",
          type: "text",
          admin: {
            condition: (_, sibling) => sibling.type === "custom",
          },
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
          admin: { condition: (_, sibling) => sibling.type === "page" },
        },
        {
          name: "post",
          type: "relationship",
          relationTo: "posts",
          admin: { condition: (_, sibling) => sibling.type === "post" },
        },
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
          admin: { condition: (_, sibling) => sibling.type === "category" },
        },
        {
          name: "children",
          type: "array",
          admin: { description: "Optional dropdown items." },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      admin: { description: "Right-aligned button in the navbar." },
      fields: [
        { name: "label", type: "text", defaultValue: "Buy Now" },
        { name: "url", type: "text", defaultValue: "/contact" },
        { name: "enabled", type: "checkbox", defaultValue: true },
      ],
    },
    {
      name: "footer",
      type: "group",
      fields: [
        { name: "tagline", type: "textarea" },
        {
          name: "columns",
          type: "array",
          maxRows: 4,
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "links",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "url", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "social",
      type: "group",
      fields: [
        { name: "twitter", type: "text" },
        { name: "instagram", type: "text" },
        { name: "linkedin", type: "text" },
        { name: "youtube", type: "text" },
        { name: "facebook", type: "text" },
      ],
    },
  ],
};
