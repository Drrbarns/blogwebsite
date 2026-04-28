import * as React from "react";

import { BrandMark } from "./brand-mark";

export default function AdminLogo() {
  return (
    <span className="om-logo" aria-label="Ontario CMS">
      <BrandMark size={42} />
      <span className="om-logo__text">
        <span className="om-logo__wordmark">Ontario</span>
        <span className="om-logo__sub">Editorial workspace</span>
      </span>
    </span>
  );
}
