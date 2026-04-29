import * as React from "react";

const SHA = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7);

/**
 * Tight footer rendered under the login form. Two links and a single
 * fine-print line — no keyboard shortcut chrome, no marketing spam.
 */
export default function LoginAfter() {
  const year = new Date().getFullYear();
  return (
    <div className="om-login__after">
      <div className="om-login__after-meta">
        <a className="om-login__after-link" href="/" target="_blank" rel="noreferrer">
          ← Back to site
        </a>
        <span className="om-login__after-divider" aria-hidden>
          ·
        </span>
        <a className="om-login__after-link" href="mailto:hello@aboutagirl.blog">
          Need help?
        </a>
      </div>

      <p className="om-login__after-fineprint">
        © {year} About a Girl{SHA ? ` · build ${SHA}` : ""} · Secure session, encrypted at rest.
      </p>
    </div>
  );
}
