import { NextResponse, type NextRequest } from "next/server";

/**
 * Contact form endpoint.
 *
 * Phase 3 will persist messages into a `contact-messages` collection and
 * (optionally) email them to `SiteSettings.contact.email` via Resend.  For
 * now we validate input and respond OK so the UI works end-to-end.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name) {
      return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }
    if (message.length > 0 && message.length < 5) {
      return NextResponse.json({ ok: false, error: "Message is too short." }, { status: 400 });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[contact]", { name, email, len: message.length });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
