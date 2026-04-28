import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "./access/roles";

/**
 * 404 logging — gives editors visibility into missing URLs so they can
 * configure redirects.  Records are aggregated by path with a counter.
 */
export const NotFoundLogs: CollectionConfig = {
  slug: "not-found-logs",
  labels: { singular: "404 log", plural: "404 logs" },
  admin: {
    useAsTitle: "path",
    defaultColumns: ["path", "hits", "lastHitAt", "referer"],
    group: "Admin",
    description:
      "Paths visitors hit that returned 404. Convert top entries into redirects from the Redirects admin.",
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: "path", type: "text", required: true, unique: true, index: true },
    { name: "hits", type: "number", required: true, defaultValue: 1 },
    { name: "lastHitAt", type: "date" },
    { name: "firstHitAt", type: "date" },
    { name: "referer", type: "text" },
    { name: "userAgent", type: "text" },
    { name: "resolved", type: "checkbox", defaultValue: false, index: true },
  ],
};
