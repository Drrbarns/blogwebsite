import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Called by Payload's preview button.  Enables draft mode for the current
 * browser session and redirects to the unpublished version of the page.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug");
  const collection = url.searchParams.get("collection") ?? "posts";

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid preview secret" }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  (await draftMode()).enable();

  const target =
    collection === "pages"
      ? slug === "home"
        ? "/"
        : `/${slug}`
      : `/blog/${slug}`;

  redirect(target);
}
