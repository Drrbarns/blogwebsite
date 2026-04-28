import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "./access/roles";
import { seoField, slugField } from "./fields/seo";
import { ensureSlug } from "./hooks/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "./hooks/revalidate";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "color", "updatedAt"],
    group: "Content",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [ensureSlug("name")],
    afterChange: [revalidateAfterChange("categories")],
    afterDelete: [revalidateAfterDelete("categories")],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "color",
      type: "text",
      admin: {
        description:
          "Hex or CSS colour used as the chip/card accent (e.g. #fce4ec).",
      },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    ...slugField(),
    seoField(),
  ],
};
