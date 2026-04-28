import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "../access/roles";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
  admin: {
    group: "Site",
    description: "Edit the public /contact page.",
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
          revalidatePath("/contact");
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
        { name: "breadcrumbLabel", type: "text", defaultValue: "Contact Us" },
        { name: "heading", type: "text", defaultValue: "Contact Us" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { description: "Wide hero image (1600×600 ideal)." },
        },
      ],
    },
    {
      name: "form",
      type: "group",
      fields: [
        { name: "heading", type: "text", defaultValue: "Drop Us a Line" },
        { name: "submitLabel", type: "text", defaultValue: "Submit request" },
        { name: "successMessage", type: "text", defaultValue: "Thanks — we’ll be in touch soon." },
      ],
    },
    {
      name: "latestPosts",
      type: "group",
      label: "Latest posts strip",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "heading", type: "text", defaultValue: "Fresh off the press" },
        {
          name: "limit",
          type: "number",
          defaultValue: 3,
          min: 1,
          max: 6,
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
