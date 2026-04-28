import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * On-demand alt-text generator.  Admin UI calls this with an image URL
 * (from the Media doc) when the editor clicks "Generate alt with AI".
 */
export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = (await req.json()) as { imageUrl?: string };
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 501 },
      );
    }

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, SEO-friendly alt text. Respond with ONLY the alt text, 8-16 words, no quotes, no period.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Write accessible alt text for this image." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 80,
      temperature: 0.3,
    });

    const alt = response.choices[0]?.message?.content
      ?.trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\.$/, "");
    return NextResponse.json({ alt });
  } catch (err) {
    return NextResponse.json(
      { error: String((err as Error)?.message ?? err) },
      { status: 500 },
    );
  }
}
