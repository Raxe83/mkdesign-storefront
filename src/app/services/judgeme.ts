// Judge.me Storefront API – server-side only
// Docs: https://judge.me/api/docs

import { unstable_cache } from "next/cache";

const JUDGEME_BASE = "https://judge.me/api/v1";

function getCredentials() {
  const token = process.env.JUDGEME_API_TOKEN;
  // Judge.me requires the *.myshopify.com domain, NOT custom domains like mkdesignweb.de
  const domain = process.env.JUDGEME_SHOP_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  if (!token || !domain) {
    throw new Error("JUDGEME_API_TOKEN oder JUDGEME_SHOP_DOMAIN fehlt in .env.local");
  }
  return { token, domain };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JudgemeReviewer {
  id: number;
  email: string;
  name: string;
  phone: string | null;
}

export interface JudgemeReview {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  reviewer: JudgemeReviewer;
  curated: string;       // "ok" | "spam"
  published: boolean;
  hidden: boolean;
  featured: boolean;
  created_at: string;    // ISO date string
  verified: string;      // "unverified" | "verified_buyer" | "shopify_verified_buyer"
  source: string;
  product_id: number;
  product_title: string;
  product_handle: string;
  pictures: Array<{
    urls: {
      compact: string;
      small: string;
      medium: string;
      large: string;
      original: string;
    };
  }>;
}

export interface JudgemeReviewsResponse {
  reviews: JudgemeReview[];
  current_page: number;
  per_page: number;
  /** Computed: true if reviews.length >= per_page (Judge.me returns no total field) */
  hasNextPage: boolean;
}

export interface JudgemeWidgetData {
  rating: number;
  count: number;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extracts numeric Shopify product ID from GID: "gid://shopify/Product/12345" → 12345 */
export function extractProductId(gid: string): number {
  const parts = gid.split("/");
  return parseInt(parts[parts.length - 1], 10);
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Resolves the Judge.me internal product ID from the Shopify external ID.
 * Judge.me uses their own numeric IDs — the Shopify ID is too large for their API.
 */
async function resolveJudgemeProductId(shopifyProductId: number): Promise<number | null> {
  const { token, domain } = getCredentials();

  const url = new URL(`${JUDGEME_BASE}/products/-1`);
  url.searchParams.set("api_token", token);
  url.searchParams.set("shop_domain", domain);
  url.searchParams.set("external_id", String(shopifyProductId));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = await res.json();
  return data.product?.id ?? null;
}

/** Fetch paginated reviews for a specific product */
export async function getReviewsForProduct(
  shopifyProductId: number,
  page = 1,
  perPage = 10,
): Promise<JudgemeReviewsResponse> {
  const { token, domain } = getCredentials();

  const judgemeId = await resolveJudgemeProductId(shopifyProductId);
  if (!judgemeId) {
    // Produkt noch nicht in Judge.me — leeres Ergebnis statt Fehler
    return { reviews: [], current_page: page, per_page: perPage, hasNextPage: false };
  }

  const url = new URL(`${JUDGEME_BASE}/reviews`);
  url.searchParams.set("api_token", token);
  url.searchParams.set("shop_domain", domain);
  url.searchParams.set("product_id", String(judgemeId));
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Judge.me API Fehler: ${res.status} — ${body}`);
  }
  const data = await res.json();
  return { ...data, hasNextPage: (data.reviews?.length ?? 0) >= perPage };
}

/** Fetch all store reviews (for the reviews overview page) */
export async function getAllStoreReviews(
  page = 1,
  perPage = 20,
): Promise<JudgemeReviewsResponse> {
  const { token, domain } = getCredentials();

  const url = new URL(`${JUDGEME_BASE}/reviews`);
  url.searchParams.set("api_token", token);
  url.searchParams.set("shop_domain", domain);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url.toString(), { next: { revalidate: 120 } });
  if (!res.ok) throw new Error(`Judge.me API Fehler: ${res.status}`);
  const data = await res.json();
  return { ...data, hasNextPage: (data.reviews?.length ?? 0) >= perPage };
}

/** Submit a new review for a product */
export async function createReview(params: {
  productId: number;
  name: string;
  email: string;
  rating: number;
  title: string;
  body: string;
}): Promise<{ review: JudgemeReview }> {
  const { token, domain } = getCredentials();

  const res = await fetch(`${JUDGEME_BASE}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_token: token,
      shop_domain: domain,
      platform: "shopify",
      id: params.productId,
      name: params.name,
      email: params.email,
      rating: params.rating,
      title: params.title,
      body: params.body,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Judge.me Review-Fehler: ${err}`);
  }
  return res.json();
}

// ─── Cached full-store fetch ───────────────────────────────────────────────────

/**
 * Fetches ALL store reviews across all pages (max 100/request).
 * Result is cached for 1 hour via Next.js unstable_cache.
 * Used for the reviews overview page so filters/count work client-side.
 */
async function _fetchAllStoreReviews(): Promise<{ reviews: JudgemeReview[]; total: number }> {
  const { token, domain } = getCredentials();
  const PER_PAGE = 100;
  const all: JudgemeReview[] = [];
  let page = 1;

  while (true) {
    const url = new URL(`${JUDGEME_BASE}/reviews`);
    url.searchParams.set("api_token", token);
    url.searchParams.set("shop_domain", domain);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(PER_PAGE));

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) break;
    const data = await res.json();
    const batch: JudgemeReview[] = data.reviews ?? [];
    all.push(...batch);
    if (batch.length < PER_PAGE) break;
    page++;
  }

  // 1. Keep only published, visible, non-spam reviews
  const published = all.filter(
    (r) => r.published === true && r.hidden === false && r.curated === "ok",
  );

  // 2. Deduplicate: first by id, then by content fingerprint (same author + body)
  const seenIds = new Set<number>();
  const seenContent = new Set<string>();
  const unique = published.filter((r) => {
    if (seenIds.has(r.id)) return false;
    seenIds.add(r.id);
    const fingerprint = `${r.reviewer.name.toLowerCase().trim()}|${r.body.trim().substring(0, 100)}`;
    if (seenContent.has(fingerprint)) return false;
    seenContent.add(fingerprint);
    return true;
  });

  return { reviews: unique, total: unique.length };
}

export const getAllReviewsCached = unstable_cache(
  _fetchAllStoreReviews,
  ["judgeme-all-reviews"],
  { revalidate: 3600 }, // re-fetch from Judge.me every hour
);
