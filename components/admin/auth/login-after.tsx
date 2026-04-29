import * as React from "react";

const SHA = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7);

/**
 * Centered footer rendered under the login card. Two helper links and
 * a single fine-print line — no chrome.
 */
export default function LoginAfter() {
  const year = new Date().getFullYear();
  return (
    <div className="om-login__after">
      <div className="om-login__after-meta">
        <a className="om-login__after-link" href="/" target="_blank" rel="noreferrer">
          ← Back to the blog
        </a>
        <span className="om-login__after-divider" aria-hidden>
          ·
        </span>
        <a className="om-login__after-link" href="mailto:hello@aboutagirl.blog">
          Need help?
        </a>
      </div>

      <p className="om-login__after-fineprint">
        © {year} About a Girl · Secure session, encrypted at rest
        {SHA ? ` · build ${SHA}` : ""}.
      </p>

      <p className="om-login__after-poweredby">
        Powered by{" "}
        <a
          href="https://doctorbarns.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="om-login__after-link"
        >
          Doctor Barns Tech
        </a>
      </p>
    </div>
  );
}
