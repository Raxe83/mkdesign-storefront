"use client";

import { useState, useMemo, useEffect } from "react";
import type { Product } from "../types/shopify";

export type SortOption = "newest" | "price-asc" | "price-desc" | "title-asc";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Neueste zuerst" },
  { value: "price-asc", label: "Preis aufsteigend" },
  { value: "price-desc", label: "Preis absteigend" },
  { value: "title-asc", label: "Name A–Z" },
];

export const PRODUCTS_PER_PAGE = 12;

export interface ProductFilterResult {
  // state
  search: string;
  sort: SortOption;
  onlyAvailable: boolean;
  selectedTypes: Set<string>;
  priceMin: string;
  priceMax: string;
  page: number;
  // derived
  allProductTypes: string[];
  filtered: Product[];
  paginated: Product[];
  totalPages: number;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  // actions
  setSearch: (v: string) => void;
  setSort: (v: SortOption) => void;
  setOnlyAvailable: (v: boolean | ((p: boolean) => boolean)) => void;
  setSelectedTypes: (v: Set<string> | ((p: Set<string>) => Set<string>)) => void;
  setPriceMin: (v: string) => void;
  setPriceMax: (v: string) => void;
  clearFilters: () => void;
  toggleType: (type: string) => void;
  goToPage: (n: number) => void;
}

export function useProductFilter(
  allProducts: Product[],
  initialTypes?: Set<string>
): ProductFilterResult {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    initialTypes ?? new Set()
  );
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, sort, onlyAvailable, selectedTypes, priceMin, priceMax]);

  const allProductTypes = useMemo(() => {
    const set = new Set<string>();
    for (const p of allProducts) {
      if (p.productType?.trim()) set.add(p.productType.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (onlyAvailable) {
      list = list.filter(
        (p) => p.variants.edges[0]?.node.availableForSale === true
      );
    }

    if (selectedTypes.size > 0) {
      list = list.filter((p) => selectedTypes.has(p.productType?.trim() ?? ""));
    }

    const min = priceMin !== "" ? parseFloat(priceMin) : null;
    const max = priceMax !== "" ? parseFloat(priceMax) : null;
    if (min !== null || max !== null) {
      list = list.filter((p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
        return true;
      });
    }

    switch (sort) {
      case "price-asc":
        list.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
        );
        break;
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [allProducts, search, sort, onlyAvailable, selectedTypes, priceMin, priceMax]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    onlyAvailable ||
    sort !== "newest" ||
    selectedTypes.size > 0 ||
    priceMin !== "" ||
    priceMax !== "";

  const activeFilterCount =
    (onlyAvailable ? 1 : 0) +
    selectedTypes.size +
    (sort !== "newest" ? 1 : 0) +
    (priceMin !== "" || priceMax !== "" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setOnlyAvailable(false);
    setSelectedTypes(new Set());
    setPriceMin("");
    setPriceMax("");
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const goToPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    search, sort, onlyAvailable, selectedTypes, priceMin, priceMax, page,
    allProductTypes, filtered, paginated, totalPages, hasActiveFilters, activeFilterCount,
    setSearch, setSort, setOnlyAvailable, setSelectedTypes, setPriceMin, setPriceMax,
    clearFilters, toggleType, goToPage,
  };
}
