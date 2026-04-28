import type { CollectionAfterChangeHook } from "payload";

const endpoints = [
  "https://api.indexnow.org/IndexNow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

const resolveUrl = (collection: string, slug: string, base: string) => {
  if (collection === "posts") return `${base}/blog/${slug}`;
  if (collection === "pages") return `${base}/${slug}`;
  return `${base}/${slug}`;
};

/**
 * Ping IndexNow when a published post/page is changed, so search engines
 * re-crawl it within minutes instead of hours.
 */
export const pingIndexNow: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
  collection,
}) => {
  try {
    const host = process.env.NEXT_PUBLIC_SERVER_URL;
    const key = process.env.INDEXNOW_KEY;
    if (!host || !key) return doc;

    const currentStatus = (doc as { _status?: string })?._status;
    const previousStatus = (previousDoc as { _status?: string })?._status;
    const slug = (doc as { slug?: string })?.slug;
    if (!slug) return doc;

    const publishedNow =
      currentStatus === "published" &&
      (operation === "create" || previousStatus !== "published" || true);
    if (!publishedNow) return doc;

    const url = resolveUrl(collection.slug, slug, host);
    const hostname = new URL(host).hostname;
    const body = { host: hostname, key, urlList: [url] };

    await Promise.allSettled(
      endpoints.map((ep) =>
        fetch(ep, {
          method: "POST",
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify(body),
        }),
      ),
    );
    req.payload.logger?.info?.({ url }, "IndexNow pinged");
  } catch (err) {
    req.payload.logger?.warn?.({ err }, "IndexNow ping failed");
  }
  return doc;
};
