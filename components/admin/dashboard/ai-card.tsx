import * as React from "react";
import Link from "next/link";

interface Props {
  adminBase: string;
  enabled: boolean;
}

export function AICard({ adminBase, enabled }: Props) {
  return (
    <section className="om-dash__panel om-dash__panel--ai">
      <div className="om-dash__ai-glow" aria-hidden />
      <div className="om-dash__ai-meta">
        <span className="om-dash__ai-pill">
          <span className="om-dash__ai-spark" aria-hidden />
          Groq assist
        </span>
        <span
          className={`om-dash__ai-status om-dash__ai-status--${enabled ? "on" : "off"}`}
        >
          {enabled ? "Connected · Llama 4 Scout" : "Add GROQ_API_KEY"}
        </span>
      </div>

      <h2 className="om-dash__ai-title">
        Ship faster with{" "}
        <span className="om-dash__ai-highlight">contextual AI</span>.
      </h2>
      <p className="om-dash__ai-copy">
        Generate alt text from your photos with Llama 4 Scout on Groq, mine
        internal links from your archive, and let the studio draft SEO snippets
        while you write.
      </p>

      <ul className="om-dash__ai-list">
        <li>
          <span className="om-dash__ai-bullet" aria-hidden>
            ✦
          </span>
          <strong>Auto alt-text</strong> for every image upload.
        </li>
        <li>
          <span className="om-dash__ai-bullet" aria-hidden>
            ↬
          </span>
          <strong>Smart internal links</strong> suggested from your archive.
        </li>
        <li>
          <span className="om-dash__ai-bullet" aria-hidden>
            ⚙
          </span>
          <strong>SEO scoring</strong> baked into every save.
        </li>
      </ul>

      <div className="om-dash__ai-actions">
        <Link
          className="om-dash__ai-cta"
          href={`${adminBase}/collections/media`}
        >
          Run alt-text on the library <span aria-hidden>→</span>
        </Link>
        <a
          className="om-dash__ai-link"
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noreferrer"
        >
          Manage Groq key
        </a>
      </div>
    </section>
  );
}
