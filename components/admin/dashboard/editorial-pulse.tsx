import * as React from "react";

interface DayBucket {
  date: string;
  label: string;
  count: number;
}

interface Props {
  buckets: DayBucket[];
  totalThisWeek: number;
  totalLastWeek: number;
}

function deltaCopy(a: number, b: number) {
  if (b === 0) {
    return a === 0
      ? { tone: "flat" as const, text: "No activity" }
      : { tone: "up" as const, text: `+${a} new this week` };
  }
  const pct = Math.round(((a - b) / b) * 100);
  if (pct === 0) return { tone: "flat" as const, text: "Holding steady" };
  if (pct > 0) return { tone: "up" as const, text: `+${pct}% week over week` };
  return { tone: "down" as const, text: `${pct}% week over week` };
}

export function EditorialPulse({
  buckets,
  totalThisWeek,
  totalLastWeek,
}: Props) {
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const delta = deltaCopy(totalThisWeek, totalLastWeek);

  return (
    <section className="om-dash__panel om-dash__panel--pulse">
      <header className="om-dash__panel-head om-dash__pulse-head">
        <div>
          <h2>Editorial pulse</h2>
          <p>Posts touched per day · last 14 days</p>
        </div>
        <div className="om-dash__pulse-summary">
          <span className="om-dash__pulse-count">{totalThisWeek}</span>
          <span className={`om-dash__pulse-delta om-dash__pulse-delta--${delta.tone}`}>
            <span aria-hidden>
              {delta.tone === "up" ? "▲" : delta.tone === "down" ? "▼" : "■"}
            </span>{" "}
            {delta.text}
          </span>
        </div>
      </header>

      <div className="om-dash__pulse-chart" role="img" aria-label="14 day activity">
        {buckets.map((b, i) => {
          const heightPct = Math.max(4, Math.round((b.count / max) * 100));
          const isToday = i === buckets.length - 1;
          return (
            <div
              key={b.date}
              className={`om-dash__pulse-bar${isToday ? " is-today" : ""}`}
              title={`${b.label}: ${b.count} edit${b.count === 1 ? "" : "s"}`}
            >
              <span
                className="om-dash__pulse-bar-fill"
                style={{ height: `${heightPct}%` }}
              />
              {b.count > 0 && (
                <span className="om-dash__pulse-bar-count">{b.count}</span>
              )}
            </div>
          );
        })}
      </div>

      <footer className="om-dash__pulse-axis" aria-hidden>
        {buckets.map((b, i) => {
          const showLabel = i === 0 || i === buckets.length - 1 || i % 3 === 0;
          return (
            <span
              key={b.date}
              className="om-dash__pulse-axis-tick"
              data-show={showLabel ? "1" : "0"}
            >
              {showLabel ? b.label.split(" ")[1] ?? b.label : ""}
            </span>
          );
        })}
      </footer>
    </section>
  );
}
