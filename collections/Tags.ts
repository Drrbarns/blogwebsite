import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "./access/roles";
import { seoField, slugField } from "./fields/seo";
import { ensureSlug } from "./hooks/slug";
import { revalidateAfterChange, revalidateAfterDelete } from "./hooks/revalidate";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
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
    afterChange: [revalidateAfterChange("tags")],
    afterDelete: [revalidateAfterDelete("tags")],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea" },
    ...slugField(),
    seoField(),
  ],
};
