import type { Access, FieldAccess } from "payload";

export type Role = "admin" | "editor" | "author" | "contributor" | "subscriber";

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: "Administrator", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Author", value: "author" },
  { label: "Contributor", value: "contributor" },
  { label: "Subscriber", value: "subscriber" },
];

type UserWithRoles = { id: string | number; roles?: Role[] } | null | undefined;

const hasRole = (user: UserWithRoles, ...roles: Role[]): boolean => {
  if (!user) return false;
  const u = user as { roles?: Role[] };
  if (!u.roles || u.roles.length === 0) return false;
  return u.roles.some((r) => roles.includes(r));
};

export const isAdmin: Access = ({ req }) =>
  hasRole(req.user as UserWithRoles, "admin");

export const isAdminField: FieldAccess = ({ req }) =>
  hasRole(req.user as UserWithRoles, "admin");

export const isAdminOrEditor: Access = ({ req }) =>
  hasRole(req.user as UserWithRoles, "admin", "editor");

export const isAdminOrSelf: Access = ({ req }) => {
  const user = req.user as UserWithRoles;
  if (!user) return false;
  if (hasRole(user, "admin")) return true;
  return { id: { equals: user.id } };
};

/**
 * Authors can only modify their own posts. Editors/Admins can modify any.
 */
export const canEditPost: Access = ({ req }) => {
  const user = req.user as UserWithRoles;
  if (!user) return false;
  if (hasRole(user, "admin", "editor")) return true;
  if (hasRole(user, "author", "contributor")) {
    return { authors: { in: [user.id] } };
  }
  return false;
};

export const publishedOnly: Access = ({ req }) => {
  const user = req.user as UserWithRoles;
  if (hasRole(user, "admin", "editor", "author", "contributor")) return true;
  return { _status: { equals: "published" } };
};
