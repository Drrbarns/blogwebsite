import { NextResponse } from "next/server";

/**
 * Echoes the IndexNow verification key when hit at `/api/indexnow/{key}`.
 * Configure your search engine with this URL so it can verify ownership.
 * You can also drop `{key}.txt` directly into `/public`.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const expected = process.env.INDEXNOW_KEY;
  if (!expected || key !== expected) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new Response(expected, {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
