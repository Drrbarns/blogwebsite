import "server-only";

import { getPayload as _getPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * Singleton Payload Local API accessor.  Avoids instantiating a new instance
 * on every RSC render (which would exhaust the DB pool during build).
 */
let cached: Promise<Payload> | null = null;

export function getPayload(): Promise<Payload> {
  if (!cached) {
    cached = _getPayload({ config });
  }
  return cached;
}
