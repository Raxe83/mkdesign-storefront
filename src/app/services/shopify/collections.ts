import { shopifyFetch } from "./client";
import type { Product } from "../../types/shopify";
import { ShopifyCollection } from "../../components/CollectionsList";

export async function getCollections(
  first = 6,
  locale?: string,
): Promise<ShopifyCollection[]> {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            products(first: 4) {
              edges {
                node {
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
  `;

  const response = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>({
    query,
    variables: { first },
    locale,
    revalidate: 3600,
  });

  return response.collections.edges.map((edge) => edge.node);
}

export async function getProductsByCollection(
  collectionHandle: string,
  first?: number,
  locale?: string,
): Promise<Product[]> {
  const BATCH = 250;
  const query = `
    query getProductsByCollection($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        products(first: $first, after: $after) {
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
    }
  `;

  type CollectionResponse = {
    collection: {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        edges: Array<{ node: Product }>;
      };
    } | null;
  };

  const all: Product[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const limit = first ? Math.min(BATCH, first - all.length) : BATCH;

    const res = await shopifyFetch<CollectionResponse>({
      query,
      variables: { handle: collectionHandle, first: limit, after: cursor ?? undefined },
      locale,
      revalidate: 3600,
    });

    if (!res.collection) return [];

    const edges: Array<{ node: Product }> = res.collection.products.edges;
    const pageInfo: { hasNextPage: boolean; endCursor: string } = res.collection.products.pageInfo;
    all.push(
      ...edges
        .map((e: { node: Product }) => e.node)
        .filter((p: Product) => !p.tags.includes("CustomDesign")),
    );

    hasNextPage = pageInfo.hasNextPage && (first === undefined || all.length < first);
    cursor = pageInfo.endCursor;
  }

  return all;
}
