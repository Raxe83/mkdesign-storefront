"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  goToPage: (n: number) => void;
}

function buildPages(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 2) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

export default function ProductPagination({
  page,
  totalPages,
  goToPage,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-center gap-1.5">
        <button
          onClick={() => goToPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Vorherige Seite"
          className="p-2 rounded border border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {buildPages(page, totalPages).map((item, i) =>
          item === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 text-center text-sm text-muted select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => goToPage(item as number)}
              className={`w-9 h-9 text-sm rounded border transition-colors duration-200 ${
                page === item
                  ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-medium"
                  : "border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Nächste Seite"
          className="p-2 rounded border border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Seite {page} von {totalPages}
      </p>
    </div>
  );
}
