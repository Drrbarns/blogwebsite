"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Client-side 404 logger.  Fires a single POST to /api/log/404 the first time
 * a user lands on a missing URL.  Uses navigator.sendBeacon if available.
 */
export function NotFoundLogger() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    if (typeof window === "undefined") return;
    try {
      const payload = JSON.stringify({
        path: pathname,
        referer: document.referrer || undefined,
      });
      if (
        "sendBeacon" in navigator &&
        typeof navigator.sendBeacon === "function"
      ) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/log/404", blob);
      } else {
        fetch("/api/log/404", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);
  return null;
}
