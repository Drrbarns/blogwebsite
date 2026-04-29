import * as React from "react";
import Link from "next/link";

const env =
  process.env.VERCEL_ENV ??
  (process.env.NODE_ENV === "production" ? "production" : "development");
const envLabel =
  env === "production" ? "Live" : env === "preview" ? "Preview" : "Dev";

const sha = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7);

export default function TopBar() {
  return (
    <div className="om-topbar" aria-label="Workspace status">
      <span className={`om-topbar__pill om-topbar__pill--${env}`}>
        <span className="om-topbar__pulse" aria-hidden /> {envLabel}
      </span>

      <span className="om-topbar__separator" aria-hidden />

      <span className="om-topbar__crumb">
        <span className="om-topbar__crumb-label">Studio</span>
        <span className="om-topbar__crumb-value">About a Girl</span>
      </span>

      {sha && (
        <span className="om-topbar__sha" title="Last deploy">
          {sha}
        </span>
      )}

      <span className="om-topbar__spacer" />

      <a
        className="om-topbar__link"
        href="/"
        target="_blank"
        rel="noreferrer"
        title="Open the public site"
      >
        <span aria-hidden>↗</span> View site
      </a>
      <Link
        className="om-topbar__link"
        href="/api/exit-preview"
        title="Reset draft preview cookie"
        prefetch={false}
      >
        Exit preview
      </Link>

      <span className="om-topbar__kbd" aria-label="Keyboard shortcut">
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </span>
    </div>
  );
}
