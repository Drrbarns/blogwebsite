import { NextResponse, type NextRequest } from "next/server";
import { getPayload } from "@/lib/cms/payload";
import { flattenLexical } from "@/lib/seo/score";

export const runtime = "nodejs";

interface Suggestion {
  term: string;
  postId: string | number;
  postTitle: string;
  postSlug: string;
  score: number;
}

/**
 * Returns up to 10 suggested internal-link targets for a draft post by
 * scanning its body for phrases that match the titles of other published posts.
 *
 * POST body: { content: lexical, excludePostId?: string, focusKeyword?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      content?: unknown;
      excludePostId?: string | number;
      focusKeyword?: string;
    };

    const lex = flattenLexical(body.content);
    const bodyText = `${body.focusKeyword ?? ""} ${lex.text}`.toLowerCase();
    if (bodyText.trim().length === 0) {
      return NextResponse.json({ suggestions: [] satisfies Suggestion[] });
    }

    const payload = await getPayload();
    const posts = await payload.find({
      collection: "posts",
      where: {
        and: [
          { _status: { equals: "published" } },
          body.excludePostId
            ? { id: { not_equals: body.excludePostId } }
            : {},
        ],
      },
      limit: 200,
      depth: 0,
    });

    const suggestions: Suggestion[] = [];
    for (const raw of posts.docs) {
      const p = raw as {
        id: string | number;
        title?: string;
        slug?: string;
        seo?: { focusKeyword?: string };
      };
      const candidates = [p.title, p.seo?.focusKeyword].filter(
        (s): s is string => Boolean(s && s.trim().length > 3),
      );
      for (const term of candidates) {
        const lower = term.toLowerCase();
        if (bodyText.includes(lower)) {
          const occurrences =
            (bodyText.match(new RegExp(escapeRegex(lower), "g")) ?? []).length;
          suggestions.push({
            term,
            postId: p.id,
            postTitle: p.title ?? term,
            postSlug: p.slug ?? "",
            score: occurrences * Math.min(1, lower.length / 30),
          });
          break;
        }
      }
    }

    suggestions.sort((a, b) => b.score - a.score);
    return NextResponse.json({ suggestions: suggestions.slice(0, 10) });
  } catch (err) {
    return NextResponse.json(
      { suggestions: [], error: String((err as Error)?.message ?? err) },
      { status: 200 },
    );
  }
}

const escapeRegex = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
