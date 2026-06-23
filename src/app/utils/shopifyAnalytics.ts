import type { Product } from "../types/shopify";
import { getCookie } from "../lib/cookies";

// ─── Event Payloads ──────────────────────────────────────────────────────────

export interface PageViewEvent {
  url: string;
  title: string;
  referrer: string;
  timestamp: string;
}

export interface ProductViewEvent {
  productId: string;
  productTitle: string;
  productHandle: string;
  productType: string;
  price: string;
  currencyCode: string;
  imageUrl: string | null;
  timestamp: string;
}

export interface AddToCartEvent {
  variantId: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  variantTitle: string;
  price: string;
  currencyCode: string;
  quantity: number;
  imageUrl: string | null;
  timestamp: string;
}

export interface AddToCartInput {
  variantId: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  variantTitle?: string;
  price: string;
  currencyCode: string;
  quantity: number;
  imageUrl?: string | null;
}

type AnalyticsEvent =
  | { name: "page_viewed"; payload: PageViewEvent }
  | { name: "product_viewed"; payload: ProductViewEvent }
  | { name: "product_added_to_cart"; payload: AddToCartEvent };

// ─── Cookie-Consent → Shopify Privacy API Bridge ────────────────────────────

interface ShopifyCustomerPrivacy {
  analyticsProcessingAllowed: () => boolean;
  marketingAllowed: () => boolean;
  preferencesProcessingAllowed: () => boolean;
  saleOfDataAllowed: () => boolean;
  setTrackingConsent: (consent: {
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  }) => void;
}

declare global {
  interface Window {
    Shopify?: {
      customerPrivacy?: ShopifyCustomerPrivacy;
    };
  }
}

function readConsentFromCookie(): {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
} {
  try {
    const raw = getCookie("cookie-consent");
    if (!raw) return { analytics: false, marketing: false, functional: false };
    const prefs = JSON.parse(raw) as {
      analytics?: boolean;
      marketing?: boolean;
      functional?: boolean;
    };
    return {
      analytics: prefs.analytics === true,
      marketing: prefs.marketing === true,
      functional: prefs.functional === true,
    };
  } catch {
    return { analytics: false, marketing: false, functional: false };
  }
}

function syncShopifyPrivacy(): void {
  if (typeof window === "undefined") return;

  const consent = readConsentFromCookie();

  window.Shopify = window.Shopify || {};
  window.Shopify.customerPrivacy = {
    analyticsProcessingAllowed: () => consent.analytics,
    marketingAllowed: () => consent.marketing,
    preferencesProcessingAllowed: () => consent.functional,
    saleOfDataAllowed: () => false,
    setTrackingConsent: (c) => {
      if (isDev) {
        console.log("[ShopifyAnalytics] setTrackingConsent called", c);
      }
    },
  };
}

let initialized = false;

export function initShopifyAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  syncShopifyPrivacy();

  window.addEventListener("cookie-consent-updated", () => {
    syncShopifyPrivacy();
    if (isDev) {
      const c = readConsentFromCookie();
      console.log("[ShopifyAnalytics] consent updated → analytics:", c.analytics);
    }
  });
}

// ─── Consent check ──────────────────────────────────────────────────────────

function hasAnalyticsConsent(): boolean {
  if (typeof document === "undefined") return false;
  return readConsentFromCookie().analytics;
}

// ─── Internal dispatch ───────────────────────────────────────────────────────

const isDev = process.env.NODE_ENV === "development";

function dispatch(event: AnalyticsEvent) {
  if (!hasAnalyticsConsent()) {
    if (isDev) {
      console.log(`[ShopifyAnalytics] BLOCKED (no consent): ${event.name}`);
    }
    return;
  }

  if (isDev) {
    console.log(`[ShopifyAnalytics] ${event.name}`, event.payload);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(`shopify:${event.name}`, { detail: event.payload }),
    );
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function trackPageView(url: string, title: string): void {
  dispatch({
    name: "page_viewed",
    payload: {
      url,
      title,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      timestamp: new Date().toISOString(),
    },
  });
}

export function trackProductView(product: Product): void {
  dispatch({
    name: "product_viewed",
    payload: {
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productType: product.productType,
      price: product.priceRange.minVariantPrice.amount,
      currencyCode: product.priceRange.minVariantPrice.currencyCode,
      imageUrl: product.featuredImage?.url ?? null,
      timestamp: new Date().toISOString(),
    },
  });
}

export function trackAddToCart(input: AddToCartInput): void {
  dispatch({
    name: "product_added_to_cart",
    payload: {
      variantId: input.variantId,
      productId: input.productId,
      productTitle: input.productTitle,
      productHandle: input.productHandle,
      variantTitle: input.variantTitle ?? "",
      price: input.price,
      currencyCode: input.currencyCode,
      quantity: input.quantity,
      imageUrl: input.imageUrl ?? null,
      timestamp: new Date().toISOString(),
    },
  });
}
