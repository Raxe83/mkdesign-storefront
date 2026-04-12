import { unstable_cache } from "next/cache";
import { shopifyFetch } from "./client";
import type {
  Product,
  ProductZusatzoptionen,
  ZusatzoptionenRaw,
  ZusatzproduktOption,
} from "../../types/shopify";
import { HIDDEN_TAGS, HIDDEN_TAGS_QUERY, VISIBILITY_TAGS_QUERY, filterHiddenProducts, filterVisibilityHidden } from "../../utils/productVisibility";

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((v) => typeof v === "string");
  } catch {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function parseZusatzoptionen(raw: ZusatzoptionenRaw): ProductZusatzoptionen {
  const get = (key: string) => raw.fields.find((f) => f.key === key) ?? null;

  const zusatzprodukteNodes = get("zusatzprodukte")?.references?.nodes ?? [];
  const zusatzprodukte: ZusatzproduktOption[] = zusatzprodukteNodes
    .map((n): ZusatzproduktOption | null => {
      if (n.id && n.title && n.handle && n.priceRange && n.variants?.edges?.length) {
        return {
          id: n.id,
          title: n.title,
          handle: n.handle,
          featuredImage: n.featuredImage ?? null,
          price: n.priceRange.minVariantPrice,
          defaultVariantId: n.variants.edges[0].node.id,
        };
      }
      if (n.id && n.price && n.product?.id && n.product?.title && n.product?.handle) {
        return {
          id: n.product.id,
          title: n.product.title,
          handle: n.product.handle,
          featuredImage: n.product.featuredImage ?? null,
          price: n.product.priceRange?.minVariantPrice ?? n.price,
          defaultVariantId: n.id,
        };
      }
      return null;
    })
    .filter((n): n is ZusatzproduktOption => n !== null);

  return {
    textfelder: parseList(get("textfeld")?.value ?? null),
    zusatzprodukte,
    optionen:   parseList(get("optionen")?.value ?? null),
    entscheide: parseList(get("entscheide")?.value ?? null),
    farben:     parseList(get("farben")?.value ?? null),
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, sortKey: BEST_SELLING, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          tags
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

type ProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string };
    edges: Array<{ node: Product }>;
  };
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export async function getProducts(
  first?: number,
  locale?: string,
  tag?: string,
): Promise<Product[]> {
  const BATCH = 250;
  const all: Product[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const limit = first ? Math.min(BATCH, first - all.length) : BATCH;

    const queryParts: string[] = [];
    if (tag) queryParts.push(`tag:${tag}`);
    if (tag !== "CustomDesign") {
      // Exclude all hidden tags (both spellings of display_none + CustomDesign)
      HIDDEN_TAGS.forEach((t) => queryParts.push(`-tag:${t}`));
    } else {
      // For CustomDesign queries, still exclude visibility-hidden products
      queryParts.push(VISIBILITY_TAGS_QUERY);
    }

    const response: ProductsResponse = await shopifyFetch<ProductsResponse>({
      query: PRODUCTS_QUERY,
      variables: {
        first: limit,
        after: cursor ?? undefined,
        query: queryParts.join(" AND ") || undefined,
      },
      locale,
      revalidate: 3600,
      tags: ["shopify-products"],
    });

    const edges = response.products.edges;
    const pageInfo = response.products.pageInfo;

    // Post-filter safety net (handles both spellings from Shopify)
    const nodes = edges.map((e) => e.node);
    all.push(...(tag === "CustomDesign" ? filterVisibilityHidden(nodes) : filterHiddenProducts(nodes)));
    hasNextPage = pageInfo.hasNextPage && (first === undefined || all.length < first);
    cursor = pageInfo.endCursor;
  }

  return all;
}

async function _getProductByHandle(
  handle: string,
  locale?: string,
): Promise<Product | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        tags
        productType
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        metafield(namespace: "custom", key: "layout_konfiguration") {
          reference {
            ... on Metaobject {
              id
              fields {
                key
                value
                references(first: 30) {
                  nodes {
                    ... on Product {
                      id
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            id
                          }
                        }
                      }
                    }
                    ... on ProductVariant {
                      id
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        id
                        title
                        handle
                        featuredImage {
                          url
                          altText
                        }
                        priceRange {
                          minVariantPrice {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  type ProductWithMeta = Product & {
    metafield?: { reference?: ZusatzoptionenRaw | null } | null;
  };

  const response = await shopifyFetch<{ productByHandle: ProductWithMeta | null }>({
    query,
    variables: { handle },
    locale,
    revalidate: 3600,
    tags: ["shopify-products"],
  });

  const product = response.productByHandle;
  if (!product) return null;

  const rawRef = product.metafield?.reference ?? null;
  const zusatzoptionen = rawRef ? parseZusatzoptionen(rawRef) : null;
  const { metafield: _drop, ...cleanProduct } = product;
  return { ...cleanProduct, zusatzoptionen };
}

// ─── Design-Editor Produkte (CustomDesign-Tag + Zusatzoptionen-Metafeld) ──────

const DESIGN_PRODUCTS_QUERY = `
  query getDesignProducts($first: Int!, $query: String) {
    products(first: $first, sortKey: BEST_SELLING, query: $query) {
      edges {
        node {
          id title handle description tags productType
          featuredImage { url altText }
          variants(first: 1) {
            edges { node { id title price { amount currencyCode } availableForSale } }
          }
          priceRange { minVariantPrice { amount currencyCode } }
          metafield(namespace: "custom", key: "layout_konfiguration") {
            reference {
              ... on Metaobject {
                id
                fields {
                  key value
                  references(first: 10) {
                    nodes {
                      ... on Product {
                        id title handle
                        featuredImage { url altText }
                        priceRange { minVariantPrice { amount currencyCode } }
                        variants(first: 1) { edges { node { id } } }
                      }
                      ... on ProductVariant {
                        id
                        price { amount currencyCode }
                        product {
                          id title handle
                          featuredImage { url altText }
                          priceRange { minVariantPrice { amount currencyCode } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type DesignProductRaw = Product & {
  metafield?: { reference?: ZusatzoptionenRaw | null } | null;
};

export async function getDesignProducts(
  locale?: string,
): Promise<(Product & { zusatzoptionen: ReturnType<typeof parseZusatzoptionen> | null })[]> {
  const response = await shopifyFetch<{
    products: { edges: Array<{ node: DesignProductRaw }> };
  }>({
    query: DESIGN_PRODUCTS_QUERY,
    variables: { first: 50, query: "tag:CustomDesign" },
    locale,
    revalidate: 3600,
    tags: ["shopify-products"],
  });

  return response.products.edges.map(({ node: product }) => {
    const rawRef = product.metafield?.reference ?? null;
    const zusatzoptionen = rawRef ? parseZusatzoptionen(rawRef) : null;
    const { metafield: _drop, ...cleanProduct } = product;
    return { ...cleanProduct, zusatzoptionen };
  });
}

export const getProductByHandle = unstable_cache(
  _getProductByHandle,
  ["product-by-handle"],
  { revalidate: 3600, tags: ["shopify-products"] },
);

export async function getFeaturedProducts(
  first = 4,
  locale?: string,
): Promise<Product[]> {
  return getProducts(first, locale);
}

// ─── Paginated list view (lean, no images array) ──────────────────────────────

const PRODUCTS_LIST_QUERY = `
  query getProductsPage($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id title handle description tags productType
          priceRange { minVariantPrice { amount currencyCode } }
          featuredImage { url altText }
          variants(first: 1) {
            edges { node { id title price { amount currencyCode } availableForSale } }
          }
        }
      }
    }
  }
`;

const CURSOR_ONLY_QUERY = `
  query getCursors($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo { hasNextPage endCursor }
      edges { node { id } }
    }
  }
`;

const PRODUCT_TYPES_QUERY = `
  query { productTypes(first: 250) { edges { node } } }
`;

export type ShopifySortKey = "BEST_SELLING" | "CREATED_AT" | "PRICE" | "TITLE";

export interface ProductsPageResult {
  products: Product[];
  filteredCount: number;
  totalCount: number;
  page: number;
  totalPages: number;
}

type CursorCountResult = { cursor: string | undefined; total: number };

/**
 * Traverses products with only id fields (fast, ISR-cached).
 * Returns the cursor after `targetCursorPosition` items AND the total count.
 * targetCursorPosition = 0 → count-only mode (cursor will be undefined).
 */
async function getCountAndCursor(params: {
  targetCursorPosition: number;
  query: string | undefined;
  sortKey: ShopifySortKey;
  reverse: boolean;
  locale?: string;
}): Promise<CursorCountResult> {
  const { targetCursorPosition, query, sortKey, reverse, locale } = params;
  let afterCursor: string | undefined;
  let total = 0;
  let pageCursor: string | undefined;
  let hasNext = true;

  while (hasNext) {
    const needed = targetCursorPosition - total;
    // Fetch exactly what's needed to reach the cursor position, then 250 at a time
    const take = needed > 0 ? Math.min(250, needed) : 250;
    const res = await shopifyFetch<{
      products: { pageInfo: { hasNextPage: boolean; endCursor: string }; edges: { node: { id: string } }[] };
    }>({ query: CURSOR_ONLY_QUERY, variables: { first: take, after: afterCursor, query, sortKey, reverse }, locale, revalidate: 3600 });

    total += res.products.edges.length;
    afterCursor = res.products.pageInfo.endCursor;
    hasNext = res.products.pageInfo.hasNextPage;

    if (pageCursor === undefined && targetCursorPosition > 0 && total >= targetCursorPosition) {
      pageCursor = afterCursor; // cursor after the targetCursorPosition-th item
    }
    if (!hasNext) break;
  }
  return { cursor: pageCursor, total };
}

export async function getProductsPage(params: {
  page?: number;
  pageSize?: number;
  query?: string;
  sortKey?: ShopifySortKey;
  reverse?: boolean;
  locale?: string;
}): Promise<ProductsPageResult> {
  const { page = 1, pageSize = 15, query, sortKey = "BEST_SELLING", reverse = false, locale } = params;
  const targetCursorPosition = (page - 1) * pageSize;
  const UNFILTERED = HIDDEN_TAGS_QUERY;

  // Parallel: (a) traverse filtered products for cursor + filteredCount,
  //           (b) traverse unfiltered products for totalCount
  const [{ cursor, total: filteredCount }, { total: totalCount }] = await Promise.all([
    getCountAndCursor({ targetCursorPosition, query, sortKey, reverse, locale }),
    getCountAndCursor({ targetCursorPosition: 0, query: UNFILTERED, sortKey: "BEST_SELLING", reverse: false, locale }),
  ]);

  const res = await shopifyFetch<{
    products: { pageInfo: { hasNextPage: boolean }; edges: { node: Product }[] };
  }>({ query: PRODUCTS_LIST_QUERY, variables: { first: pageSize, after: cursor, query, sortKey, reverse }, locale, revalidate: 3600, tags: ["shopify-products"] });

  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
  return {
    products: filterHiddenProducts(res.products.edges.map((e) => e.node)),
    filteredCount,
    totalCount,
    page,
    totalPages,
  };
}

export async function getProductTypes(locale?: string): Promise<string[]> {
  const res = await shopifyFetch<{ productTypes: { edges: { node: string }[] } }>({
    query: PRODUCT_TYPES_QUERY,
    locale,
    revalidate: 86400,
    tags: ["shopify-products"],
  });
  return res.productTypes.edges.map((e) => e.node).filter((t) => t && t !== "CustomDesign");
}

export async function fetchBlogPost(locale?: string) {
  const query = `
    query {
      blog(handle: "message_container") {
        articles(first: 5) {
          edges {
            node {
              title
              tags
              handle
              content
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      blog: {
        articles: {
          edges: { node: { title: string; content: string; tags: string[] } }[];
        };
      };
    }>({ query, locale });

    if (data.blog) return data.blog.articles.edges;
  } catch {
    // silently return undefined
  }
}
