import type { CollectionBeforeChangeHook } from "payload";

/**
 * Auto-generate alt text for uploaded images using Groq vision
 * (Llama 4 Scout) when the editor hasn't supplied one.  Silently
 * no-ops if GROQ_API_KEY is missing so the CMS keeps working offline.
 */
export const autoAltText: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  try {
    if (data.alt && data.alt.trim().length > 0) return data;
    if (!process.env.GROQ_API_KEY) return data;

    const mimeType = (data.mimeType as string | undefined) ?? "";
    if (!mimeType.startsWith("image/")) return data;

    let url: string | undefined;
    if (data.url) {
      url = data.url as string;
    } else if (data.filename) {
      const base =
        process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
      url = `${base}/media/${data.filename}`;
    }
    if (!url) return data;

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
                "Write concise, SEO-friendly alt text for this blog image (8–16 words). " +
                "Respond with ONLY the alt text — no quotes, no period, no prefix like 'Image of'.",
            },
            { type: "image_url", image_url: { url } },
          ],
        },
      ],
      max_completion_tokens: 80,
      temperature: 0.3,
    });

    const alt = response.choices[0]?.message?.content?.trim();
    if (alt) {
      data.alt = alt.replace(/^["']|["']$/g, "").replace(/\.$/, "");
      req.payload.logger?.info?.(
        { alt: data.alt, op: operation },
        "auto-alt generated (groq)",
      );
    }
  } catch (err) {
    req.payload.logger?.warn?.({ err }, "auto-alt failed");
  }
  return data;
};
