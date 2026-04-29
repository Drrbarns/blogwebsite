import * as React from "react";

import LoginHero from "./login-hero";

/**
 * Renders above the form area on the login page.
 *
 * The brand panel is rendered here so it sits on the LEFT of the form on
 * desktop (via the grid in custom.scss). Above the form on the right we
 * also render a small heading + lede so the form has a proper title and
 * does not look like a stranded input pair.
 */
export default function LoginBefore() {
  return (
    <>
      <LoginHero />
      <div className="om-login__intro">
        <h2 className="om-login__intro-title">Welcome back</h2>
        <p className="om-login__intro-lede">
          Sign in to continue to the writing studio.
        </p>
      </div>
    </>
  );
}
