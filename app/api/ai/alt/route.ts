import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * On-demand alt-text generator powered by Groq vision (Llama 4 Scout).
 * Admin UI calls this with an image URL (from the Media doc) when the
 * editor clicks "Generate alt with AI".
 */
export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = (await req.json()) as { imageUrl?: string };
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
    }
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 501 },
      );
    }

    const { default: Groq } = await import("groq-sdk");
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await client.chat.completions.create({
      model:
        process.env.GROQ_VISION_MODEL ??
        "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Write concise, SEO-friendly alt text for this image (8–16 words). " +
                "Respond with ONLY the alt text — no quotes, no period, no prefix like 'Image of'.",
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_completion_tokens: 80,
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
