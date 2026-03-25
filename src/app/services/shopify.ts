import { ShopifyCollection } from "../components/CollectionsList";
import type { Cart, Product, ProductZusatzoptionen, ZusatzproduktOption, ZusatzoptionenRaw } from "../types/shopify";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Hilfsfunktion für GraphQL-Anfragen
async function shopifyFetch<T>({
  query,
  variables = {},
  locale,
  revalidate,
}: {
  query: string;
  variables?: Record<string, unknown>;
  locale?: string;
  /** Next.js ISR revalidation in seconds. Omit for no caching. */
  revalidate?: number | false;
}): Promise<T> {
  const variablesWithLocale = locale ? { ...variables, locale } : variables;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN as string,
    };

    if (locale) headers["Accept-Language"] = locale;

    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables: variablesWithLocale }),
        ...(revalidate !== undefined && { next: { revalidate } }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shopify API error response:", errorText);
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorText}`,
      );
    }

    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors.map((e: any) => e.message).join("\n"));
    }

    return result.data as T;
  } catch (error) {
    console.error("Error fetching from Shopify:", error);
    throw error;
  }
}

export const updateItemQuantity = async (
  cartId: string,
  lineId: string,
  quantity: number,
) => {
  const response = await fetch(`/api/carts/${cartId}/lines/${lineId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }), // Menge, die aktualisiert werden soll
  });

  if (!response.ok) {
    throw new Error("Failed to update item quantity");
  }

  const updatedCart = await response.json(); // Nimm den aktualisierten Warenkorb
  return updatedCart; // Gib den neuen Warenkorb zurück
};

// Produkte abrufen mit optionaler Sprachunterstützung
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

// Shopify Storefront API erlaubt maximal 250 Produkte pro Request.
// Bei mehr als 250 Produkten wird cursor-basierte Pagination verwendet.
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
      variables: { first: limit, after: cursor ?? undefined, query: queryParts.join(" AND ") || undefined },
      locale,
    });

    const edges: Array<{ node: Product }> = response.products.edges;
    const pageInfo: { hasNextPage: boolean; endCursor: string } =
      response.products.pageInfo;

    all.push(...edges.map((e) => e.node));

    hasNextPage =
      pageInfo.hasNextPage && (first === undefined || all.length < first);
    cursor = pageInfo.endCursor;
  }

  return all;
}

export const fetchBlogPost = async (locale?: string) => {
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
    // Aufruf von shopifyFetch, um Blog-Daten abzurufen
    const data = await shopifyFetch<{
      blog: {
        articles: {
          edges: {
            node: {
              title: string;
              content: string;
              tags: string[];
            };
          }[];
        };
      };
    }>({
      query,
      locale, // Übergebe locale nur, wenn es angegeben wurde
    });

    // Erfolgreiche Antwort
    if (data.blog) {
      return data.blog.articles.edges;
    } else {
      console.log("Keine Blog-Daten gefunden");
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Blog-Artikel:", error);
  }
};

// ─── Hilfsfunktion: parst die rohen Metaobjekt-Felder ────────────────────────

/**
 * Wandelt das rohe Metaobjekt-Reference-Objekt in die typsichere
 * `ProductZusatzoptionen`-Struktur um.
 *
 * - `feld_1_label` / `feld_2_label` → einfache Strings
 * - `farbauswahl` → JSON-Array-String wird zu `string[]` geparst
 *   (Shopify speichert List-Felder als `'["Schwarz","Silber"]'`)
 */
function parseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((v) => typeof v === "string");
  } catch {
    // Fallback: kommagetrennt
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function parseZusatzoptionen(raw: ZusatzoptionenRaw): ProductZusatzoptionen {
  const get = (key: string) => raw.fields.find((f) => f.key === key) ?? null;

  const zusatzprodukteNodes = get("zusatzprodukte")?.references?.nodes ?? [];
  const zusatzprodukte: ZusatzproduktOption[] = zusatzprodukteNodes
    .map((n): ZusatzproduktOption | null => {
      // product_reference: Node hat title/handle/priceRange/variants direkt
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
      // variant_reference: Node hat price + product-Sub-Objekt
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

// ─── Produkt nach Handle abrufen ──────────────────────────────────────────────

/**
 * Lädt ein einzelnes Produkt anhand seines Handles.
 * Enthält das Produkt ein `custom.layout_konfiguration`-Metafeld (Referenz auf
 * ein `custom.zusatzoptionen`-Metaobjekt), wird es automatisch geparst und
 * als `zusatzoptionen` auf dem Produkt zurückgegeben.
 */
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

  // Erweiterter Response-Typ: das Metafeld ist nicht im Product-Interface enthalten,
  // weil es nur hier abgefragt wird und dann normalisiert wird.
  type ProductWithMeta = Product & {
    metafield?: {
      reference?: ZusatzoptionenRaw | null;
    } | null;
  };

  try {
    const response = await shopifyFetch<{ productByHandle: ProductWithMeta | null }>({
      query,
      variables: { handle },
      locale,
    });

    const product = response.productByHandle;
    if (!product) return null;

    // Metaobjekt-Referenz parsen und normalisiert anhängen
    console.log("[getProductByHandle] raw metafield:", JSON.stringify(product.metafield));
    const rawRef = product.metafield?.reference ?? null;
    const zusatzoptionen = rawRef ? parseZusatzoptionen(rawRef) : null;

    // metafield-Feld aus dem Rückgabe-Objekt entfernen (ist kein Teil des Product-Interface)
    const { metafield: _drop, ...cleanProduct } = product;
    return { ...cleanProduct, zusatzoptionen };
  } catch (error) {
    console.error("Error in getProductByHandle:", error);
    throw error;
  }
}

// Kollektionen abrufen mit optionaler Sprachunterstützung
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
    locale, // Übergebe locale nur, wenn es angegeben wurde
  });

  return response.collections.edges.map((edge) => edge.node);
}

// Get products by collection mit optionaler Sprachunterstützung und vollständiger Pagination
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

    const response: CollectionResponse = await shopifyFetch<CollectionResponse>({
      query,
      variables: {
        handle: collectionHandle,
        first: limit,
        after: cursor ?? undefined,
      },
      locale,
    });

    if (!response.collection) return [];

    const edges: Array<{ node: Product }> = response.collection.products.edges;
    const pageInfo: { hasNextPage: boolean; endCursor: string } = response.collection.products.pageInfo;
    all.push(...edges.map((e: { node: Product }) => e.node).filter((p) => !p.tags.includes("CustomDesign")));

    hasNextPage =
      pageInfo.hasNextPage && (first === undefined || all.length < first);
    cursor = pageInfo.endCursor;
  }

  return all;
}

// Empfohlene Produkte abrufen mit optionaler Sprachunterstützung
export async function getFeaturedProducts(
  first = 4,
  locale?: string,
): Promise<Product[]> {
  // In einer realen App würdest du eine spezielle Kollektion für empfohlene Produkte haben
  // Hier verwenden wir einfach die ersten paar Produkte
  return getProducts(first, locale);
}

// Warenkorb erstellen
export async function createCart(): Promise<Cart> {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      featuredImage {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
    query,
  });
  return response.cartCreate.cart;
}

export const addToCart = async (
  cartId: string,
  variantId: string,
  quantity: number,
  customAttributes?: { key: string; value: string }[],
  locale?: string,
  additionalLines?: Array<{ variantId: string; quantity: number; customAttributes?: { key: string; value: string }[] }>,
): Promise<Cart> => {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
        attributes: customAttributes || [],
      },
      ...(additionalLines ?? []).map((l) => ({
        merchandiseId: l.variantId,
        quantity: l.quantity,
        attributes: l.customAttributes ?? [],
      })),
    ],
  };

  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
    query,
    variables,
    locale, // Übergebe locale nur, wenn es angegeben wurde
  });

  return data.cartLinesAdd.cart;
};

// Warenkorb abrufen mit optionaler Sprachunterstützung
export async function getCart(
  cartId: string,
  locale?: string,
): Promise<Cart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              attributes {
                key
                value
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cart: Cart | null }>({
    query,
    variables: { cartId },
    locale, // Übergebe locale nur, wenn es angegeben wurde
  });

  return response.cart;
}

// Update cart item
export async function updateCartItem(
  cartId: string,
  lineId: string,
  quantity: number,
  locale?: string,
): Promise<Cart> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        quantity,
      },
    ],
  };

  const response = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
    query,
    variables,
    locale, // Übergebe locale nur, wenn es angegeben wurde
  });

  return response.cartLinesUpdate.cart;
}

// Remove cart item
export async function removeCartItem(
  cartId: string,
  lineId: string,
  locale?: string,
): Promise<Cart> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId],
  };

  const response = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
    query,
    variables,
    locale, // Übergebe locale nur, wenn es angegeben wurde
  });

  return response.cartLinesRemove.cart;
}

// ─── Metaobjects ─────────────────────────────────────────────────────────────

import type { Metaobject } from "../types/shopify";

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
 * Fetch a single Shopify Metaobject by handle + type.
 * Cached via Next.js ISR (revalidates every hour).
 *
 * @example
 *   const obj = await getMetaobjectByHandle("homepage-hero", "hero_banner");
 *   const title = obj?.fields.find(f => f.key === "title")?.value;
 */
/**
 * Fetch category-specific extra info from a Shopify Metaobject.
 *
 * Builds the Metaobject type as `{category}_extra_info`
 * (hyphens replaced with underscores for Shopify compatibility).
 * Returns the first entry of that type.
 *
 * Shopify Admin: Einstellungen → Benutzerdefinierte Daten → Metaobjekte
 * Metaobject-Typen: stehtisch_extra_info | feuertonne_extra_info | laser_extra_info | …
 *
 * @example
 *   const info = await getExtraInfoByType("stehtisch");
 *   const info = await getExtraInfoByType("3d-druck"); // → type: 3d_druck_extra_info
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
  } catch (error) {
    console.error(`getExtraInfoByType error [${metaobjectType}]:`, error);
    return [];
  }
}
