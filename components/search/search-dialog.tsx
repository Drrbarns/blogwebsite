"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/types";

/**
 * Command-palette-style search triggered by ⌘K / Ctrl-K or the navbar icon.
 * Hits /api/search for live typeahead; full results live on /search.
 */
export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setResults([]);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("aboutagirl:open-search", () => setOpen(true));
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
      } catch {
        /* abort */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const s = q.trim();
            if (!s) return;
            router.push(`/search?q=${encodeURIComponent(s)}`);
            close();
          }}
          className="flex items-center gap-3 px-5 py-4 border-b border-stone-100"
        >
          <Search className="w-5 h-5 text-foreground/60" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search articles…"
            className="flex-1 outline-none text-base bg-transparent"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-foreground/50 hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </form>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && <div className="p-5 text-sm text-muted">Searching…</div>}
          {!loading && q.length >= 2 && results.length === 0 && (
            <div className="p-5 text-sm text-muted">No articles match “{q}”.</div>
          )}
          {results.length > 0 && (
            <ul className="divide-y divide-stone-100">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/blog/${r.slug}`);
                      close();
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-stone-50 flex flex-col gap-1"
                  >
                    <span className="font-semibold">{r.title}</span>
                    <span className="text-xs text-muted line-clamp-1">{r.excerpt}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {q.length < 2 && (
            <div className="p-5 text-sm text-muted">
              Tip: press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-xs">⌘K</kbd> any
              time to open search.
            </div>
          )}
        </div>
        <div className="px-5 py-3 bg-stone-50 text-xs text-muted flex items-center justify-between">
          <span>Press Enter to see all results</span>
          <a href="/search" onClick={close} className="font-semibold text-foreground hover:text-accent">
            Go to search →
          </a>
        </div>
      </div>
    </div>
  );
}
