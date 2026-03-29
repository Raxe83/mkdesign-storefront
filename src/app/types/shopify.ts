// ─── CMS MetaObjects ─────────────────────────────────────────────────────────

/** One item in the announcement / news bar. MetaObject type: `cms_announcement` */
export interface CmsAnnouncement {
  id: string;
  title: string;
  content: string;
  /** "sticky" = always-visible bar, "important" = one-time modal */
  messageType: "sticky" | "important" | "promo";
  isActive: boolean;
}

/** Hero section content. MetaObject type: `cms_homepage_hero`, handle: `main` */
export interface CmsHomepageHero {
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  ctaPrimaryLabel: string | null;
  ctaPrimaryHref: string | null;
  ctaSecondaryLabel: string | null;
  ctaSecondaryHref: string | null;
  /** e.g. "25+" displayed in stat strip */
  statCollections: string | null;
  /** e.g. "100%" displayed in stat strip */
  statCraftsmanship: string | null;
  /** Shopify file_reference field `image` */
  imageUrl: string | null;
  imageAlt: string | null;
}

/**
 * Generic section text block. MetaObject type: `cms_section_text`.
 * Use the MetaObject's **handle** as the section identifier
 * (e.g. `fire-highlight`, `print-highlight`).
 */
export interface CmsSectionText {
  sectionLabel: string | null;
  /** May contain `<em>`, `<br/>`, HTML entities */
  title: string | null;
  description: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  /** Feature bullet points parsed from `features_json` field */
  features: string[];
  /** Shopify file_reference field `image` — overrides the local fallback image */
  imageUrl: string | null;
  imageAlt: string | null;
}

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
 * Ein vollständiges Zusatzprodukt, das einem Hauptprodukt zugeordnet ist.
 * Wird aus Product-Referenzen im Metaobjekt geparst.
 */
export interface ZusatzproduktOption {
  /** Product GID */
  id: string;
  title: string;
  handle: string;
  featuredImage: { url: string; altText: string | null } | null;
  price: { amount: string; currencyCode: string };
  /** Erster Variant-GID — wird zum Hinzufügen zum Warenkorb verwendet */
  defaultVariantId: string;
}

/** Roher Node aus einem `references`-Feld — kann Product oder ProductVariant sein */
export type ZusatzoptionNode =
  | {
      /** product_reference: vollständiges Produkt */
      id?: string;
      title?: string;
      handle?: string;
      featuredImage?: { url: string; altText: string | null } | null;
      priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
      variants?: { edges: Array<{ node: { id: string } }> };
      price?: never;
      product?: never;
    }
  | {
      /** variant_reference: Variante mit parent-Produkt */
      id?: string;
      price?: { amount: string; currencyCode: string };
      product?: {
        id: string;
        title: string;
        handle: string;
        featuredImage?: { url: string; altText: string | null } | null;
        priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
      };
      title?: never;
      handle?: never;
      priceRange?: never;
      variants?: never;
    };

export interface ZusatzoptionenRaw {
  id: string;
  fields: Array<{
    key: string;
    value: string | null;
    references?: {
      nodes: Array<ZusatzoptionNode>;
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
  /** Zusatzprodukte — auswählbare Produkte die zum Hauptprodukt dazugehören */
  zusatzprodukte: ZusatzproduktOption[];
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
  | "READY_FOR_PICKUP"
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

export interface OrderDetailLineItem {
  title: string
  quantity: number
  originalTotalPrice: Money | null
  variant: {
    title: string
    sku: string | null
    price: Money
    image: Image | null
    selectedOptions: Array<{ name: string; value: string }>
    product: { handle: string } | null
  } | null
}

export interface OrderDetail {
  id: string
  orderNumber: number
  processedAt: string
  fulfillmentStatus: OrderFulfillmentStatus
  financialStatus: OrderFinancialStatus
  statusUrl: string
  cancelReason: string | null
  canceledAt: string | null
  totalPrice: Money
  subtotalPrice: Money | null
  totalShippingPrice: Money | null
  totalTax: Money | null
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2: string | null
    city: string
    province: string | null
    zip: string
    country: string
    phone: string | null
  } | null
  successfulFulfillments: Array<{
    trackingInfo: Array<{ number: string; url: string | null }>
  }>
  lineItems: {
    edges: Array<{ node: OrderDetailLineItem }>
  }
}

