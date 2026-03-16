import type { Product, Cart, Collection } from "../types/shopify"

// Mock products
const mockProducts: Product[] = [
  {
    id: "gid://shopify/Product/1",
    title: "Classic T-Shirt",
    handle: "classic-t-shirt",
    description: "A comfortable cotton t-shirt for everyday wear.",
    descriptionHtml: "<p>A comfortable cotton t-shirt for everyday wear.</p>",
    priceRange: {
      minVariantPrice: {
        amount: "29.99",
        currencyCode: "EUR",
      },
    },
    featuredImage: {
      url: "https://via.placeholder.com/500x500?text=T-Shirt",
      altText: "Classic T-Shirt",
    },
    images: {
      edges: [
        {
          node: {
            url: "https://via.placeholder.com/500x500?text=T-Shirt",
            altText: "Classic T-Shirt",
          },
        },
        {
          node: {
            url: "https://via.placeholder.com/500x500?text=T-Shirt+Back",
            altText: "Classic T-Shirt Back View",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/1",
            title: "Small",
            price: {
              amount: "29.99",
              currencyCode: "EUR",
            },
            availableForSale: true,
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/2",
    title: "Denim Jeans",
    handle: "denim-jeans",
    description: "Classic denim jeans with a comfortable fit.",
    descriptionHtml: "<p>Classic denim jeans with a comfortable fit.</p>",
    priceRange: {
      minVariantPrice: {
        amount: "59.99",
        currencyCode: "EUR",
      },
    },
    featuredImage: {
      url: "https://via.placeholder.com/500x500?text=Jeans",
      altText: "Denim Jeans",
    },
    images: {
      edges: [
        {
          node: {
            url: "https://via.placeholder.com/500x500?text=Jeans",
            altText: "Denim Jeans",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/2",
            title: "Medium",
            price: {
              amount: "59.99",
              currencyCode: "EUR",
            },
            availableForSale: true,
          },
        },
      ],
    },
  },
  {
    id: "gid://shopify/Product/3",
    title: "Leather Jacket",
    handle: "leather-jacket",
    description: "Premium leather jacket for a stylish look.",
    descriptionHtml: "<p>Premium leather jacket for a stylish look.</p>",
    priceRange: {
      minVariantPrice: {
        amount: "199.99",
        currencyCode: "EUR",
      },
    },
    featuredImage: {
      url: "https://via.placeholder.com/500x500?text=Leather+Jacket",
      altText: "Leather Jacket",
    },
    images: {
      edges: [
        {
          node: {
            url: "https://via.placeholder.com/500x500?text=Leather+Jacket",
            altText: "Leather Jacket",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/3",
            title: "Large",
            price: {
              amount: "199.99",
              currencyCode: "EUR",
            },
            availableForSale: true,
          },
        },
      ],
    },
  },
]

// Mock collections
const mockCollections: Collection[] = [
  {
    id: "gid://shopify/Collection/1",
    title: "Summer Collection",
    handle: "summer-collection",
    description: "Our latest summer styles for hot days.",
    image: {
      url: "https://via.placeholder.com/800x400?text=Summer+Collection",
      altText: "Summer Collection",
    },
    products: {
      edges: mockProducts.slice(0, 2).map((product) => ({ node: product })),
    },
  },
  {
    id: "gid://shopify/Collection/2",
    title: "Winter Essentials",
    handle: "winter-essentials",
    description: "Stay warm with our winter collection.",
    image: {
      url: "https://via.placeholder.com/800x400?text=Winter+Collection",
      altText: "Winter Collection",
    },
    products: {
      edges: mockProducts.slice(1, 3).map((product) => ({ node: product })),
    },
  },
]

// Mock cart
let mockCart: Cart = {
  id: "gid://shopify/Cart/1",
  checkoutUrl: "https://example.com/checkout",
  lines: {
    edges: [],
  },
  estimatedCost: {
    totalAmount: {
      amount: "0.00",
      currencyCode: "EUR",
    },
    subtotalAmount: {
      amount: "0.00",
      currencyCode: "EUR",
    },
  },
}

// Get all products
export async function getProducts(first = 10): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockProducts.slice(0, first)
}

// Get product by handle
export async function getProductByHandle(handle: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const product = mockProducts.find((p) => p.handle === handle)
  return product || null
}

// Get collections
export async function getCollections(first = 3): Promise<Collection[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCollections.slice(0, first)
}

// Get featured products
export async function getFeaturedProducts(first = 4): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockProducts.slice(0, first)
}

// Create cart
// export async function createCart(): Promise<Cart> {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   mockCart = {
//     id: `gid://shopify/Cart/${Date.now()}`,
//     checkoutUrl: "https://example.com/checkout",
//     lines: {
//       edges: [],
//     },
//     estimatedCost: {
//       totalAmount: {
//         amount: "0.00",
//         currencyCode: "EUR",
//       },
//       subtotalAmount: {
//         amount: "0.00",
//         currencyCode: "EUR",
//       },
//     },
//   }
//   return mockCart
// }

// Add to cart
// export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 500))

//   // Find the product variant
//   let variant = null
//   let product = null

//   for (const p of mockProducts) {
//     const v = p.variants.edges.find((e) => e.node.id === variantId)
//     if (v) {
//       variant = v.node
//       product = p
//       break
//     }
//   }

//   if (!variant || !product) {
//     throw new Error("Variant not found")
//   }

//   // Check if item already exists in cart
//   const existingLineIndex = mockCart.lines.edges.findIndex((e) => e.node.merchandise.id === variantId)

//   if (existingLineIndex >= 0) {
//     // Update quantity
//     mockCart.lines.edges[existingLineIndex].node.quantity += quantity
//   } else {
//     // Add new line
//     mockCart.lines.edges.push({
//       node: {
//         id: `gid://shopify/CartLine/${Date.now()}`,
//         quantity,
//         attributes: [{key: "Farbe", value: "Weiß"}],
//         merchandise: {
//           id: variant.id,
//           title: variant.title,
//           price: variant.price,
//           product: {
//             title: product.title,
//             featuredImage: product.featuredImage,
//           },
//         },
//       },
//     })
//   }

//   // Update totals
//   const total = mockCart.lines.edges.reduce((sum, { node }) => {
//     return sum + Number.parseFloat(node.merchandise.price.amount) * node.quantity
//   }, 0)

//   mockCart.estimatedCost.totalAmount.amount = total.toFixed(2)
//   mockCart.estimatedCost.subtotalAmount.amount = total.toFixed(2)

//   return mockCart
// }

// Get cart
export async function getCart(cartId: string): Promise<Cart | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCart
}

