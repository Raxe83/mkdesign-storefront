export interface Money {
  amount: string
  currencyCode: string
}

export interface Image {
  url: string
  altText: string | null
}

export interface ProductVariant {
  id: string
  title: string
  price: Money
  availableForSale: boolean
}

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  tags: string[]
  productType: string
  priceRange: {
    minVariantPrice: Money
  }
  featuredImage: Image | null
  images: {
    edges: Array<{
      node: Image
    }>
  }
  variants: {
    edges: Array<{
      node: ProductVariant
    }>
  }
}

export interface Collection {
  id: string
  title: string
  handle: string
  description: string
  image: Image | null
  products: {
    edges: Array<{
      node: Product
    }>
  }
}

export interface CartItem {
  id: string
  quantity: number
  attributes: {key: string, value: string}[]
  merchandise: {
    id: string
    title: string
    price: Money
    product: {
      title: string
      featuredImage: Image | null
    }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: CartItem
    }>
  }
  estimatedCost: {
    totalAmount: Money
    subtotalAmount: Money
  }
}

