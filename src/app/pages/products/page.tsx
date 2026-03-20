"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Product } from "../../types/shopify";
import { getProducts, getProductsByCollection } from "../../services/shopify";
import { useProductFilter, PRODUCTS_PER_PAGE } from "../../hooks/useProductFilter";
import ProductCard from "../../components/product/ProductCard";
import FilterDropdown from "../../components/product/FilterDropdown";
import ProductPagination from "../../components/product/ProductPagination";
import Skeleton from "../../components/ui/Skeleton";
import PageHeader from "../../components/PageHeader";

const ProductsPageContent = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Derive directly from URL — always in sync, no double-fetch
  const collectionHandle = searchParams.get("collection");
  const productTypeParam = searchParams.get("productType");

  const filter = useProductFilter(allProducts);

  // Sync productType filter with URL param (handles mount + in-page navigation)
  useEffect(() => {
    filter.setSelectedTypes(productTypeParam ? new Set([productTypeParam]) : new Set());
  }, [productTypeParam]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetched = collectionHandle
          ? await getProductsByCollection(collectionHandle, undefined, "de")
          : await getProducts(undefined, "de");
        setAllProducts(fetched);
      } catch {
        setError("Fehler beim Laden der Produkte.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [collectionHandle]);

  return (
    <div className="pb-12">
      <PageHeader
        title={collectionHandle ?? productTypeParam ?? "Alle Produkte"}
        eyebrow={collectionHandle ? "Kollektion" : productTypeParam ? "Kategorie" : "Sortiment"}
        breadcrumbs={
          collectionHandle
            ? [
                { label: "Start", href: "/" },
                { label: "Produkte", href: "/pages/products" },
                { label: collectionHandle },
              ]
            : productTypeParam
            ? [
                { label: "Start", href: "/" },
                { label: "Produkte", href: "/pages/products" },
                { label: productTypeParam },
              ]
            : [{ label: "Start", href: "/" }, { label: "Produkte" }]
        }
        count={filter.filtered.length}
        totalCount={allProducts.length}
        singularLabel="Produkt"
        pluralLabel="Produkte"
        isLoading={isLoading}
      >
        <FilterDropdown
          search={filter.search}
          sort={filter.sort}
          onlyAvailable={filter.onlyAvailable}
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
          isLoading={isLoading}
          dark
        />
      </PageHeader>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="text-center py-16">
          <p className="text-muted mb-4">{error}</p>
          <Link href="/" className="text-accent hover:underline text-sm font-medium">
            Zurück zur Startseite
          </Link>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filter.filtered.length === 0 && (
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
      {!isLoading && !error && filter.paginated.length > 0 && (
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
};

const ProductsPageFallback = () => (
  <div className="pb-12">
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
        <Skeleton.Card key={i} />
      ))}
    </div>
  </div>
);

const ProductsPage = () => (
  <Suspense fallback={<ProductsPageFallback />}>
    <ProductsPageContent />
  </Suspense>
);

export default ProductsPage;
