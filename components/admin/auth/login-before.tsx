import * as React from "react";

/**
 * Renders above the login card. A centered brand strip + heading +
 * one-line subtitle. The form card is rendered by Payload immediately
 * after this block — see the LOGIN section in custom.scss for the
 * card / icon / button styling.
 */
export default function LoginBefore() {
  return (
    <div className="om-login__head">
      <span className="om-login__pill">
        <span className="om-login__pulse" aria-hidden />
        <span>About a Girl · Studio</span>
      </span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt=""
        width={84}
        height={84}
        className="om-login__head-mark"
        aria-hidden
      />

      <h1 className="om-login__head-title">Welcome back</h1>
      <p className="om-login__head-lede">
        Sign in to continue writing today&apos;s entry.
      </p>
    </div>
  );
}
