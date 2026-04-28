import * as React from "react";

const SHA = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7);

export default function LoginAfter() {
  const year = new Date().getFullYear();
  return (
    <div className="om-login__after">
      <div className="om-login__after-shortcuts">
        <span className="om-login__after-shortcut">
          <kbd>↵</kbd> Sign in
        </span>
        <span className="om-login__after-shortcut">
          <kbd>⇥</kbd> Next field
        </span>
      </div>

      <div className="om-login__after-meta">
        <a
          className="om-login__after-link"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden>↗</span> View live site
        </a>
        <span className="om-login__after-divider" aria-hidden>
          ·
        </span>
        <a
          className="om-login__after-link"
          href="https://payloadcms.com/docs"
          target="_blank"
          rel="noreferrer"
        >
          Editorial handbook
        </a>
        <span className="om-login__after-divider" aria-hidden>
          ·
        </span>
        <a className="om-login__after-link" href="mailto:editors@ontario.cms">
          Get help
        </a>
      </div>

      <p className="om-login__after-fineprint">
        © {year} Ontario · Secure session, encrypted at rest{SHA ? ` · build ${SHA}` : ""}.
      </p>
    </div>
  );
}
