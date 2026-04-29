/**
 * One-shot brand refresh.
 *
 *   npm run update-brand
 *
 * Pushes the latest values from `lib/data/site-config.ts` into the
 * `site-settings` and `navigation` globals — without touching About,
 * Contact, Features pages or any seeded content.
 *
 * Safe to run multiple times.
 */
import type { getPayload as GetPayloadFn } from "payload";

// Switch to Supabase's transaction-mode pooler (port 6543) so the script can
// run while Vercel holds session-mode (5432) connections.
if (process.env.DATABASE_URI) {
  const next = process.env.DATABASE_URI.replace(":5432/", ":6543/");
  if (next !== process.env.DATABASE_URI) {
    process.env.DATABASE_URI = next;
    console.log("[brand] using transaction-mode pooler (port 6543)");
  }
}

const log = (...args: unknown[]) => console.log("[brand]", ...args);

async function main() {
  if (!process.env.DATABASE_URI) {
    throw new Error("DATABASE_URI is not set — copy .env.local.example first");
  }

  log("connecting to Payload...");
  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  const { siteConfig } = await import("../lib/data/site-config");

  type PayloadInstance = Awaited<ReturnType<typeof GetPayloadFn>>;
  const payload: PayloadInstance = await getPayload({ config });

  try {
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        brand: {
          name: siteConfig.name,
          tagline: "Faith. Sport. Medicine. Life in between.",
          description: siteConfig.description,
        },
        seo: {
          titleTemplate: `%s — ${siteConfig.name}`,
          defaultTitle: siteConfig.name,
          defaultDescription: siteConfig.description,
          twitter: "@aboutagirl",
        },
        contact: {
          email: siteConfig.contact.email,
          phone: siteConfig.contact.phone,
          address: siteConfig.contact.address,
        },
      } as never,
    });
    log("site-settings updated");
  } catch (err) {
    log("site-settings update failed:", (err as Error).message);
  }

  try {
    const current = (await payload.findGlobal({
      slug: "navigation",
    })) as Record<string, unknown>;

    await payload.updateGlobal({
      slug: "navigation",
      data: {
        ...current,
        brand: { label: siteConfig.name, tagline: "A girl with many sides." },
        cta: { label: "Contact us", url: "/contact", enabled: true },
      } as never,
    });
    log("navigation brand + CTA updated (links/columns preserved)");
  } catch (err) {
    log("navigation update failed:", (err as Error).message);
  }

  log("done");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
