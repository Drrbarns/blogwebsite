import * as React from "react";
import Link from "next/link";

interface Props {
  name: string;
  adminBase: string;
  canCreatePosts: boolean;
  stats: {
    postsTotal: number;
    postsPublished: number;
    postsDrafts: number;
    pagesTotal: number;
    mediaTotal: number;
  };
}

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Working late";
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function WelcomeCard({ name, stats, adminBase, canCreatePosts }: Props) {
  const greeting = timeOfDayGreeting();
  const date = todayLabel();
  const firstName = name.split(/\s+/)[0];

  let pulse: string;
  let pulseTone: "ok" | "draft" | "empty" = "ok";
  if (stats.postsDrafts > 0) {
    pulse = `${stats.postsDrafts} draft${stats.postsDrafts === 1 ? "" : "s"} waiting for you`;
    pulseTone = "draft";
  } else if (stats.postsPublished === 0) {
    pulse = "Publish your first story";
    pulseTone = "empty";
  } else {
    pulse = `${stats.postsPublished} live · ${stats.pagesTotal} pages · ${stats.mediaTotal} assets`;
  }

  const headlineCopy =
    stats.postsPublished === 0
      ? "Open the journal. Write the first entry."
      : stats.postsDrafts > 0
        ? "There's something in the pipeline."
        : "The desk is clear. Time to write the next entry.";

  return (
    <header className="om-dash__welcome">
      <div className="om-dash__welcome-glow" aria-hidden />
      <div className="om-dash__welcome-grid" aria-hidden />

      <div className="om-dash__welcome-meta">
        <span className="om-dash__welcome-date">{date}</span>
        <span
          className={`om-dash__welcome-pulse om-dash__welcome-pulse--${pulseTone}`}
        >
          <span className="om-dash__welcome-dot" aria-hidden /> {pulse}
        </span>
      </div>

      <h1 className="om-dash__welcome-title">
        {greeting}, <span>{firstName}</span>.
      </h1>
      <p className="om-dash__welcome-lede">{headlineCopy}</p>

      <div className="om-dash__welcome-cta">
        {canCreatePosts && (
          <Link
            className="om-dash__welcome-btn om-dash__welcome-btn--primary"
            href={`${adminBase}/collections/posts/create`}
          >
            <span aria-hidden>✦</span> Start a new post
            <span className="om-dash__welcome-kbd" aria-hidden>
              <kbd>N</kbd>
            </span>
          </Link>
        )}
        <Link
          className="om-dash__welcome-btn"
          href={`${adminBase}/collections/posts?where[_status][equals]=draft`}
        >
          Open drafts
        </Link>
        <Link
          className="om-dash__welcome-btn"
          href={`${adminBase}/collections/media`}
        >
          Browse media
        </Link>
      </div>

      <dl className="om-dash__welcome-mini">
        <div>
          <dt>Library</dt>
          <dd>
            {stats.postsTotal}
            <span>posts</span>
          </dd>
        </div>
        <div>
          <dt>Pages</dt>
          <dd>
            {stats.pagesTotal}
            <span>routes</span>
          </dd>
        </div>
        <div>
          <dt>Assets</dt>
          <dd>
            {stats.mediaTotal}
            <span>files</span>
          </dd>
        </div>
      </dl>
    </header>
  );
}
