"use client";

import { cn } from "@/app/utils/utils";
import { SHAPE_CATALOG, SHAPE_CATEGORIES } from "../constants";
import type { FabricConf } from "../types";
import { ShapeIcon } from "./ShapeIcon";

const PAGE_SIZE = 15;

type Props = {
  shapeCat:           string;
  shapePage:          number;
  onCategoryChange:   (cat: string) => void;
  onPageChange:       (page: number) => void;
  addShapeFromCatalog: (fc: FabricConf) => void;
};

export function ShapesPanel({ shapeCat, shapePage, onCategoryChange, onPageChange, addShapeFromCatalog }: Props) {
  const filtered   = SHAPE_CATALOG.filter((s) => shapeCat === "Alle" || s.cat === shapeCat);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const page       = Math.min(shapePage, totalPages - 1);
  const visible    = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-2">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1">
        {SHAPE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium transition-colors duration-150 cursor-pointer",
              shapeCat === cat
                ? "bg-rust text-white"
                : "bg-stone-100 dark:bg-zinc-800 text-muted hover:text-rust",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shape grid */}
      <div className="grid grid-cols-3 gap-1">
        {visible.map((s) => (
          <button
            key={s.id}
            onClick={() => addShapeFromCatalog(s.fc)}
            title={s.label}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2.5",
              "rounded border border-stone-200/80 dark:border-zinc-700/80",
              "text-[10px] font-medium text-stone dark:text-muted",
              "transition-all duration-200 cursor-pointer",
              "hover:border-rust/40 hover:bg-rustLight dark:hover:bg-zinc-800 hover:text-rust",
              "active:scale-95",
            )}
          >
            <span className="h-7 w-7 opacity-75">
              <ShapeIcon fc={s.fc} />
            </span>
            <span className="leading-none truncate w-full text-center px-0.5">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-2 py-1 rounded text-[10px] font-medium text-muted hover:text-rust disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
          >
            ← Zurück
          </button>
          <span className="text-[10px] text-muted tabular-nums">{page + 1} / {totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-2 py-1 rounded text-[10px] font-medium text-muted hover:text-rust disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
          >
            Weiter →
          </button>
        </div>
      )}
    </div>
  );
}
