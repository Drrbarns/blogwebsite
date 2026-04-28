import * as React from "react";
import Link from "next/link";

type Tone = "indigo" | "violet" | "amber" | "sky" | "emerald" | "rose" | "slate";

interface Props {
  href: string;
  label: string;
  hint: string;
  count?: number;
  tone?: Tone;
}

export function CollectionTile({
  href,
  label,
  hint,
  count,
  tone = "slate",
}: Props) {
  return (
    <Link href={href} className={`om-tile om-tile--${tone}`}>
      <span className="om-tile__top">
        <span className="om-tile__label">{label}</span>
        {typeof count === "number" && (
          <span className="om-tile__count">{count}</span>
        )}
      </span>
      <span className="om-tile__hint">{hint}</span>
      <span className="om-tile__cta">
        Manage <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
