/**
 * Walks a Lexical document and extracts internal and external URLs so the
 * broken-link-checker can probe them.
 */
export const flattenLexicalLinks = (
  doc: unknown,
): { internal: string[]; external: string[] } => {
  const internal: string[] = [];
  const external: string[] = [];
  const root = (doc as { root?: { children?: unknown[] } })?.root;
  if (!root?.children) return { internal, external };

  const walk = (nodes: unknown[]) => {
    for (const raw of nodes) {
      const node = raw as {
        type?: string;
        children?: unknown[];
        url?: string;
        fields?: { url?: string; linkType?: string };
      };
      if (node.type === "link" || node.type === "autolink") {
        const url = node.fields?.url ?? node.url ?? "";
        if (url.startsWith("/")) internal.push(url);
        else if (/^https?:\/\//i.test(url)) external.push(url);
      }
      if (Array.isArray(node.children)) walk(node.children);
    }
  };
  walk(root.children);
  return {
    internal: Array.from(new Set(internal)),
    external: Array.from(new Set(external)),
  };
};
