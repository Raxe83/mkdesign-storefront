// ─── Metaobjects ─────────────────────────────────────────────────────────────

export interface MetaobjectField {
  key: string;
  value: string | null;
  type: string;
  reference?: {
    image?: {
      url: string;
      altText: string | null;
    };
  } | null;
}

export interface Metaobject {
  id: string;
  handle: string;
  type: string;
  fields: MetaobjectField[];
}

// ─── Produkt-Zusatzoptionen (custom.zusatzoptionen) ───────────────────────────

/**
 * Rohe Felder wie sie aus dem Metaobjekt-Reference kommen.
 * Wird intern von `parseZusatzoptionen` verarbeitet.
 */
export interface VarianteOption {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
}

export interface ZusatzoptionenRaw {
  id: string;
  fields: Array<{
    key: string;
    value: string | null;
    references?: {
      nodes: Array<{
        id?: string;
        title?: string;
        price?: { amount: string; currencyCode: string };
      }>;
    } | null;
  }>;
}

/**
 * Fertig normalisierte Struktur für die UI.
 * `farbauswahl` ist bereits ein echtes String-Array (aus dem JSON-String geparst).
 * Felder die im Metaobjekt nicht gesetzt sind, sind `null` bzw. `[]`.
 */
export interface ProductZusatzoptionen {
  /** Dynamische Textfeld-Labels, z.B. ["Name Braut", "Gravurtext"] */
  textfelder: string[];
  /** Varianten — Mehrfachauswahl mit Preis */
  varianten: VarianteOption[];
  /** Checkbox-Optionen — Mehrfachauswahl, z.B. ["Mit Gravur", "Mit Geschenkbox"] */
  optionen: string[];
  /** Radio-Optionen — Einzelauswahl, z.B. ["Matt", "Glänzend"] */
  entscheide: string[];
  /** Auswählbare Farben, z.B. ["Schwarz", "Silber", "Gold"] */
  farben: string[];
}

// ─────────────────────────────────────────────────────────────────────────────

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
  /** Gesetzt wenn das Produkt ein `custom.layout_konfiguration`-Metafeld hat. */
  zusatzoptionen?: ProductZusatzoptionen | null
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
      handle: string
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

// ─── Customer ─────────────────────────────────────────────────────────────────

export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

export interface CustomerAddress {
  id: string
  firstName: string | null
  lastName: string | null
  address1: string | null
  address2: string | null
  city: string | null
  province: string | null
  zip: string | null
  country: string | null
  phone: string | null
}

export interface Customer {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  phone: string | null
  defaultAddress: CustomerAddress | null
  addresses: {
    edges: Array<{ node: CustomerAddress }>
  }
}

export interface CustomerUserError {
  field: string[] | null
  message: string
  code: string
}

export interface RecoverPasswordResult {
  /** true = E-Mail wurde verschickt (oder Adresse existiert nicht — Shopify gibt kein Unterschied zurück) */
  success: boolean
  errors: CustomerUserError[]
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderFulfillmentStatus =
  | "FULFILLED" | "IN_PROGRESS" | "ON_HOLD" | "OPEN"
  | "PARTIALLY_FULFILLED" | "PENDING_FULFILLMENT"
  | "RESTOCKED" | "SCHEDULED" | "UNFULFILLED"

export type OrderFinancialStatus =
  | "AUTHORIZED" | "EXPIRED" | "PAID" | "PARTIALLY_PAID"
  | "PARTIALLY_REFUNDED" | "PENDING" | "REFUNDED" | "VOIDED"

export interface OrderLineItem {
  title: string
  quantity: number
  variant: {
    price: Money
    image: Image | null
  } | null
}

export interface Order {
  id: string
  orderNumber: number
  processedAt: string
  fulfillmentStatus: OrderFulfillmentStatus
  financialStatus: OrderFinancialStatus
  totalPrice: Money
  lineItems: {
    edges: Array<{ node: OrderLineItem }>
  }
}

