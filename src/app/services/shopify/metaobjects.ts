import { shopifyFetch } from "./client";
import type { Metaobject } from "../../types/shopify";

const METAOBJECT_QUERY = `
  query getMetaobjectsByType($type: String!) {
    metaobjects(type: $type, first: 10) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            type
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface MetaobjectResponse {
  metaobjects: { edges: Array<{ node: Metaobject }> };
}

/**
 * Fetch category-specific extra info from a Shopify Metaobject.
 * Builds the type as `{category}_extra_info` (hyphens → underscores).
 * Cached via Next.js ISR (revalidates every hour).
 *
 * @example
 *   getExtraInfoByType("stehtisch")   // → stehtisch_extra_info
 *   getExtraInfoByType("3d-druck")    // → 3d_druck_extra_info
 */
export async function getExtraInfoByType(
  category: string,
): Promise<Metaobject[]> {
  const metaobjectType = `${category.replace(/-/g, "_")}_extra_info`;
  try {
    const data = await shopifyFetch<MetaobjectResponse>({
      query: METAOBJECT_QUERY,
      variables: { type: metaobjectType },
      revalidate: 3600,
    });
    return data.metaobjects.edges.map((e) => e.node);
  } catch {
    return [];
  }
}
