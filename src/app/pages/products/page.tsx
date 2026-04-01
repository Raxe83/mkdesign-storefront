import { getProductsByCollection } from "../../services/shopify";
import { getProductsPage, getProductTypes, type ShopifySortKey } from "../../services/shopify/products";
import ProductsGrid from "./ProductsGrid";
import ProductsGridPaged from "./ProductsGridPaged";
type PageSizeOption = 15 | 30 | 40;
const VALID_PAGE_SIZES = [15, 30, 40] as const;

interface SearchParams {
  collection?: string;
  productType?: string;
  type?: string;
  q?: string;
  sort?: string;
  min?: string;
  max?: string;
  available?: string;
  page?: string;
  per?: string;
}

function buildSortParams(sort: string): { sortKey: ShopifySortKey; reverse: boolean } {
  switch (sort) {
    case "newest":     return { sortKey: "CREATED_AT", reverse: true };
    case "price-asc":  return { sortKey: "PRICE",       reverse: false };
    case "price-desc": return { sortKey: "PRICE",       reverse: true };
    case "title-asc":  return { sortKey: "TITLE",       reverse: false };
    default:           return { sortKey: "BEST_SELLING", reverse: false };
  }
}

function buildShopifyQuery(params: { search?: string; types?: string[]; priceMin?: string; priceMax?: string }): string {
  const parts = ["-tag:CustomDesign"];
  if (params.search?.trim()) parts.push(params.search.trim());
  if (params.types && params.types.length === 1) {
    parts.push(`product_type:"${params.types[0].replace(/"/g, "")}"`);
  } else if (params.types && params.types.length > 1) {
    parts.push(`(${params.types.map((t) => `product_type:"${t.replace(/"/g, "")}"`).join(" OR ")})`);
  }
  if (params.priceMin) parts.push(`price:>=${params.priceMin}`);
  if (params.priceMax) parts.push(`price:<=${params.priceMax}`);
  return parts.join(" AND ");
}

function parsePageSize(val: string | undefined): PageSizeOption {
  const n = parseInt(val ?? "15", 10);
  return (VALID_PAGE_SIZES.includes(n as PageSizeOption) ? n : 15) as PageSizeOption;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { collection, productType } = params;

  // ── Collection mode: load all collection products, client-side filtering ──
  if (collection) {
    const collectionProducts = await getProductsByCollection(collection, undefined, "de");
    return (
      <ProductsGrid
        key={`collection-${collection}`}
        allProducts={collectionProducts}
        collectionIds={null}
        initialType={productType ?? params.type ?? null}
        collectionHandle={collection}
      />
    );
  }

  // ── Server pagination mode ─────────────────────────────────────────────────
  const typeParam = params.type ?? productType;
  const types = typeParam ? typeParam.split(",").filter(Boolean) : undefined;
  const { sortKey, reverse } = buildSortParams(params.sort ?? "best_selling");
  const shopifyQuery = buildShopifyQuery({
    search: params.q,
    types,
    priceMin: params.min,
    priceMax: params.max,
  });
  const pageNum  = Math.max(1, parseInt(params.page ?? "1", 10));
  const pageSize = parsePageSize(params.per);

  const [pageData, allProductTypes] = await Promise.all([
    getProductsPage({ page: pageNum, pageSize, query: shopifyQuery, sortKey, reverse, locale: "de" }),
    getProductTypes("de"),
  ]);

  return (
    <ProductsGridPaged
      products={pageData.products}
      filteredCount={pageData.filteredCount}
      totalCount={pageData.totalCount}
      totalPages={pageData.totalPages}
      currentPage={pageData.page}
      currentPageSize={pageSize}
      allProductTypes={allProductTypes}
      collectionHandle={null}
    />
  );
}
