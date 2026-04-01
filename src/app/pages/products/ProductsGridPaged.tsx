"use client";

import { Suspense } from "react";
import type { Product } from "../../types/shopify";
import type { PageSizeOption } from "../../hooks/useProductFilter";
import { useProductPageParams } from "../../hooks/useProductPageParams";
import ProductCard from "../../components/product/ProductCard";
import FilterDropdown from "../../components/product/FilterDropdown";
import ProductPagination from "../../components/product/ProductPagination";
import PageHeader from "../../components/PageHeader";

interface Props {
  products: Product[];
  filteredCount: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: PageSizeOption;
  allProductTypes: string[];
  collectionHandle: string | null;
}

function Inner({ products, filteredCount, totalCount, totalPages, currentPage, currentPageSize, allProductTypes, collectionHandle }: Props) {
  const params = useProductPageParams();

  return (
    <div className="pb-12">
      <PageHeader
        title={collectionHandle ?? "Alle Produkte"}
        eyebrow={collectionHandle ? "Kollektion" : "Sortiment"}
        breadcrumbs={
          collectionHandle
            ? [{ label: "Start", href: "/" }, { label: "Produkte", href: "/pages/products" }, { label: collectionHandle.toUpperCase() }]
            : [{ label: "Start", href: "/" }, { label: "Produkte" }]
        }
        count={filteredCount}
        totalCount={totalCount}
        singularLabel="Produkt"
        pluralLabel="Produkte"
        isLoading={false}
      >
        <FilterDropdown
          search={params.search}
          sort={params.sort}
          selectedTypes={params.selectedTypes}
          priceMin={params.priceMin}
          priceMax={params.priceMax}
          allProductTypes={allProductTypes}
          hasActiveFilters={params.hasActiveFilters}
          activeFilterCount={params.activeFilterCount}
          setSearch={params.setSearch}
          setSort={params.setSort}
          setOnlyAvailable={params.setOnlyAvailable}
          setSelectedTypes={params.setSelectedTypes}
          setPriceMin={params.setPriceMin}
          setPriceMax={params.setPriceMax}
          clearFilters={params.clearFilters}
          toggleType={params.toggleType}
          isLoading={false}
          dark
        />
      </PageHeader>

      {filteredCount === 0 && (
        <div className="text-center py-20">
          <p className="font-display text-lg text-primary mb-1">Keine Produkte gefunden</p>
          <p className="text-sm text-muted mb-5">Versuche andere Filter oder Suchbegriffe.</p>
          {params.hasActiveFilters && (
            <button onClick={params.clearFilters} className="text-sm text-accent hover:underline">
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {products.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>

          <ProductPagination
            page={currentPage}
            totalPages={totalPages}
            totalFiltered={filteredCount}
            pageSize={currentPageSize}
            goToPage={params.goToPage}
            setPageSize={params.setPageSize}
          />
        </>
      )}
    </div>
  );
}

export default function ProductsGridPaged(props: Props) {
  return (
    <Suspense>
      <Inner {...props} />
    </Suspense>
  );
}
