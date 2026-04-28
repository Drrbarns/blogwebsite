import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "./access/roles";

/**
 * Tracks external links we've detected on the site and their HTTP status.
 * Populated by the broken-link-checker cron.  Editors can filter for
 * `status: broken` in the admin list view to fix issues quickly.
 */
export const LinkHealth: CollectionConfig = {
  slug: "link-health",
  labels: { singular: "Link health", plural: "Link health" },
  admin: {
    useAsTitle: "url",
    defaultColumns: ["url", "status", "statusCode", "sourcePost", "checkedAt"],
    group: "Admin",
    description: "External link health, checked on a schedule.",
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: "url", type: "text", required: true, index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "ok",
      options: [
        { label: "OK", value: "ok" },
        { label: "Redirect", value: "redirect" },
        { label: "Broken", value: "broken" },
        { label: "Timeout", value: "timeout" },
      ],
      index: true,
    },
    { name: "statusCode", type: "number" },
    { name: "responseMs", type: "number" },
    { name: "checkedAt", type: "date" },
    {
      name: "sourcePost",
      type: "relationship",
      relationTo: "posts",
    },
    {
      name: "error",
      type: "text",
      admin: { readOnly: true },
    },
  ],
};
