import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type LexicalNode = {
  type?: string;
  tag?: string;
  format?: number | string;
  text?: string;
  version?: number;
  url?: string;
  fields?: Record<string, unknown>;
  children?: LexicalNode[];
  value?: unknown;
  relationTo?: string;
  listType?: "bullet" | "number" | "check";
  [k: string]: unknown;
};

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;

const textWithFormat = (node: LexicalNode): ReactNode => {
  let el: ReactNode = node.text ?? "";
  const fmt = typeof node.format === "number" ? node.format : 0;
  if (fmt & IS_CODE) el = <code>{el}</code>;
  if (fmt & IS_BOLD) el = <strong>{el}</strong>;
  if (fmt & IS_ITALIC) el = <em>{el}</em>;
  if (fmt & IS_UNDERLINE) el = <u>{el}</u>;
  if (fmt & IS_STRIKETHROUGH) el = <s>{el}</s>;
  if (fmt & IS_SUBSCRIPT) el = <sub>{el}</sub>;
  if (fmt & IS_SUPERSCRIPT) el = <sup>{el}</sup>;
  return el;
};

const renderChildren = (children?: LexicalNode[]): ReactNode =>
  children?.map((c, i) => <Fragment key={i} node={c} />);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getText = (node: LexicalNode): string => {
  if (typeof node.text === "string") return node.text;
  if (!node.children) return "";
  return node.children.map(getText).join("");
};

function Fragment({ node }: { node: LexicalNode }) {
  if (!node) return null;

  switch (node.type) {
    case "text":
      return <>{textWithFormat(node)}</>;

    case "linebreak":
      return <br />;

    case "heading": {
      const tag = (node.tag as string) || "h2";
      const id = slugify(getText(node));
      const Comp = tag as keyof React.JSX.IntrinsicElements;
      return <Comp id={id}>{renderChildren(node.children)}</Comp>;
    }

    case "paragraph":
      return <p>{renderChildren(node.children)}</p>;

    case "quote":
      return <blockquote>{renderChildren(node.children)}</blockquote>;

    case "list": {
      const Tag = node.listType === "number" ? "ol" : "ul";
      return <Tag>{renderChildren(node.children)}</Tag>;
    }

    case "listitem":
      return <li>{renderChildren(node.children)}</li>;

    case "horizontalrule":
      return <hr />;

    case "link": {
      const url = (node.fields as { url?: string })?.url ?? node.url ?? "#";
      const newTab = (node.fields as { newTab?: boolean })?.newTab;
      const isInternal = url.startsWith("/");
      if (isInternal) {
        return <Link href={url}>{renderChildren(node.children)}</Link>;
      }
      return (
        <a
          href={url}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
        >
          {renderChildren(node.children)}
        </a>
      );
    }

    case "upload": {
      const val = node.value as
        | {
            url?: string;
            alt?: string;
            filename?: string;
          }
        | undefined;
      const src = val?.url;
      if (!src) return null;
      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={val?.alt ?? ""}
            width={1200}
            height={700}
            className="rounded-2xl w-full h-auto"
          />
          {node.fields && (node.fields as { caption?: string }).caption ? (
            <figcaption>{String((node.fields as { caption?: string }).caption)}</figcaption>
          ) : null}
        </figure>
      );
    }

    case "block": {
      const fields = (node.fields ?? {}) as Record<string, unknown>;
      const blockType = fields.blockType as string | undefined;
      if (blockType === "callout") {
        const variant = String(fields.variant ?? "info");
        const variantClass: Record<string, string> = {
          info: "border-l-4 border-sky-400 bg-sky-50",
          warning: "border-l-4 border-amber-400 bg-amber-50",
          success: "border-l-4 border-emerald-400 bg-emerald-50",
          quote: "border-l-4 border-stone-900 bg-stone-100 italic",
        };
        return (
          <aside className={`${variantClass[variant] ?? variantClass.info} px-5 py-4 rounded-lg my-6`}>
            {fields.title ? <strong>{String(fields.title)}</strong> : null}
            {fields.body ? <p className="mt-1">{String(fields.body)}</p> : null}
          </aside>
        );
      }
      if (blockType === "codeBlock") {
        return (
          <pre className="overflow-auto bg-stone-900 text-stone-100 rounded-lg p-4 my-6 text-sm">
            <code>{String(fields.code ?? "")}</code>
          </pre>
        );
      }
      if (blockType === "embed") {
        const url = String(fields.url ?? "");
        if (!url) return null;
        return (
          <div className="my-6 aspect-video rounded-2xl overflow-hidden">
            <iframe
              src={url}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              loading="lazy"
            />
          </div>
        );
      }
      return null;
    }

    case "root":
      return <>{renderChildren(node.children)}</>;

    default:
      return <>{renderChildren(node.children)}</>;
  }
}

/**
 * Minimal server-side Lexical renderer.  Deliberately avoids client runtime —
 * the post page is 100% server-rendered for SEO.
 */
export function LexicalContent({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") return null;
  const root = (data as { root?: LexicalNode }).root;
  if (!root) return null;
  return (
    <div className="prose prose-stone max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent prose-img:rounded-2xl">
      <Fragment node={root} />
    </div>
  );
}

/**
 * Extract a flat TOC from the Lexical doc for the "On this page" sidebar.
 */
export function extractToc(data: unknown): { id: string; text: string; depth: number }[] {
  if (!data || typeof data !== "object") return [];
  const toc: { id: string; text: string; depth: number }[] = [];
  const walk = (node: LexicalNode) => {
    if (node.type === "heading") {
      const text = getText(node);
      const depth = Number(String(node.tag ?? "h2").replace("h", "")) || 2;
      if (text) toc.push({ id: slugify(text), text, depth });
    }
    node.children?.forEach(walk);
  };
  const root = (data as { root?: LexicalNode }).root;
  if (root) walk(root);
  return toc;
}
