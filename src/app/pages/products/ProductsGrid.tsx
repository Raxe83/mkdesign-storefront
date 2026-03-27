"use client";

import Link from "next/link";
import type { Product } from "../../types/shopify";
import { useProductFilter, PRODUCTS_PER_PAGE } from "../../hooks/useProductFilter";
import ProductCard from "../../components/product/ProductCard";
import FilterDropdown from "../../components/product/FilterDropdown";
import ProductPagination from "../../components/product/ProductPagination";
import Skeleton from "../../components/ui/Skeleton";
import PageHeader from "../../components/PageHeader";

interface Props {
  allProducts: Product[];
  collectionIds: string[] | null;
  initialType: string | null;
  collectionHandle: string | null;
}

export default function ProductsGrid({
  allProducts,
  collectionIds,
  initialType,
  collectionHandle,
}: Props) {
  const collectionIdSet = collectionIds ? new Set(collectionIds) : null;
  const initialTypes = initialType ? new Set([initialType]) : undefined;
  const filter = useProductFilter(allProducts, initialTypes, collectionIdSet);

  return (
    <div className="pb-12">
      <PageHeader
        title={collectionHandle ?? initialType ?? "Alle Produkte"}
        eyebrow={collectionHandle ? "Kollektion" : initialType ? "Kategorie" : "Sortiment"}
        breadcrumbs={
          collectionHandle
            ? [
                { label: "Start", href: "/" },
                { label: "Produkte", href: "/pages/products" },
                { label: collectionHandle },
              ]
            : initialType
            ? [
                { label: "Start", href: "/" },
                { label: "Produkte", href: "/pages/products" },
                { label: initialType },
              ]
            : [{ label: "Start", href: "/" }, { label: "Produkte" }]
        }
        count={filter.filtered.length}
        totalCount={allProducts.length}
        singularLabel="Produkt"
        pluralLabel="Produkte"
        isLoading={false}
      >
        <FilterDropdown
          search={filter.search}
          sort={filter.sort}
          selectedTypes={filter.selectedTypes}
          priceMin={filter.priceMin}
          priceMax={filter.priceMax}
          allProductTypes={filter.allProductTypes}
          hasActiveFilters={filter.hasActiveFilters}
          activeFilterCount={filter.activeFilterCount}
          setSearch={filter.setSearch}
          setSort={filter.setSort}
          setOnlyAvailable={filter.setOnlyAvailable}
          setSelectedTypes={filter.setSelectedTypes}
          setPriceMin={filter.setPriceMin}
          setPriceMax={filter.setPriceMax}
          clearFilters={filter.clearFilters}
          toggleType={filter.toggleType}
          isLoading={false}
          dark
        />
      </PageHeader>

      {/* Empty */}
      {filter.filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-display text-lg text-primary mb-1">
            Keine Produkte gefunden
          </p>
          <p className="text-sm text-muted mb-5">Versuche andere Filter oder Suchbegriffe.</p>
          {filter.hasActiveFilters && (
            <button
              onClick={filter.clearFilters}
              className="text-sm text-accent hover:underline"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* Grid + Pagination */}
      {filter.paginated.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filter.paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <ProductPagination
            page={filter.page}
            totalPages={filter.totalPages}
            totalFiltered={filter.filtered.length}
            pageSize={filter.pageSize}
            goToPage={filter.goToPage}
            setPageSize={filter.setPageSize}
          />
        </>
      )}
    </div>
  );
}
