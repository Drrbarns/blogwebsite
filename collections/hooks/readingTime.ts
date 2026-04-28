import type { CollectionBeforeChangeHook } from "payload";

const WORDS_PER_MINUTE = 220;

const countWordsFromLexical = (node: unknown): number => {
  if (!node || typeof node !== "object") return 0;
  const n = node as Record<string, unknown>;
  let count = 0;

  if (typeof n.text === "string") {
    count += n.text.split(/\s+/).filter(Boolean).length;
  }

  const children = n.children;
  if (Array.isArray(children)) {
    for (const child of children) count += countWordsFromLexical(child);
  }

  const root = n.root;
  if (root && typeof root === "object") count += countWordsFromLexical(root);

  return count;
};

export const computeReadingTime: CollectionBeforeChangeHook = async ({
  data,
}) => {
  const words = countWordsFromLexical(data?.content);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  data.readingTime = minutes;
  return data;
};
