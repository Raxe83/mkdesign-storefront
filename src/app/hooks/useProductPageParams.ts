"use client";

import { useCallback, useState, useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SortOption, PageSizeOption } from "./useProductFilter";
import { PAGE_SIZE_OPTIONS } from "./useProductFilter";

function parsePerPage(val: string | null): PageSizeOption {
  const n = parseInt(val ?? "15", 10);
  return (PAGE_SIZE_OPTIONS.includes(n as PageSizeOption) ? n : 15) as PageSizeOption;
}

function parseTypes(val: string | null): Set<string> {
  return val ? new Set(val.split(",").filter(Boolean)) : new Set<string>();
}

export function useProductPageParams() {
  const [isPending, startTransition] = useTransition();
  const router   = useRouter();
  const pathname = usePathname();
  const sp       = useSearchParams();

  const urlSearch  = sp.get("q") ?? "";
  const urlSort    = (sp.get("sort") ?? "best_selling") as SortOption;
  const urlTypes   = parseTypes(sp.get("type"));
  const urlMin     = sp.get("min") ?? "";
  const urlMax     = sp.get("max") ?? "";
  const urlPage    = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const urlPerPage = parsePerPage(sp.get("per"));

  const [search, setSearch]     = useState(urlSearch);
  const [priceMin, setPriceMin] = useState(urlMin);
  const [priceMax, setPriceMax] = useState(urlMax);

  // Sync local state from URL (back/forward navigation)
  useEffect(() => { setSearch(urlSearch); }, [urlSearch]);
  useEffect(() => { setPriceMin(urlMin); }, [urlMin]);
  useEffect(() => { setPriceMax(urlMax); }, [urlMax]);

  const push = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    if (!("page" in updates)) params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }, [router, pathname, sp, startTransition]);

  // Keep latest push in ref to avoid stale closures in debounce timeouts
  const pushRef = useRef(push);
  useEffect(() => { pushRef.current = push; }, [push]);
  const urlSearchRef = useRef(urlSearch);
  useEffect(() => { urlSearchRef.current = urlSearch; }, [urlSearch]);
  const urlMinRef = useRef(urlMin);
  useEffect(() => { urlMinRef.current = urlMin; }, [urlMin]);
  const urlMaxRef = useRef(urlMax);
  useEffect(() => { urlMaxRef.current = urlMax; }, [urlMax]);

  // Debounce: search → URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== urlSearchRef.current) pushRef.current({ q: search || null });
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Debounce: price → URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (priceMin !== urlMinRef.current || priceMax !== urlMaxRef.current) {
        pushRef.current({ min: priceMin || null, max: priceMax || null });
      }
    }, 600);
    return () => clearTimeout(t);
  }, [priceMin, priceMax]);

  const setSort = useCallback((v: SortOption) => push({ sort: v === "best_selling" ? null : v }), [push]);

  const setOnlyAvailable = useCallback((v: boolean | ((p: boolean) => boolean)) => {
    const cur = sp.get("available") === "1";
    push({ available: (typeof v === "function" ? v(cur) : v) ? "1" : null });
  }, [push, sp]);

  const setSelectedTypes = useCallback((v: Set<string> | ((p: Set<string>) => Set<string>)) => {
    const next = typeof v === "function" ? v(urlTypes) : v;
    push({ type: next.size > 0 ? [...next].join(",") : null });
  }, [push, urlTypes]);

  const toggleType = useCallback((t: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  }, [setSelectedTypes]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setPriceMin("");
    setPriceMax("");
    push({ q: null, sort: null, type: null, min: null, max: null, available: null, page: null });
  }, [push]);

  const goToPage = useCallback((n: number) => {
    const urlParams = new URLSearchParams(sp.toString());
    if (n <= 1) urlParams.delete("page"); else urlParams.set("page", String(n));
    const qs = urlParams.toString();
    // setTimeout(0) breaks out of React's event batching so the scroll
    // is guaranteed to run after any pending DOM updates
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }, [router, pathname, sp, startTransition]);

  const setPageSize = useCallback((size: PageSizeOption) => {
    push({ per: size === PAGE_SIZE_OPTIONS[0] ? null : String(size), page: null });
  }, [push]);

  const hasActiveFilters =
    urlSearch !== "" || urlSort !== "best_selling" || urlTypes.size > 0 || urlMin !== "" || urlMax !== "";
  const activeFilterCount =
    urlTypes.size + (urlSort !== "best_selling" ? 1 : 0) + (urlMin !== "" || urlMax !== "" ? 1 : 0);

  return {
    search, sort: urlSort, onlyAvailable: sp.get("available") === "1",
    selectedTypes: urlTypes, priceMin, priceMax,
    page: urlPage, pageSize: urlPerPage,
    hasActiveFilters, activeFilterCount, isPending,
    setSearch, setSort, setOnlyAvailable, setSelectedTypes,
    setPriceMin, setPriceMax, clearFilters, toggleType, goToPage, setPageSize,
  };
}
