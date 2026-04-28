import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * HMAC-signed revalidation endpoint.
 *
 * Clients sign `timestamp.path` with the shared secret and include the
 * resulting hex digest in `x-signature`.  Replay protection is provided by
 * the timestamp check (±5 minutes).
 *
 * Body: { path?: string; tag?: string; paths?: string[]; tags?: string[] }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("x-signature");
  const timestamp = req.headers.get("x-timestamp");
  if (!signature || !timestamp) {
    return NextResponse.json({ error: "Missing signature headers" }, { status: 401 });
  }

  const age = Math.abs(Date.now() - Number(timestamp));
  if (Number.isNaN(age) || age > 5 * 60 * 1000) {
    return NextResponse.json({ error: "Stale or invalid timestamp" }, { status: 401 });
  }

  const bodyText = await req.text();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${bodyText}`)
    .digest("hex");

  const provided = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (
    provided.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(provided, expectedBuf)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: {
    path?: string;
    tag?: string;
    paths?: string[];
    tags?: string[];
  } = {};
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const revalidatedPaths: string[] = [];
  const revalidatedTags: string[] = [];

  const all: string[] = [
    ...(body.path ? [body.path] : []),
    ...(body.paths ?? []),
  ];
  for (const p of all) {
    revalidatePath(p);
    revalidatedPaths.push(p);
  }

  const allTags: string[] = [
    ...(body.tag ? [body.tag] : []),
    ...(body.tags ?? []),
  ];
  for (const t of allTags) {
    revalidateTag(t, { expire: 0 });
    revalidatedTags.push(t);
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    paths: revalidatedPaths,
    tags: revalidatedTags,
  });
}
