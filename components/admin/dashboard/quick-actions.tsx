import * as React from "react";
import Link from "next/link";

interface Props {
  adminBase: string;
  canCreatePosts: boolean;
}

export function QuickActions({ adminBase, canCreatePosts }: Props) {
  const actions = [
    canCreatePosts && {
      href: `${adminBase}/collections/posts/create`,
      label: "Write a new post",
      hint: "Open the Lexical editor",
      icon: "✦",
    },
    {
      href: `${adminBase}/collections/media`,
      label: "Upload media",
      hint: "Drop into the library",
      icon: "↑",
    },
    {
      href: `${adminBase}/globals/site-settings`,
      label: "Edit site settings",
      hint: "Brand, social, contact",
      icon: "⚙",
    },
    {
      href: `${adminBase}/globals/navigation`,
      label: "Update navigation",
      hint: "Header & footer links",
      icon: "≡",
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    hint: string;
    icon: string;
  }>;

  return (
    <section className="om-dash__panel om-dash__panel--actions">
      <header className="om-dash__panel-head">
        <h2>Quick actions</h2>
        <p>One-click jumps into the most common workflows.</p>
      </header>
      <ul className="om-dash__actions">
        {actions.map((a) => (
          <li key={a.href}>
            <Link href={a.href} className="om-dash__action">
              <span className="om-dash__action-icon" aria-hidden>
                {a.icon}
              </span>
              <span className="om-dash__action-text">
                <strong>{a.label}</strong>
                <span>{a.hint}</span>
              </span>
              <span className="om-dash__action-arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
