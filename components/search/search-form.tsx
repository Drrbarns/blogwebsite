"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchForm({
  defaultValue = "",
  autoFocus = false,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="flex items-center gap-2 bg-white border border-stone-200 rounded-full pl-5 pr-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-foreground/10"
    >
      <Search className="w-5 h-5 text-foreground/60" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        placeholder="Search articles, authors, topics…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 py-2 outline-none bg-transparent placeholder:text-foreground/40"
      />
      <button
        type="submit"
        className="inline-flex items-center px-5 py-2.5 rounded-full bg-foreground text-white font-semibold text-sm hover:bg-foreground/90 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
