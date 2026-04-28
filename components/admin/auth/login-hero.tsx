"use client";

import * as React from "react";

const QUOTES: Array<{ quote: string; author: string }> = [
  {
    quote:
      "The best editorial tools disappear. They turn weeks of fiddling into hours of writing.",
    author: "The team that ships",
  },
  {
    quote:
      "Designed for the writer, instrumented for the operator, beautiful for the reader.",
    author: "Editorial principles · 2026",
  },
  {
    quote:
      "Every block, every byline, every link — all version-controlled and live-previewed.",
    author: "Notes from the playbook",
  },
];

const HIGHLIGHTS: Array<{ title: string; copy: string }> = [
  {
    title: "Editorial-grade publishing",
    copy: "Lexical rich text, blocks, scheduled publishing and live preview.",
  },
  {
    title: "SEO baked in",
    copy: "Automatic schema, OG art, sitemaps, IndexNow and SERP previews.",
  },
  {
    title: "Real workflow",
    copy: "Roles, drafts, version history, link health and 404 logging.",
  },
];

function useNow() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function LoginHero() {
  const [idx, setIdx] = React.useState(0);
  const now = useNow();

  React.useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % QUOTES.length),
      6500,
    );
    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";
  const date = now
    ? now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "Today";

  const q = QUOTES[idx];

  return (
    <aside className="om-login__hero" aria-label="Welcome to the editorial workspace">
      <div className="om-login__hero-orb om-login__hero-orb--a" aria-hidden />
      <div className="om-login__hero-orb om-login__hero-orb--b" aria-hidden />
      <div className="om-login__hero-orb om-login__hero-orb--c" aria-hidden />
      <div className="om-login__hero-grid" aria-hidden />

      <div className="om-login__hero-inner">
        <div className="om-login__hero-topline">
          <span className="om-login__pill">
            <span className="om-login__pulse" aria-hidden />
            <span>Ontario CMS · v1.0</span>
          </span>
          <span className="om-login__hero-time" aria-live="polite">
            <strong>{time}</strong>
            <span>{date}</span>
          </span>
        </div>

        <h1 className="om-login__hero-title">
          A calmer place to <em>ship great writing.</em>
        </h1>
        <p className="om-login__hero-lede">
          The editorial workspace your writers actually want to open.
          Branded, fast, and built around the way modern teams publish.
        </p>

        <ul className="om-login__hero-list">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title}>
              <span className="om-login__hero-bullet" aria-hidden />
              <div>
                <strong>{item.title}</strong>
                <span>{item.copy}</span>
              </div>
            </li>
          ))}
        </ul>

        <figure
          className="om-login__hero-quote"
          aria-live="polite"
          key={q.quote}
        >
          <blockquote>“{q.quote}”</blockquote>
          <figcaption>
            — {q.author}
            <span className="om-login__hero-quote-dots" aria-hidden>
              {QUOTES.map((_, i) => (
                <span
                  key={i}
                  data-active={i === idx ? "1" : "0"}
                  className="om-login__hero-quote-dot"
                />
              ))}
            </span>
          </figcaption>
        </figure>

        <footer className="om-login__hero-footer">
          <span>Crafted for editors</span>
          <span aria-hidden>·</span>
          <span>Powered by Payload &amp; Next.js</span>
        </footer>
      </div>
    </aside>
  );
}
