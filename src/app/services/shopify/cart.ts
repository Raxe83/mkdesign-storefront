import { shopifyFetch } from "./client";
import type { Cart } from "../../types/shopify";

const CART_FIELDS = `
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
`;

export async function createCart(): Promise<Cart> {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart { ${CART_FIELDS} }
      }
    }
  `;

  const response = await shopifyFetch<{ cartCreate: { cart: Cart } }>({ query });
  return response.cartCreate.cart;
}

export async function getCart(
  cartId: string,
  locale?: string,
): Promise<Cart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }
  `;

  const response = await shopifyFetch<{ cart: Cart | null }>({
    query,
    variables: { cartId },
    locale,
  });
  return response.cart;
}

export const addToCart = async (
  cartId: string,
  variantId: string,
  quantity: number,
  customAttributes?: { key: string; value: string }[],
  locale?: string,
  additionalLines?: Array<{
    variantId: string;
    quantity: number;
    customAttributes?: { key: string; value: string }[];
  }>,
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
                    product { title }
                  }
                }
                attributes { key value }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
        attributes: customAttributes ?? [],
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
    locale,
  });
  return data.cartLinesAdd.cart;
};

export async function updateCartItem(
  cartId: string,
  lineId: string,
  quantity: number,
  locale?: string,
): Promise<Cart> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
    query,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    locale,
  });
  return response.cartLinesUpdate.cart;
}

export async function removeCartItem(
  cartId: string,
  lineId: string,
  locale?: string,
): Promise<Cart> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
    query,
    variables: { cartId, lineIds: [lineId] },
    locale,
  });
  return response.cartLinesRemove.cart;
}

export const updateItemQuantity = async (
  cartId: string,
  lineId: string,
  quantity: number,
) => {
  const response = await fetch(`/api/carts/${cartId}/lines/${lineId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) throw new Error("Failed to update item quantity");
  return response.json();
};
