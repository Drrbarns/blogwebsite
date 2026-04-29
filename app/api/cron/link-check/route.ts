import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getPayload } from "@/lib/cms/payload";
import { flattenLexicalLinks } from "@/lib/link-check";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_POSTS = 50;
const TIMEOUT_MS = 8000;

const timingSafe = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Authorised either via Vercel Cron (CRON_SECRET header) or by a signed
 * admin trigger (?secret=...). Results are upserted into the `link-health`
 * collection so editors can filter for broken links.
 */
export async function GET(req: NextRequest) {
  const cronHeader = req.headers.get("authorization");
  const providedSecret = req.nextUrl.searchParams.get("secret") ?? "";
  const expected = process.env.CRON_SECRET ?? "";
  const ok =
    (cronHeader && cronHeader === `Bearer ${expected}`) ||
    (expected && timingSafe(providedSecret, expected));

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayload();
  const posts = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    limit: MAX_POSTS,
    depth: 0,
    sort: "-updatedAt",
  });

  let checked = 0;
  let broken = 0;

  for (const raw of posts.docs) {
    const post = raw as { id: string | number; content?: unknown };
    const links = flattenLexicalLinks(post.content).external;
    for (const url of links) {
      if (!/^https?:\/\//i.test(url)) continue;
      const result = await probe(url);
      checked += 1;
      if (result.status === "broken" || result.status === "timeout") broken += 1;
      await upsertLinkHealth(payload, post.id, url, result);
    }
  }

  return NextResponse.json({
    ok: true,
    postsScanned: posts.docs.length,
    linksChecked: checked,
    broken,
  });
}

type ProbeResult = {
  status: "ok" | "redirect" | "broken" | "timeout";
  statusCode?: number;
  responseMs?: number;
  error?: string;
};

const probe = async (url: string): Promise<ProbeResult> => {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "AboutAGirl-LinkChecker/1.0" },
    });
    clearTimeout(t);
    const ms = Date.now() - start;
    if (res.status >= 300 && res.status < 400) {
      return { status: "redirect", statusCode: res.status, responseMs: ms };
    }
    if (res.status >= 400) {
      return { status: "broken", statusCode: res.status, responseMs: ms };
    }
    return { status: "ok", statusCode: res.status, responseMs: ms };
  } catch (err) {
    const error = err as { name?: string; message?: string };
    if (error?.name === "AbortError") {
      return { status: "timeout", error: "timeout" };
    }
    return { status: "broken", error: error?.message ?? "unknown" };
  }
};

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>;

const upsertLinkHealth = async (
  payload: PayloadInstance,
  sourcePost: string | number,
  url: string,
  result: ProbeResult,
) => {
  try {
    const existing = await payload.find({
      collection: "link-health",
      where: { url: { equals: url } },
      limit: 1,
      depth: 0,
    });
    const payloadData = {
      url,
      status: result.status,
      statusCode: result.statusCode,
      responseMs: result.responseMs,
      error: result.error,
      sourcePost,
      checkedAt: new Date().toISOString(),
    };
    if (existing.docs[0]) {
      await payload.update({
        collection: "link-health",
        id: (existing.docs[0] as { id: string | number }).id,
        data: payloadData,
      });
    } else {
      await payload.create({ collection: "link-health", data: payloadData });
    }
  } catch (err) {
    payload.logger?.warn?.({ err, url }, "link-health upsert failed");
  }
};
