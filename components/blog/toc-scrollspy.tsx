"use client";

import { useEffect, useState } from "react";

interface Item {
  id: string;
  text: string;
  depth: number;
}

export function TocScrollSpy({ items }: { items: Item[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <ul className="space-y-2 text-sm">
      {items.map((t) => (
        <li key={t.id} style={{ paddingLeft: (t.depth - 2) * 12 }}>
          <a
            href={`#${t.id}`}
            onClick={(e) => {
              const target = document.getElementById(t.id);
              if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 96, behavior: "smooth" });
                history.replaceState(null, "", `#${t.id}`);
              }
            }}
            className={
              activeId === t.id
                ? "text-foreground font-semibold"
                : "text-foreground/60 hover:text-foreground"
            }
          >
            {t.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
