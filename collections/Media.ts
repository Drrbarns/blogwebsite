import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "./access/roles";
import { autoAltText } from "./hooks/autoAlt";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    group: "Content",
    description:
      "Uploaded assets. Images are served from Supabase Storage; Payload stores the metadata.",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [autoAltText],
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "video/*", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 800, height: 600, position: "centre" },
      { name: "wide", width: 1200, height: 630, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe the image for screen readers and SEO. Auto-filled by the AI alt-text generator in Phase 2.",
      },
    },
    {
      name: "caption",
      type: "text",
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Photographer or source credit, if any." },
    },
  ],
};
