import { shopifyFetch } from "./client";
import type {
  Product,
  ProductZusatzoptionen,
  ZusatzoptionenRaw,
  ZusatzproduktOption,
} from "../../types/shopify";

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
    if (tag !== "CustomDesign") queryParts.push(`-tag:CustomDesign`);

    const response: ProductsResponse = await shopifyFetch<ProductsResponse>({
      query: PRODUCTS_QUERY,
      variables: {
        first: limit,
        after: cursor ?? undefined,
        query: queryParts.join(" AND ") || undefined,
      },
      locale,
    });

    const edges = response.products.edges;
    const pageInfo = response.products.pageInfo;

    all.push(...edges.map((e) => e.node));
    hasNextPage = pageInfo.hasNextPage && (first === undefined || all.length < first);
    cursor = pageInfo.endCursor;
  }

  return all;
}

export async function getProductByHandle(
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
  });

  const product = response.productByHandle;
  if (!product) return null;

  const rawRef = product.metafield?.reference ?? null;
  const zusatzoptionen = rawRef ? parseZusatzoptionen(rawRef) : null;
  const { metafield: _drop, ...cleanProduct } = product;
  return { ...cleanProduct, zusatzoptionen };
}

export async function getFeaturedProducts(
  first = 4,
  locale?: string,
): Promise<Product[]> {
  return getProducts(first, locale);
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
