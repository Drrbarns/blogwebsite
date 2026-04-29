import * as React from "react";

import { BrandMark } from "./brand-mark";

export default function AdminLogo() {
  return (
    <span className="om-logo" aria-label="About a Girl · Studio">
      <BrandMark size={42} />
      <span className="om-logo__text">
        <span className="om-logo__wordmark">About a Girl</span>
        <span className="om-logo__sub">Writing studio</span>
      </span>
    </span>
  );
}
