const CART_ID_KEY = "shopify_cart_id"
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

// Hilfsfunktion zum Abrufen oder Erstellen einer Cart ID
export async function getCartId() {
  // Versuche, eine bestehende Cart ID aus dem localStorage zu holen
  const cartId = localStorage.getItem(CART_ID_KEY)

  if (cartId) {
    return cartId
  }

  // Wenn keine Cart ID existiert, erstelle einen neuen Warenkorb
  const { id } = await createCart()
  localStorage.setItem(CART_ID_KEY, id)
  return id
}

// Erstellt einen neuen Warenkorb in Shopify
export async function createCart() {
  const result = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN as string,
    },
    body: JSON.stringify({
      query: `
        mutation cartCreate {
          cartCreate {
            cart {
              id
              checkoutUrl
            }
          }
        }
      `,
    }),
  }).then((res) => res.json())

  return {
    id: result.data.cartCreate.cart.id,
    checkoutUrl: result.data.cartCreate.cart.checkoutUrl,
  }
}

// Fügt ein Produkt zum Warenkorb hinzu
export async function addToCart(variantId: string, quantity = 1, color: string) {
  const cartId = await getCartId()

  const result = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN as string,
    },
    body: JSON.stringify({
      query: `
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
                    customAttributes {
                      key
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity,
            customAttributes: [
              {
                key: "Color",
                value: color, // Füge die Farbe als benutzerdefiniertes Attribut hinzu
              },
            ],
          },
        ],
      },
    }),
  }).then((res) => res.json())

  return result.data.cartLinesAdd.cart
}

// Holt den aktuellen Warenkorb
export async function getCart() {
  try {
    const cartId = await getCartId()

    const result = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN as string,
      },
      body: JSON.stringify({
        query: `
          query getCart($cartId: ID!) {
            cart(id: $cartId) {
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
                        priceV2 {
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
        `,
        variables: {
          cartId,
        },
      }),
    }).then((res) => res.json())

    return result.data.cart
  } catch (error) {
    console.error("Fehler beim Abrufen des Warenkorbs:", error)
    return null
  }
}

