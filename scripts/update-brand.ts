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
import { getPayload } from "payload";
import config from "../payload.config";
import { siteConfig } from "../lib/data/site-config";

const log = (...args: unknown[]) => console.log("[brand]", ...args);

async function main() {
  if (!process.env.DATABASE_URI) {
    throw new Error("DATABASE_URI is not set — copy .env.local.example first");
  }

  log("connecting to Payload...");
  const payload = await getPayload({ config });

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
      } as never,
    });
    log("navigation brand updated (links/columns preserved)");
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
