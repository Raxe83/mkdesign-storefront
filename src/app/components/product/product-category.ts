import type { Product } from "@/app/types/shopify";

export type ProductCategory =
  | "stehtisch"
  | "feuertonne"
  | "3d-druck"
  | "laser"
  | "custom-design"
  | "default";

export interface HeroCard {
  title: string;
  body: string;
  /** Index into product.images (wraps if fewer images exist) */
  imageIndex: number;
  /** Tailwind bg class for the colored panel */
  accentBg: string;
}

// ─── Kategorie-Erkennung ──────────────────────────────────────────────────────

export function detectCategory(product: Product): ProductCategory {
  const type = (product.productType ?? "").toLowerCase();
  const tags = (product.tags ?? []).map((t) => t.toLowerCase());

  const matches = (terms: string[]) =>
    terms.some((term) => type.includes(term) || tags.some((tag) => tag.includes(term)));

  if (matches(["stehtisch", "bistrotisch", "bartisch", "stehtische", "möbel", "furniture"])) return "stehtisch";
  if (matches(["feuertonne", "feuerschale", "feuerkorb", "fire pit", "brazier"]))             return "feuertonne";
  if (matches(["3d-druck", "3d druck", "3ddruck", "3d-print", "fdm", "pla", "petg", "resin"])) return "3d-druck";
  if (matches(["laser", "gravur", "graviert", "lasercut", "laser cut", "engraving"]))          return "laser";
  if (matches(["customdesign", "custom-design", "custom design", "wunschdruck", "personali"])) return "custom-design";
  return "default";
}

// ─── Tag → Metaobjekt-Typ-Mapping ────────────────────────────────────────────
//
// Schlüssel  = Shopify-Produkt-Tag (lowercase, exakter Match)
// Wert       = Kategorie-String, den getExtraInfoByType erwartet
//              (die Funktion hängt "_extra_info" automatisch an)
//
// Shopify Admin: Einstellungen → Benutzerdefinierte Daten → Metaobjekte
// Anzulegende Definitionen: stehtisch_extra_info | feuertonne_extra_info | …

export const TAG_TO_META_TYPE: Readonly<Record<string, ProductCategory>> = {
  // Tische & Möbel
  stehtisch:      "stehtisch",
  bistrotisch:    "stehtisch",
  bartisch:       "stehtisch",
  // Feuer
  feuertonne:     "feuertonne",
  feuerschale:    "feuertonne",
  feuerkorb:      "feuertonne",
  // 3D-Druck
  "3d-druck":     "3d-druck",
  "3d-print":     "3d-druck",
  fdm:            "3d-druck",
  // Laser
  laser:          "laser",
  gravur:         "laser",
  lasercut:       "laser",
  // Custom Design
  "custom-design": "custom-design",
  customdesign:   "custom-design",
  wunschdruck:    "custom-design",
};

/**
 * Durchsucht die Produkt-Tags und gibt den ersten passenden
 * Metaobjekt-Kategorie-String zurück.
 * Gibt `null` zurück, wenn kein Tag im Mapping enthalten ist.
 */
export function findMetaType(tags: readonly string[]): ProductCategory | null {
  for (const tag of tags) {
    const match = TAG_TO_META_TYPE[tag.toLowerCase()];
    if (match) return match;
  }
  return null;
}

// ─── Verwandte-Produkte-Konfiguration ─────────────────────────────────────────

export const RELATED_CONFIG: Record<ProductCategory, { tag?: string; label: string }> = {
  stehtisch:       { tag: "tischzubehoer", label: "Passendes Zubehör für deinen Stehtisch" },
  feuertonne:      { tag: "feuertonne",    label: "Weitere Modelle & saisonale Empfehlungen" },
  "3d-druck":      { tag: "3d-druck",      label: "Weitere 3D-Drucke aus unserem Sortiment" },
  laser:           { tag: "laser",         label: "Weitere Gravuren & Laserarbeiten" },
  "custom-design": { tag: "CustomDesign",  label: "Weitere Custom-Designs" },
  default:         { tag: undefined,       label: "Das könnte dir auch gefallen" },
};
