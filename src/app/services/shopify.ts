import { ShopifyCollection } from "../components/CollectionsList"
import type { Cart, Product } from "../types/shopify"

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

// Hilfsfunktion für GraphQL-Anfragen
async function shopifyFetch<T>({
  query,
  variables = {},
  locale,
}: {
  query: string
  variables?: any
  locale?: string
}): Promise<T> {
  // Füge locale zu variables hinzu, wenn es angegeben wurde
  const variablesWithLocale = locale
    ? {
        ...variables,
        locale,
      }
    : variables

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN as string,
    }

    // Füge Accept-Language nur hinzu, wenn locale angegeben wurde
    if (locale) {
      headers["Accept-Language"] = locale
    }

    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables: variablesWithLocale }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Shopify API error response:", errorText)
      throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`)
    }

    const result = await response.json()
    if (result.errors) {
      console.error("GraphQL errors:", result.errors)
      throw new Error(result.errors.map((e: any) => e.message).join("\n"))
    }

    return result.data as T
  } catch (error) {
    console.error("Error fetching from Shopify:", error)
    throw error
  }
}

export const updateItemQuantity = async (cartId: string, lineId: string, quantity: number) => {
  const response = await fetch(`/api/carts/${cartId}/lines/${lineId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }), // Menge, die aktualisiert werden soll
  })

  if (!response.ok) {
    throw new Error("Failed to update item quantity")
  }

  const updatedCart = await response.json() // Nimm den aktualisierten Warenkorb
  return updatedCart // Gib den neuen Warenkorb zurück
}

// Produkte abrufen mit optionaler Sprachunterstützung
export async function getProducts(first = 20, locale?: string): Promise<Product[]> {
  // Verwende die ursprüngliche Query ohne locale-Parameter
  const query = `
    query getProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
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
  `

  const response = await shopifyFetch<{
    products: { edges: Array<{ node: Product }> }
  }>({
    query,
    variables: { first },
    locale, // Übergebe locale nur, wenn es angegeben wurde
  })

  return response.products.edges.map((edge) => edge.node)
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
  `

  try {
    // Aufruf von shopifyFetch, um Blog-Daten abzurufen
    const data = await shopifyFetch<{
      blog: {
        articles: {
          edges: {
            node: {
              title: string
              content: string
              tags: string[]
            }
          }[]
        }
      }
    }>({
      query,
      locale, // Übergebe locale nur, wenn es angegeben wurde
    })

    // Erfolgreiche Antwort
    if (data.blog) {
      return data.blog.articles.edges
    } else {
      console.log("Keine Blog-Daten gefunden")
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Blog-Artikel:", error)
  }
}

// Produkt nach Handle abrufen mit optionaler Sprachunterstützung
export async function getProductByHandle(handle: string, locale?: string): Promise<Product | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
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
      }
    }
  `

  try {
    const response = await shopifyFetch<{ productByHandle: Product | null }>({
      query,
      variables: { handle },
      locale, // Übergebe locale nur, wenn es angegeben wurde
    })

    return response.productByHandle
  } catch (error) {
    console.error("Error in getProductByHandle:", error)
    throw error
  }
}

// Kollektionen abrufen mit optionaler Sprachunterstützung
export async function getCollections(first = 6, locale?: string): Promise<ShopifyCollection[]> {
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
  `

  const response = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> }
  }>({
    query,
    variables: { first },
    locale, // Übergebe locale nur, wenn es angegeben wurde
  })

  return response.collections.edges.map((edge) => edge.node)
}

// Get products by collection mit optionaler Sprachunterstützung
export async function getProductsByCollection(
  collectionHandle: string,
  first = 20,
  locale?: string,
): Promise<Product[]> {
  const query = `
    query getProductsByCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
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
  `

  const response = await shopifyFetch<{
    collection: { products: { edges: Array<{ node: Product }> } } | null
  }>({
    query,
    variables: { handle: collectionHandle, first },
    locale, // Übergebe locale nur, wenn es angegeben wurde
  })

  if (!response.collection) {
    return []
  }

  return response.collection.products.edges.map((edge) => edge.node)
}

// Empfohlene Produkte abrufen mit optionaler Sprachunterstützung
export async function getFeaturedProducts(first = 4, locale?: string): Promise<Product[]> {
  // In einer realen App würdest du eine spezielle Kollektion für empfohlene Produkte haben
  // Hier verwenden wir einfach die ersten paar Produkte
  return getProducts(first, locale)
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
  `

  const response = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
    query,
  })
  return response.cartCreate.cart
}

export const addToCart = async (
  cartId: string,
  variantId: string,
  quantity: number,
  customAttributes?: { key: string; value: string }[],
  locale?: string,
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
  `

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
        attributes: customAttributes || [],
      },
    ],
  }

  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
    query,
    variables,
    locale, // Übergebe locale nur, wenn es angegeben wurde
  })

  return data.cartLinesAdd.cart
}

// Warenkorb abrufen mit optionaler Sprachunterstützung
export async function getCart(cartId: string, locale?: string): Promise<Cart | null> {
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
  `

  const response = await shopifyFetch<{ cart: Cart | null }>({
    query,
    variables: { cartId },
    locale, // Übergebe locale nur, wenn es angegeben wurde
  })

  return response.cart
}

// Update cart item
export async function updateCartItem(cartId: string, lineId: string, quantity: number, locale?: string): Promise<Cart> {
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
  `

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        quantity,
      },
    ],
  }

  const response = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
    query,
    variables,
    locale, // Übergebe locale nur, wenn es angegeben wurde
  })

  return response.cartLinesUpdate.cart
}

// Remove cart item
export async function removeCartItem(cartId: string, lineId: string, locale?: string): Promise<Cart> {
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
  `

  const variables = {
    cartId,
    lineIds: [lineId],
  }

  const response = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
    query,
    variables,
    locale, // Übergebe locale nur, wenn es angegeben wurde
  })

  return response.cartLinesRemove.cart
}
