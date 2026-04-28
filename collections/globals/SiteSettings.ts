import type { GlobalConfig } from "payload";
import { isAdmin } from "../access/roles";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Site",
    description: "Brand, defaults, and search-engine-wide SEO settings.",
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: "brand",
      type: "group",
      fields: [
        { name: "name", type: "text", required: true, defaultValue: "Ontario" },
        { name: "tagline", type: "text" },
        {
          name: "description",
          type: "textarea",
          maxLength: 320,
        },
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "favicon",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "ogImage",
          label: "Default Open Graph image (1200×630)",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "titleTemplate",
          type: "text",
          defaultValue: "%s — Ontario",
          admin: { description: "Use %s as the placeholder for the page title." },
        },
        { name: "defaultTitle", type: "text" },
        { name: "defaultDescription", type: "textarea" },
        {
          name: "twitter",
          type: "text",
          admin: { description: "@handle for Twitter cards." },
        },
        {
          name: "indexNowKey",
          type: "text",
          admin: { description: "Your IndexNow verification key file name (placed in /public)." },
        },
        {
          name: "publishGate",
          type: "group",
          label: "Publish quality gate",
          fields: [
            {
              name: "enabled",
              type: "checkbox",
              defaultValue: false,
              admin: {
                description: "When on, posts must pass the SEO score & schema checks before publishing.",
              },
            },
            {
              name: "minScore",
              type: "number",
              defaultValue: 60,
              min: 0,
              max: 100,
            },
            {
              name: "requireAltText",
              type: "checkbox",
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "email", type: "email" },
        { name: "phone", type: "text" },
        { name: "address", type: "textarea" },
      ],
    },
    {
      name: "analytics",
      type: "group",
      admin: { description: "First-party analytics is built into /api/analytics/track (Phase 3)." },
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "plausibleDomain", type: "text" },
        { name: "gaMeasurementId", type: "text" },
      ],
    },
  ],
};
