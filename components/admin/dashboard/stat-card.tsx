import * as React from "react";
import Link from "next/link";

type Tone = "indigo" | "violet" | "amber" | "sky" | "emerald" | "rose" | "slate";

interface Props {
  label: string;
  value: number;
  delta?: string;
  tone?: Tone;
  href?: string;
}

function formatValue(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

export function StatCard({ label, value, delta, tone = "indigo", href }: Props) {
  const body = (
    <>
      <div className="om-stat__row">
        <span className={`om-stat__chip om-stat__chip--${tone}`}>{label}</span>
        {delta && <span className="om-stat__delta">{delta}</span>}
      </div>
      <div className="om-stat__value">{formatValue(value)}</div>
      <div className={`om-stat__bar om-stat__bar--${tone}`} aria-hidden />
    </>
  );

  if (href) {
    return (
      <Link className="om-stat" href={href}>
        {body}
        <span className="om-stat__cta">Open</span>
      </Link>
    );
  }
  return <div className="om-stat">{body}</div>;
}
