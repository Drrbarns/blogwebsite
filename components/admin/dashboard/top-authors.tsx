import * as React from "react";
import Link from "next/link";

interface Author {
  id: number | string;
  name: string;
  email?: string;
  count: number;
  draftCount: number;
}

interface Props {
  authors: Author[];
  adminBase: string;
}

function initials(input: string) {
  const parts = input.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? ""))
    .toUpperCase()
    .slice(0, 2);
}

export function TopAuthors({ authors, adminBase }: Props) {
  if (!authors || authors.length === 0) {
    return (
      <section className="om-dash__panel om-dash__panel--authors">
        <header className="om-dash__panel-head">
          <h2>Top contributors</h2>
          <p>No bylines yet — invite your first author.</p>
        </header>
        <Link
          className="om-dash__empty-link"
          href={`${adminBase}/collections/users/create`}
        >
          Invite a writer →
        </Link>
      </section>
    );
  }

  const max = Math.max(1, ...authors.map((a) => a.count));

  return (
    <section className="om-dash__panel om-dash__panel--authors">
      <header className="om-dash__panel-head">
        <h2>Top contributors</h2>
        <p>Bylines published in this workspace.</p>
      </header>
      <ul className="om-dash__authors">
        {authors.map((a, i) => (
          <li key={a.id} className="om-dash__author">
            <Link
              href={`${adminBase}/collections/users/${a.id}`}
              className="om-dash__author-link"
            >
              <span className="om-dash__author-rank">{i + 1}</span>
              <span className="om-dash__author-avatar" aria-hidden>
                {initials(a.name || a.email || "?")}
              </span>
              <span className="om-dash__author-text">
                <strong>{a.name || a.email || "Anonymous"}</strong>
                <span>
                  {a.count} post{a.count === 1 ? "" : "s"}
                  {a.draftCount > 0
                    ? ` · ${a.draftCount} draft${a.draftCount === 1 ? "" : "s"}`
                    : ""}
                </span>
              </span>
              <span className="om-dash__author-bar" aria-hidden>
                <span
                  className="om-dash__author-bar-fill"
                  style={{ width: `${Math.round((a.count / max) * 100)}%` }}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
