"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS, type PageSizeOption } from "../../hooks/useProductFilter";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  totalFiltered: number;
  pageSize: PageSizeOption;
  goToPage: (n: number) => void;
  setPageSize: (v: PageSizeOption) => void;
}

function buildPages(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

const btnBase =
  "h-9 rounded border transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
const btnNav =
  `${btnBase} w-9 flex items-center justify-center border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary hover:border-zinc-400 dark:hover:border-zinc-500`;

export default function ProductPagination({
  page,
  totalPages,
  totalFiltered,
  pageSize,
  goToPage,
  setPageSize,
}: ProductPaginationProps) {
  const from = Math.min((page - 1) * pageSize + 1, totalFiltered);
  const to   = Math.min(page * pageSize, totalFiltered);

  const PageSizeSelect = () => (
    <select
      id="page-size-select"
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value) as PageSizeOption)}
      className="text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-transparent text-primary px-2 py-1.5 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-200 focus:outline-none"
    >
      {PAGE_SIZE_OPTIONS.map((size) => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
  );

  return (
    <div className="mt-12 space-y-3">

      {/* ── Mobile ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        {/* Prev */}
        <button
          onClick={() => goToPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Vorherige Seite"
          className={btnNav}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Center: page indicator + info */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-medium text-primary tabular-nums">
            {page} / {totalPages}
          </span>
          <span className="text-[0.65rem] text-muted tabular-nums">
            {from}–{to} von {totalFiltered}
          </span>
        </div>

        {/* Next */}
        <button
          onClick={() => goToPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Nächste Seite"
          className={btnNav}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Mobile: Pro-Seite + schnelle Seiten-Sprünge */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Pro Seite</span>
          <PageSizeSelect />
        </div>
        {/* Quick jumps: first, prev-group, next-group, last */}
        {totalPages > 2 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={page === 1}
              className="h-7 px-2 text-xs rounded border border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
            >
              1
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={page === totalPages}
              className="h-7 px-2 text-xs rounded border border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {totalPages}
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className="hidden sm:flex items-center justify-between gap-4">

        {/* Info */}
        <p className="text-xs text-muted shrink-0 tabular-nums">
          {totalFiltered > 0 ? `${from}–${to} von ${totalFiltered}` : "0 Produkte"}
        </p>

        {/* Page buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Vorherige Seite"
              className={btnNav}
            >
              <ChevronLeft size={16} />
            </button>

            {buildPages(page, totalPages).map((item, i) =>
              item === "…" ? (
                <span key={`el-${i}`} className="w-9 text-center text-sm text-muted select-none">
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
              className={btnNav}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Pro Seite */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="page-size-select" className="text-xs text-muted">
            Pro Seite
          </label>
          <PageSizeSelect />
        </div>
      </div>
    </div>
  );
}
