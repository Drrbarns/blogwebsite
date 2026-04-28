import Link from "next/link";
import type { TrendingItem } from "@/types";

interface BlogTrendingStripProps {
  items: TrendingItem[];
}

export function BlogTrendingStrip({ items }: BlogTrendingStripProps) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-4">
      <div className="border-t border-b border-stone-200 py-4">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-4 min-w-max">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4">
                {idx > 0 && (
                  <span className="w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" />
                )}
                <Link
                  href={`/blog/${item.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors whitespace-nowrap">
                    {item.title}
                  </span>
                </Link>
                <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-foreground/60 rounded-full whitespace-nowrap">
                  Recent
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
