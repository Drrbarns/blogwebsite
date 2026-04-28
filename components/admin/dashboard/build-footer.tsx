import * as React from "react";

const ENV =
  process.env.VERCEL_ENV ??
  (process.env.NODE_ENV === "production" ? "production" : "development");
const SHA = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7);
const BRANCH = process.env.VERCEL_GIT_COMMIT_REF ?? "";
const BUILD_TIME = process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME
  ? new Date().toISOString().replace(/T/, " ").slice(0, 16) + " UTC"
  : null;
const REGION = process.env.VERCEL_REGION ?? "local";

const TIPS = [
  "Press / to focus the global search.",
  "Hold ⇧ on a list row to select a range.",
  "Drag a card from Media into the Lexical editor.",
  "Schedule publish via the Status dropdown.",
  "Open ⌘K to jump anywhere across collections.",
];

// Server-rendered tip — rotates per UTC day so the dashboard
// feels alive without re-rendering on every request.
const TIP_INDEX = Math.floor(Date.now() / 86_400_000) % TIPS.length;

export function BuildFooter() {
  const tip = TIPS[TIP_INDEX];

  return (
    <footer className="om-dash__build" aria-label="Build information">
      <div className="om-dash__build-tip">
        <span className="om-dash__build-tip-icon" aria-hidden>
          ✦
        </span>
        <span>
          <strong>Tip · </strong>
          {tip}
        </span>
      </div>
      <div className="om-dash__build-meta">
        <span
          className={`om-dash__build-env om-dash__build-env--${ENV}`}
          title={`Environment: ${ENV}`}
        >
          <span className="om-dash__build-dot" aria-hidden /> {ENV}
        </span>
        {SHA && (
          <span className="om-dash__build-tag" title="Git commit">
            {SHA}
          </span>
        )}
        {BRANCH && (
          <span className="om-dash__build-tag" title="Git branch">
            {BRANCH}
          </span>
        )}
        {BUILD_TIME && (
          <span className="om-dash__build-tag" title="Deployed at">
            {BUILD_TIME}
          </span>
        )}
        <span className="om-dash__build-tag" title="Edge region">
          {REGION}
        </span>
      </div>
    </footer>
  );
}
