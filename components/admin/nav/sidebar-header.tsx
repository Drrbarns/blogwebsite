import * as React from "react";
import type { ServerProps } from "payload";

import { BrandMark } from "../brand/brand-mark";

type AnyUser = {
  id?: string | number;
  email?: string;
  name?: string;
  role?: string;
};

export default async function SidebarHeader(props: ServerProps) {
  const user = (props as { user?: AnyUser | null }).user ?? null;

  const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
  const envLabel =
    env === "production" ? "Live" : env === "preview" ? "Preview" : "Dev";

  const initials = (() => {
    const source = user?.name || user?.email || "?";
    const parts = source.split(/[\s@.]+/).filter(Boolean);
    return (
      (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")
    ).toUpperCase().slice(0, 2);
  })();

  return (
    <div className="om-sidehead">
      <div className="om-sidehead__brand">
        <BrandMark size={36} animated={false} />
        <div className="om-sidehead__brand-text">
          <span className="om-sidehead__brand-name">About a Girl</span>
          <span className="om-sidehead__brand-sub">Writing studio</span>
        </div>
      </div>

      <div className="om-sidehead__row">
        <span
          className={`om-sidehead__env om-sidehead__env--${env}`}
          title={`Environment: ${env}`}
        >
          <span className="om-sidehead__env-dot" aria-hidden /> {envLabel}
        </span>
        <span className="om-sidehead__user" title={user?.email ?? undefined}>
          <span className="om-sidehead__avatar" aria-hidden>
            {initials}
          </span>
          <span className="om-sidehead__user-text">
            <strong>{user?.name || user?.email || "Editor"}</strong>
            <span>{user?.role ?? "team"}</span>
          </span>
        </span>
      </div>

      <div className="om-sidehead__hint">
        <span className="om-sidehead__hint-key">⌘</span>
        <span className="om-sidehead__hint-key">K</span>
        <span className="om-sidehead__hint-text">to jump anywhere</span>
      </div>
    </div>
  );
}
