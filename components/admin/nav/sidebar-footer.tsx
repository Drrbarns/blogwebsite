import * as React from "react";

const BUILD_SHA = (
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GIT_COMMIT_SHA ??
  ""
).slice(0, 7);

const BUILD_DATE = process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN
  ? new Date().toISOString().slice(0, 10)
  : null;

export default function SidebarFooter() {
  const links = [
    {
      href: "/",
      label: "View site",
      icon: "↗",
      external: true,
    },
    {
      href: "/api/cron/link-check",
      label: "Run link audit",
      icon: "❍",
      external: true,
    },
    {
      href: "/sitemap.xml",
      label: "Sitemap",
      icon: "✦",
      external: true,
    },
  ];

  return (
    <div className="om-sidefoot">
      <ul className="om-sidefoot__links">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="om-sidefoot__link"
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
            >
              <span className="om-sidefoot__link-icon" aria-hidden>
                {l.icon}
              </span>
              <span>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="om-sidefoot__build">
        <span className="om-sidefoot__build-name">About a Girl · Studio</span>
        <span className="om-sidefoot__build-meta">
          v1.0
          {BUILD_SHA ? ` · ${BUILD_SHA}` : ""}
          {BUILD_DATE ? ` · ${BUILD_DATE}` : ""}
        </span>
      </div>
    </div>
  );
}
