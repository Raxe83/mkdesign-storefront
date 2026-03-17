"use client";

import { useRef, useEffect, useState } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import type {
  ProductFilterResult,
  SortOption,
} from "@/app/hooks/useProductFilter";
import { SORT_OPTIONS } from "@/app/hooks/useProductFilter";

type OpenPanel = "availability" | "price" | "type" | "sort" | null;

// ── Shared dropdown shell ─────────────────────────────────────────────────────
interface FilterButtonProps {
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({
  label,
  active,
  open,
  onClick,
  children,
}: FilterButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded border transition-colors duration-200 whitespace-nowrap ${
          active || open
            ? "border-accent text-accent bg-accent/5 dark:bg-accent/10"
            : "border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary hover:border-zinc-400 dark:hover:border-zinc-500"
        }`}
      >
        {label}
        {active && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children}
    </div>
  );
}

// ── Panel wrapper ─────────────────────────────────────────────────────────────
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 top-full mt-1.5 min-w-[200px] rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md z-50">
      {children}
    </div>
  );
}

// ── Row item (radio/check style) ──────────────────────────────────────────────
function RowItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150"
    >
      <span className={active ? "text-primary font-medium" : "text-muted"}>
        {label}
      </span>
      {active && <Check size={13} className="text-accent shrink-0" />}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export type FilterDropdownProps = Pick<
  ProductFilterResult,
  | "search"
  | "sort"
  | "onlyAvailable"
  | "selectedTypes"
  | "priceMin"
  | "priceMax"
  | "allProductTypes"
  | "hasActiveFilters"
  | "activeFilterCount"
  | "setSearch"
  | "setSort"
  | "setOnlyAvailable"
  | "setSelectedTypes"
  | "setPriceMin"
  | "setPriceMax"
  | "clearFilters"
  | "toggleType"
>;

export default function FilterDropdown({
  search,
  sort,
  onlyAvailable,
  selectedTypes,
  priceMin,
  priceMax,
  allProductTypes,
  hasActiveFilters,
  setSearch,
  setSort,
  setOnlyAvailable,
  setSelectedTypes,
  setPriceMin,
  setPriceMax,
  clearFilters,
  toggleType,
}: FilterDropdownProps) {
  const [open, setOpen] = useState<OpenPanel>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (panel: OpenPanel) =>
    setOpen((prev) => (prev === panel ? null : panel));

  const hasPriceFilter = priceMin !== "" || priceMax !== "";

  return (
    <div className="mb-8 space-y-3 z-20">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="text"
          placeholder="Suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-200"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>
      {/* Row */}
      <div ref={barRef} className="flex flex-wrap gap-2 items-center">
        {/* ── Verfügbarkeit ── */}
        <FilterButton
          label="Verfügbarkeit"
          active={onlyAvailable}
          open={open === "availability"}
          onClick={() => toggle("availability")}
        >
          <Panel>
            <div className="p-1">
              <RowItem
                label="Alle Produkte"
                active={!onlyAvailable}
                onClick={() => {
                  setOnlyAvailable(false);
                  setOpen(null);
                }}
              />
              <RowItem
                label="Nur verfügbare"
                active={onlyAvailable}
                onClick={() => {
                  setOnlyAvailable(true);
                  setOpen(null);
                }}
              />
            </div>
          </Panel>
        </FilterButton>

        {/* ── Preis ── */}
        <FilterButton
          label="Preis"
          active={hasPriceFilter}
          open={open === "price"}
          onClick={() => toggle("price")}
        >
          <Panel>
            <div className="p-3 space-y-2 w-52">
              <p className="text-[11px] uppercase tracking-widest text-muted mb-1">
                Preisbereich
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    placeholder="Von"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <span className="text-muted text-sm">–</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    placeholder="Bis"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
              {hasPriceFilter && (
                <button
                  onClick={() => {
                    setPriceMin("");
                    setPriceMax("");
                  }}
                  className="text-xs text-muted hover:text-accent transition-colors"
                >
                  Zurücksetzen
                </button>
              )}
            </div>
          </Panel>
        </FilterButton>

        {/* ── Produkttyp ── */}
        {allProductTypes.length > 0 && (
          <FilterButton
            label="Produkttyp"
            active={selectedTypes.size > 0}
            open={open === "type"}
            onClick={() => toggle("type")}
          >
            <Panel>
              <div className="p-1">
                <div className="max-h-60 overflow-y-auto">
                  {allProductTypes.map((type) => (
                    <RowItem
                      key={type}
                      label={type}
                      active={selectedTypes.has(type)}
                      onClick={() => toggleType(type)}
                    />
                  ))}
                </div>
                {selectedTypes.size > 0 && (
                  <div className="px-3 pt-2 pb-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => {
                        setSelectedTypes(new Set());
                        setOpen(null);
                      }}
                      className="text-xs text-muted hover:text-accent transition-colors"
                    >
                      Alle entfernen
                    </button>
                  </div>
                )}
              </div>
            </Panel>
          </FilterButton>
        )}

        {/* ── Sortieren nach ── */}
        <FilterButton
          label={
            sort === "newest"
              ? "Sortieren nach"
              : (SORT_OPTIONS.find((o) => o.value === sort)?.label ??
                "Sortieren nach")
          }
          active={sort !== "newest"}
          open={open === "sort"}
          onClick={() => toggle("sort")}
        >
          <Panel>
            <div className="p-1">
              {SORT_OPTIONS.map((o) => (
                <RowItem
                  key={o.value}
                  label={o.label}
                  active={sort === o.value}
                  onClick={() => {
                    setSort(o.value);
                    setOpen(null);
                  }}
                />
              ))}
            </div>
          </Panel>
        </FilterButton>

        {/* Reset all */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors duration-200 ml-1"
          >
            <X size={13} />
            Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
