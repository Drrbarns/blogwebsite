/**
 * Public site origin (scheme + host, no trailing slash).
 *
 * Payload's `serverURL`, CORS, and CSRF must match the URL users hit in the
 * browser. On Vercel, `VERCEL_URL` is always set to the deployment host
 * (e.g. `aboutthegirl.vercel.app`). If someone copies `.env.local` into the
 * Vercel dashboard, `NEXT_PUBLIC_SERVER_URL` often stays `http://localhost:3000`,
 * which breaks the admin panel (wrong cookies / CSRF / redirects).
 *
 * In production we detect that misconfiguration and fall back to `VERCEL_URL`.
 */
export function resolvePublicSiteOrigin(): string {
  const trimTrailingSlash = (u: string) => u.replace(/\/+$/, "");

  const candidates = [
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ]
    .map((v) => v?.trim())
    .filter((v): v is string => Boolean(v));
  const first = candidates[0];

  const looksLocal =
    first &&
    (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(first) ||
      /^localhost(:\d+)?$/i.test(first));

  if (process.env.NODE_ENV === "production" && (looksLocal || !first)) {
    const vercel = process.env.VERCEL_URL?.trim();
    if (vercel) {
      const host = vercel.replace(/^https?:\/\//i, "");
      return trimTrailingSlash(`https://${host}`);
    }
  }

  if (first) return trimTrailingSlash(first);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "");
    return trimTrailingSlash(`https://${host}`);
  }

  return "http://localhost:3000";
}
