import type { CollectionBeforeChangeHook } from "payload";

/**
 * Auto-generate alt text for uploaded images using OpenAI Vision when
 * the editor hasn't supplied one.  Silently no-ops if OPENAI_API_KEY is
 * missing so the CMS keeps working offline.
 */
export const autoAltText: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  try {
    if (data.alt && data.alt.trim().length > 0) return data;
    if (!process.env.OPENAI_API_KEY) return data;

    const mimeType = (data.mimeType as string | undefined) ?? "";
    if (!mimeType.startsWith("image/")) return data;

    // Build an URL we can feed to OpenAI
    let url: string | undefined;
    if (data.url) {
      url = data.url as string;
    } else if (data.filename) {
      const base =
        process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
      url = `${base}/media/${data.filename}`;
    }
    if (!url) return data;

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, SEO-friendly alt text for blog images. Respond with ONLY the alt text, 8-16 words, no quotes, no prefix like 'Image of', no period at end.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Write accessible alt text for this image." },
            { type: "image_url", image_url: { url } },
          ],
        },
      ],
      max_tokens: 80,
      temperature: 0.3,
    });

    const alt = response.choices[0]?.message?.content?.trim();
    if (alt) {
      data.alt = alt.replace(/^["']|["']$/g, "").replace(/\.$/, "");
      req.payload.logger?.info?.(
        { alt: data.alt, op: operation },
        "auto-alt generated",
      );
    }
  } catch (err) {
    req.payload.logger?.warn?.({ err }, "auto-alt failed");
  }
  return data;
};
