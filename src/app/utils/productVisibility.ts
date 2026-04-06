import type { Product } from "../types/shopify";

/**
 * Tags die Produkte aus allen öffentlichen Listings ausschließen.
 * Beide Schreibweisen von display_none werden abgedeckt (diplay_none = möglicher Tippfehler im Shopify-Backend).
 */
export const HIDDEN_TAGS = ["display_none", "diplay_none", "CustomDesign"] as const;

/** Nur Sichtbarkeits-Tags (ohne CustomDesign) — für Queries die CustomDesign-Produkte einschließen sollen. */
export const VISIBILITY_TAGS = ["display_none", "diplay_none"] as const;

/** Shopify query-String zum Ausschluss aller versteckten Tags inkl. CustomDesign. */
export const HIDDEN_TAGS_QUERY = HIDDEN_TAGS.map((t) => `-tag:${t}`).join(" AND ");

/** Shopify query-String nur für Sichtbarkeitsfilter (ohne -tag:CustomDesign). */
export const VISIBILITY_TAGS_QUERY = VISIBILITY_TAGS.map((t) => `-tag:${t}`).join(" AND ");

/** Post-filter: entfernt alle Produkte mit einem der HIDDEN_TAGS (inkl. CustomDesign). */
export function filterHiddenProducts<T extends Pick<Product, "tags">>(products: T[]): T[] {
  return products.filter((p) => !p.tags?.some((t) => (HIDDEN_TAGS as readonly string[]).includes(t)));
}

/** Post-filter: entfernt nur display_none-Varianten (beide Schreibweisen), behält CustomDesign. */
export function filterVisibilityHidden<T extends Pick<Product, "tags">>(products: T[]): T[] {
  return products.filter((p) => !p.tags?.some((t) => (VISIBILITY_TAGS as readonly string[]).includes(t)));
}
