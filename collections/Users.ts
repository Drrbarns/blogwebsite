import type { CollectionConfig } from "payload";
import {
  ROLE_OPTIONS,
  isAdmin,
  isAdminField,
  isAdminOrSelf,
} from "./access/roles";
import { ensureSlug } from "./hooks/slug";
import { revalidateAfterChange } from "./hooks/revalidate";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 10,
    useAPIKey: true,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "roles", "slug"],
    group: "Admin",
  },
  hooks: {
    beforeChange: [ensureSlug("name")],
    afterChange: [revalidateAfterChange("users")],
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => {
      const u = req.user as { roles?: string[] } | null | undefined;
      return Array.isArray(u?.roles)
        ? u!.roles!.some((r) => ["admin", "editor", "author", "contributor"].includes(r))
        : false;
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        description: "URL segment for /authors/{slug}. Auto-generated from name.",
      },
    },
    {
      name: "headline",
      type: "text",
      admin: {
        description: "Short one-liner shown under the author name.",
      },
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["subscriber"],
      options: ROLE_OPTIONS,
      access: {
        update: isAdminField,
      },
    },
    {
      name: "bio",
      type: "textarea",
      admin: {
        description: "Shown on author archive pages.",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "social",
      type: "group",
      fields: [
        { name: "twitter", type: "text" },
        { name: "linkedin", type: "text" },
        { name: "github", type: "text" },
        { name: "website", type: "text" },
      ],
    },
  ],
};
