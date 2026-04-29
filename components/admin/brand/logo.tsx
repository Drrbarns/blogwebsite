import * as React from "react";

import { BrandMark } from "./brand-mark";

export default function AdminLogo() {
  return (
    <span className="om-logo" aria-label="About a Girl · Studio">
      <BrandMark size={120} />
    </span>
  );
}
