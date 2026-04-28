import * as React from "react";
import Link from "next/link";

interface Props {
  notFound: number;
  linkHealth: number;
  adminBase: string;
}

export function SiteStatus({ notFound, linkHealth, adminBase }: Props) {
  const items = [
    {
      label: "404 hits logged",
      value: notFound,
      hint:
        notFound === 0
          ? "No missing pages. Nice."
          : "Consider adding redirects or content.",
      href: `${adminBase}/collections/not-found-logs`,
      tone: notFound > 0 ? "warn" : "ok",
    },
    {
      label: "Outbound links failing",
      value: linkHealth,
      hint:
        linkHealth === 0
          ? "All outbound links healthy."
          : "Heads up: a few links broke.",
      href: `${adminBase}/collections/link-health`,
      tone: linkHealth > 0 ? "warn" : "ok",
    },
  ] as const;

  return (
    <section className="om-dash__panel om-dash__panel--status">
      <header className="om-dash__panel-head">
        <h2>Site health</h2>
        <p>Anything to act on, surfaced here.</p>
      </header>
      <ul className="om-dash__status">
        {items.map((item) => (
          <li key={item.label} className={`om-dash__status-item om-dash__status-item--${item.tone}`}>
            <Link href={item.href} className="om-dash__status-link">
              <span className="om-dash__status-value">{item.value}</span>
              <span className="om-dash__status-text">
                <strong>{item.label}</strong>
                <span>{item.hint}</span>
              </span>
              <span className="om-dash__status-arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
