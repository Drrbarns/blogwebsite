import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from "payload";
import { revalidatePath, revalidateTag } from "next/cache";

type Doc = { slug?: string; previousSlug?: string };

/**
 * Bust Next.js ISR cache on publish/update.  Uses `{ expire: 0 }` so the
 * cached values are invalidated immediately (CMS writes require read-your-
 * own-writes semantics from the reader's perspective).
 */
const EXPIRE_NOW = { expire: 0 } as const;

const revalidate = (doc: Doc, collection: string, req: PayloadRequest) => {
  try {
    const { slug } = doc ?? {};

    if (collection === "posts") {
      revalidateTag("posts", EXPIRE_NOW);
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath(`/rss.xml`);
      revalidatePath(`/feed.atom`);
      revalidatePath(`/feed.json`);
      if (slug) revalidatePath(`/blog/${slug}`);
    }

    if (collection === "pages") {
      revalidateTag("pages", EXPIRE_NOW);
      if (slug === "home") {
        revalidatePath("/");
      } else if (slug) {
        revalidatePath(`/${slug}`);
      }
    }

    if (collection === "categories") {
      revalidateTag("categories", EXPIRE_NOW);
      revalidatePath("/");
      revalidatePath("/blog");
      if (slug) revalidatePath(`/blog/category/${slug}`);
    }

    if (collection === "tags") {
      revalidateTag("tags", EXPIRE_NOW);
      revalidatePath("/");
      revalidatePath("/blog");
      if (slug) revalidatePath(`/blog/tag/${slug}`);
    }

    if (collection === "users") {
      revalidateTag("authors", EXPIRE_NOW);
      if (slug) revalidatePath(`/authors/${slug}`);
    }
  } catch (err) {
    req.payload.logger?.warn?.(
      { err },
      "revalidate hook failed (likely outside request scope)",
    );
  }
};

export const revalidateAfterChange =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    revalidate(doc as Doc, collection, req);
    return doc;
  };

export const revalidateAfterDelete =
  (collection: string): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    revalidate(doc as Doc, collection, req);
    return doc;
  };
