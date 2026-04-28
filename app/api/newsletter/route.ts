import { NextResponse, type NextRequest } from "next/server";

/**
 * Newsletter signup stub.  Phase 3 will wire this to the `subscribers`
 * collection + Resend double-opt-in.  For now we validate the email and
 * respond successfully so the UI works.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let email = "";
    if (contentType.includes("application/json")) {
      const body = (await req.json()) as { email?: string };
      email = String(body.email ?? "").trim();
    } else {
      const form = await req.formData();
      email = String(form.get("email") ?? "").trim();
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
    }

    const referer = req.headers.get("referer") ?? "/";
    // Phase 3: payload.create({ collection: 'subscribers', data: { email }})
    return NextResponse.redirect(`${new URL(referer).origin}/newsletter/thanks`, {
      status: 303,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
