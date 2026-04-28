import * as React from "react";
import Link from "next/link";

interface Tag {
  id: number | string;
  name: string;
  count: number;
}

interface Props {
  tags: Tag[];
  adminBase: string;
}

export function TagCloud({ tags, adminBase }: Props) {
  if (!tags || tags.length === 0) {
    return (
      <section className="om-dash__panel om-dash__panel--tags">
        <header className="om-dash__panel-head">
          <h2>Tag cloud</h2>
          <p>No tags yet. Add some to power the taxonomy.</p>
        </header>
        <Link
          className="om-dash__empty-link"
          href={`${adminBase}/collections/tags/create`}
        >
          Create a tag →
        </Link>
      </section>
    );
  }

  const max = Math.max(1, ...tags.map((t) => t.count));

  return (
    <section className="om-dash__panel om-dash__panel--tags">
      <header className="om-dash__panel-head">
        <h2>Tag cloud</h2>
        <p>The taxonomy editors lean on most.</p>
      </header>
      <ul className="om-dash__tags">
        {tags.map((t) => {
          const intensity = Math.max(0.35, t.count / max);
          const fontPx = 12 + Math.round(intensity * 12);
          return (
            <li key={t.id}>
              <Link
                href={`${adminBase}/collections/tags/${t.id}`}
                className="om-dash__tag"
                style={{
                  fontSize: `${fontPx}px`,
                  ["--om-tag-intensity" as string]: intensity.toFixed(2),
                }}
              >
                #{t.name}
                <span className="om-dash__tag-count">{t.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
