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
  dark?: boolean;
}

function FilterButton({ label, active, open, onClick, children, dark }: FilterButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm border transition-colors duration-200 whitespace-nowrap ${
          active || open
            ? dark
              ? "border-rust text-rust bg-rust/15"
              : "border-accent text-accent bg-accent/5 dark:bg-accent/10"
            : dark
              ? "border-white/20 text-white/55 hover:border-white/40 hover:text-white/90"
              : "border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary hover:border-zinc-400 dark:hover:border-zinc-500"
        }`}
      >
        {label}
        {active && (
          <span className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-rust" : "bg-accent"}`} />
        )}
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
    <div className="absolute left-0 top-full mt-1.5 min-w-[200px] rounded-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md z-[9990]">
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
      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150"
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
> & { dark?: boolean; isLoading?: boolean };

export default function FilterDropdown({
  search,
  sort,
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
  dark = false,
  isLoading = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState<OpenPanel>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    const onScroll = () => setOpen(null);
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggle = (panel: OpenPanel) =>
    setOpen((prev) => (prev === panel ? null : panel));

  const hasPriceFilter = priceMin !== "" || priceMax !== "";

  const inputCls = dark
    ? "bg-white/10 border-white/20 text-white placeholder:text-white/35 focus:ring-rust focus:border-rust/40"
    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-primary placeholder:text-muted focus:ring-accent";

  const sortLabel =
    sort === "best_selling"
      ? "Sortieren nach"
      : (SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sortieren nach");

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-white/35" : "text-muted"}`}
        />
        <input
          type="text"
          placeholder="Suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-8 py-2 text-sm rounded-sm border focus:outline-none focus:ring-1 transition-colors duration-200 ${inputCls}`}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="Suche leeren"
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors ${dark ? "text-white/35 hover:text-white/70" : "text-muted hover:text-primary"}`}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div ref={barRef} className="flex flex-wrap gap-2 items-center">

        {/* ── Preis ── */}
        <FilterButton
          label="Preis"
          active={hasPriceFilter}
          open={open === "price"}
          onClick={() => toggle("price")}
          dark={dark}
        >
          <Panel>
            <div className="p-3 space-y-2 w-52">
              <p className="text-[11px] uppercase tracking-widest text-muted mb-1">Preisbereich</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Von"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm rounded-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-muted text-sm shrink-0">–</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Bis"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm rounded-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              {hasPriceFilter && (
                <button onClick={() => { setPriceMin(""); setPriceMax(""); }} className="text-xs text-muted hover:text-accent transition-colors">
                  Zurücksetzen
                </button>
              )}
            </div>
          </Panel>
        </FilterButton>

        {/* ── Produkttyp ── */}
        {isLoading ? (
          <div className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm border animate-pulse ${
            dark ? "border-white/15 bg-white/10" : "border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
          }`}>
            <div className={`h-3 w-20 rounded ${dark ? "bg-white/20" : "bg-zinc-300 dark:bg-zinc-600"}`} />
            <div className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-white/20" : "bg-zinc-300 dark:bg-zinc-600"}`} />
          </div>
        ) : allProductTypes.length > 0 ? (
          <FilterButton
            label="Produkttyp"
            active={selectedTypes.size > 0}
            open={open === "type"}
            onClick={() => toggle("type")}
            dark={dark}
          >
            <Panel>
              <div className="p-1">
                <div className="max-h-60 overflow-y-auto">
                  {allProductTypes.map((type) => (
                    <RowItem key={type} label={type} active={selectedTypes.has(type)} onClick={() => toggleType(type)} />
                  ))}
                </div>
                {selectedTypes.size > 0 && (
                  <div className="px-3 pt-2 pb-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button onClick={() => { setSelectedTypes(new Set()); setOpen(null); }} className="text-xs text-muted hover:text-accent transition-colors">
                      Alle entfernen
                    </button>
                  </div>
                )}
              </div>
            </Panel>
          </FilterButton>
        ) : null}

        {/* ── Sortieren ── */}
        <FilterButton
          label={sortLabel}
          active={sort !== "best_selling"}
          open={open === "sort"}
          onClick={() => toggle("sort")}
          dark={dark}
        >
          <Panel>
            <div className="p-1">
              {SORT_OPTIONS.map((o) => (
                <RowItem key={o.value} label={o.label} active={sort === o.value} onClick={() => { setSort(o.value); setOpen(null); }} />
              ))}
            </div>
          </Panel>
        </FilterButton>

        {/* Reset all */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`flex items-center gap-1 text-xs transition-colors duration-200 ml-1 ${dark ? "text-white/40 hover:text-white/70" : "text-muted hover:text-primary"}`}
          >
            <X size={13} />
            Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
