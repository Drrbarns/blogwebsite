import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center gap-2 py-8"
      aria-label="Pagination"
    >
      {pages.map((page) => (
        <Link
          key={page}
          href={page === 1 ? "/blog" : `/blog?page=${page}`}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-colors",
            page === currentPage
              ? "bg-red-500 text-white"
              : "text-foreground/60 hover:text-foreground hover:bg-stone-100"
          )}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className="flex items-center justify-center w-10 h-10 rounded-full text-foreground/60 hover:text-foreground hover:bg-stone-100 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}
