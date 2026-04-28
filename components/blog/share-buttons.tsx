"use client";

import { Check, Copy, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fallback */
      }
    }
    copy();
  };

  const socials = [
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
          <path d="M18.244 2H21l-6.52 7.45L22 22h-6.828l-4.77-6.235L4.8 22H2l7.02-8.03L2 2h6.914l4.32 5.71L18.244 2Zm-1.2 18h1.656L7.02 4H5.28l11.764 16Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zM8 8h4.37v2h.06c.61-1.06 2.1-2.18 4.32-2.18 4.62 0 5.47 2.76 5.47 6.35V22h-4.55v-6.2c0-1.48-.03-3.39-2.07-3.39-2.08 0-2.4 1.62-2.4 3.3V22H8V8z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
          <path d="M13 22v-9h3l.6-4H13V6.5c0-1.2.3-2 2-2h2V1.1c-.4 0-1.6-.1-3-.1-3 0-5 1.8-5 5.1V9H6v4h3v9h4z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Share on ${s.name}`}
          className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-foreground/70 hover:bg-stone-50 hover:text-foreground transition-colors"
        >
          {s.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-foreground/70 hover:bg-stone-50 hover:text-foreground transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
      </button>
      <button
        type="button"
        onClick={share}
        aria-label="Share this article"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-foreground text-white text-xs font-semibold hover:bg-foreground/90 transition-colors"
      >
        <LinkIcon className="w-3.5 h-3.5" /> Share
      </button>
    </div>
  );
}
