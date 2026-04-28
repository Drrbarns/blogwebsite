import * as React from "react";
import Link from "next/link";

export interface ActivityEvent {
  id: string;
  kind: "post-published" | "post-edited" | "media-uploaded" | "user-joined";
  title: string;
  href?: string;
  who?: string;
  at: string;
}

interface Props {
  events: ActivityEvent[];
}

function relativeTime(iso?: string) {
  if (!iso) return "—";
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "—";
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

const ICONS: Record<ActivityEvent["kind"], { icon: string; tone: string; label: string }> = {
  "post-published": { icon: "✦", tone: "emerald", label: "Published" },
  "post-edited": { icon: "✎", tone: "amber", label: "Edited" },
  "media-uploaded": { icon: "↑", tone: "sky", label: "Upload" },
  "user-joined": { icon: "+", tone: "violet", label: "New member" },
};

export function ActivityFeed({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <section className="om-dash__panel om-dash__panel--feed">
        <header className="om-dash__panel-head">
          <h2>Activity</h2>
          <p>Nothing has happened yet — be the first to publish.</p>
        </header>
      </section>
    );
  }

  return (
    <section className="om-dash__panel om-dash__panel--feed">
      <header className="om-dash__panel-head">
        <h2>Activity</h2>
        <p>The most recent things to happen in the workspace.</p>
      </header>
      <ol className="om-dash__feed">
        {events.map((e) => {
          const meta = ICONS[e.kind];
          const Body = (
            <>
              <span
                className={`om-dash__feed-icon om-dash__feed-icon--${meta.tone}`}
                aria-hidden
              >
                {meta.icon}
              </span>
              <span className="om-dash__feed-text">
                <span className="om-dash__feed-headline">
                  <span className={`om-dash__feed-tag om-dash__feed-tag--${meta.tone}`}>
                    {meta.label}
                  </span>
                  <strong>{e.title}</strong>
                </span>
                <span className="om-dash__feed-meta">
                  {e.who ? `${e.who} · ` : ""}
                  {relativeTime(e.at)}
                </span>
              </span>
            </>
          );
          return (
            <li key={e.id} className="om-dash__feed-item">
              {e.href ? (
                <Link href={e.href} className="om-dash__feed-row">
                  {Body}
                </Link>
              ) : (
                <div className="om-dash__feed-row">{Body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
