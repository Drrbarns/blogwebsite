import { NextResponse, type NextRequest } from "next/server";
import { getPayload } from "@/lib/cms/payload";

export const runtime = "nodejs";

const IGNORED = [
  /^\/favicon/,
  /^\/\.well-known/,
  /^\/apple-touch/,
  /^\/(_next|api)\//,
];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { path?: string; referer?: string };
    const path = String(body.path ?? "").trim();
    if (!path || !path.startsWith("/")) {
      return NextResponse.json({ ok: false, reason: "invalid path" });
    }
    if (IGNORED.some((r) => r.test(path))) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const userAgent = req.headers.get("user-agent") ?? "";
    const referer = body.referer ?? req.headers.get("referer") ?? "";
    const payload = await getPayload();

    const existing = await payload.find({
      collection: "not-found-logs",
      where: { path: { equals: path } },
      limit: 1,
      depth: 0,
    });

    const now = new Date().toISOString();
    if (existing.docs[0]) {
      const d = existing.docs[0] as { id: string | number; hits?: number };
      await payload.update({
        collection: "not-found-logs",
        id: d.id,
        data: {
          hits: (d.hits ?? 1) + 1,
          lastHitAt: now,
          referer,
          userAgent,
        },
      });
    } else {
      await payload.create({
        collection: "not-found-logs",
        data: {
          path,
          hits: 1,
          firstHitAt: now,
          lastHitAt: now,
          referer,
          userAgent,
        },
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
