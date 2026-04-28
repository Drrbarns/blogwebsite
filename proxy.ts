import { NextResponse, type NextRequest } from "next/server";

/**
 * Canonical / robots / trailing-slash middleware.
 *
 *  - Strips trailing slashes (except the root) for one canonical URL
 *  - Lowercases blog URLs so `/Blog/Foo` → `/blog/foo`
 *  - Blocks bots from admin and API routes via `X-Robots-Tag`
 *  - Optional: force www ↔ non-www based on `CANONICAL_HOST` env
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname, host } = url;

  const shouldSkip =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  // Canonical host (e.g. force apex over www)
  const canonicalHost = process.env.CANONICAL_HOST;
  if (
    canonicalHost &&
    host &&
    host !== canonicalHost &&
    !host.startsWith("localhost") &&
    !host.startsWith("127.")
  ) {
    const next = url.clone();
    next.host = canonicalHost;
    return NextResponse.redirect(next, 308);
  }

  if (!shouldSkip) {
    // Trailing slash
    if (pathname !== "/" && pathname.endsWith("/")) {
      const next = url.clone();
      next.pathname = pathname.replace(/\/+$/, "");
      return NextResponse.redirect(next, 308);
    }
    // Lowercase blog paths
    if (pathname.startsWith("/blog/") && pathname !== pathname.toLowerCase()) {
      const next = url.clone();
      next.pathname = pathname.toLowerCase();
      return NextResponse.redirect(next, 308);
    }
  }

  const res = NextResponse.next();
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/preview")
  ) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
