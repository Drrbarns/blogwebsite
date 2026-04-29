import * as React from "react";

/**
 * Brand panel rendered to the left of the login form.
 *
 * Deliberately minimal — a pill, the brand mark, a single tagline and a
 * copyright line. Anything more than that turns a login screen into
 * marketing, which is exactly what most admin logins should not look like.
 */
export default function LoginHero() {
  const year = new Date().getFullYear();

  return (
    <aside className="om-login__hero" aria-label="About a Girl studio">
      <header className="om-login__hero-top">
        <span className="om-login__pill">
          <span className="om-login__pulse" aria-hidden />
          <span>About a Girl · Studio</span>
        </span>
      </header>

      <div className="om-login__hero-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.png"
          alt=""
          width={140}
          height={140}
          className="om-login__hero-mark"
          aria-hidden
        />
        <h1 className="om-login__hero-title">About a Girl</h1>
        <p className="om-login__hero-tag">Faith · Sport · Medicine · Life</p>
      </div>

      <footer className="om-login__hero-bottom">
        <span>© {year} About a Girl</span>
        <span className="om-login__hero-dot" aria-hidden>
          ·
        </span>
        <span>Writing studio</span>
      </footer>
    </aside>
  );
}
