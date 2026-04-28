import { NextResponse, type NextRequest } from "next/server";
import { searchPosts } from "@/lib/cms";

export const runtime = "nodejs";
export const revalidate = 30;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? 10);
  const limit = Math.min(20, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 10));
  if (q.trim().length < 2) return NextResponse.json({ results: [] });
  try {
    const results = await searchPosts(q, { limit });
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { results: [], error: String((err as Error).message ?? err) },
      { status: 200 },
    );
  }
}
