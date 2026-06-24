import type { Product } from "@/app/types/shopify";

export type ProductCategory =
  | "stehtisch"
  | "stehtisch-zubehoer"
  | "schieferuntersetzer"
  | "weinverpackung"
  | "feuertonne"
  | "feuerschale"
  | "grillzubehoer"
  | "holzschild"
  | "holzuhr"
  | "nachtlicht"
  | "schieferuhr"
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

  if (matches(["tischzubehoer", "stehtisch-zubehoer", "lochblech", "waermehaube", "stehtisch zubehoer"])) return "stehtisch-zubehoer";
  if (matches(["schieferuntersetzer", "schiefer-untersetzer", "untersetzer"])) return "schieferuntersetzer";
  if (matches(["weinverpackung", "holzverpackung", "weingeschenk", "weinflaschen-verpackung"])) return "weinverpackung";
  if (matches(["stehtisch", "bistrotisch", "bartisch", "stehtische", "möbel", "furniture"])) return "stehtisch";
  if (matches(["feuerschale"]))                                                               return "feuerschale";
  if (matches(["feuertonne", "feuerkorb", "fire pit", "brazier"]))                           return "feuertonne";
  if (matches(["grillplatte", "grillzubehoer", "plancha", "grilleinsatz", "wokaufsatz"]))     return "grillzubehoer";
  if (matches(["holzschild", "wandschild", "buchenholzschild"]))                               return "holzschild";
  if (matches(["holzuhr", "wanduhr", "holzuhr-buche"]))                                        return "holzuhr";
  if (matches(["nachtlicht", "schlummerlicht", "led-nachtlicht"]))                              return "nachtlicht";
  if (matches(["schieferuhr", "schiefer-wanduhr", "wanduhr-schiefer"]))                        return "schieferuhr";
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
  stehtisch:            "stehtisch",
  bistrotisch:          "stehtisch",
  bartisch:             "stehtisch",
  // Stehtisch-Zubehör
  tischzubehoer:        "stehtisch-zubehoer",
  "stehtisch-zubehoer": "stehtisch-zubehoer",
  lochblech:            "stehtisch-zubehoer",
  waermehaube:          "stehtisch-zubehoer",
  // Feuer
  feuertonne:         "feuertonne",
  feuerkorb:          "feuertonne",
  // Feuerschalen
  feuerschale:        "feuerschale",
  "feuerschale-klein": "feuerschale",
  "feuerschale-xl":   "feuerschale",
  // Grill & Zubehör
  grillzubehoer:      "grillzubehoer",
  grillplatte:        "grillzubehoer",
  "plancha-grill":    "grillzubehoer",
  grilleinsatz:       "grillzubehoer",
  wokaufsatz:         "grillzubehoer",
  // Holzschilder
  holzschild:         "holzschild",
  wandschild:         "holzschild",
  "holzschild-buche": "holzschild",
  // Holzuhren
  holzuhr:            "holzuhr",
  "holzuhr-buche":    "holzuhr",
  wanduhr:            "holzuhr",
  // Nachtlichter
  nachtlicht:         "nachtlicht",
  schlummerlicht:     "nachtlicht",
  "led-nachtlicht":   "nachtlicht",
  // Schieferuntersetzer
  schieferuntersetzer:       "schieferuntersetzer",
  "schiefer-untersetzer":    "schieferuntersetzer",
  untersetzer:               "schieferuntersetzer",
  // Weinverpackungen
  weinverpackung:            "weinverpackung",
  holzverpackung:            "weinverpackung",
  weingeschenk:              "weinverpackung",
  "weinflaschen-verpackung": "weinverpackung",
  // Schieferuhren
  schieferuhr:               "schieferuhr",
  "schiefer-wanduhr":     "schieferuhr",
  "wanduhr-schiefer":     "schieferuhr",
  // 3D-Druck
  "3d-druck":         "3d-druck",
  "3d-print":         "3d-druck",
  fdm:                "3d-druck",
  // Laser
  laser:              "laser",
  gravur:             "laser",
  lasercut:           "laser",
  // Custom Design
  "custom-design":    "custom-design",
  customdesign:       "custom-design",
  wunschdruck:        "custom-design",
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

// ─── Technische Details: feinere Auflösung als die Basis-Kategorie ────────────
//
// Größenvarianten (z. B. Feuerschale XL) sollen EIGENE technische Daten zeigen,
// aber Extra-Info & FAQ weiterhin mit der Basis-Kategorie (`feuerschale`) teilen.
// Diese Funktion liefert daher nur für die Technical-Specs-Sektion einen
// spezifischeren Typ; alle anderen Sektionen nutzen weiter `findMetaType`.
//
// Rückgabe ist ein Metaobjekt-Kategorie-String (kann spezifischer sein als
// ProductCategory), den getTechnicalSpecsByType zu `{typ}_technical_specs` macht.

/** Tags, die eine eigene Technical-Specs-Kategorie erzwingen (spezifischer zuerst). */
const TECH_SPEC_OVERRIDES: ReadonlyArray<{ tag: string; type: string }> = [
  { tag: "feuerschale-xl", type: "feuerschale-xl" },
];

export function findTechnicalSpecType(tags: readonly string[]): string | null {
  const lower = tags.map((t) => t.toLowerCase());
  for (const { tag, type } of TECH_SPEC_OVERRIDES) {
    if (lower.includes(tag)) return type;
  }
  return findMetaType(tags);
}

// ─── Verwandte-Produkte-Konfiguration ─────────────────────────────────────────

export const RELATED_CONFIG: Record<ProductCategory, { tag?: string; label: string }> = {
  stehtisch:            { tag: "tischzubehoer",        label: "Passendes Zubehör für deinen Stehtisch" },
  "stehtisch-zubehoer":   { tag: "tischzubehoer",        label: "Weiteres Zubehör für den Stehtisch" },
  schieferuntersetzer:    { tag: "schieferuntersetzer",  label: "Weitere Schieferuntersetzer entdecken" },
  weinverpackung:         { tag: "weinverpackung",       label: "Weitere Weinverpackungen aus Holz" },
  feuertonne:      { tag: "feuertonne",     label: "Weitere Modelle & saisonale Empfehlungen" },
  feuerschale:     { tag: "feuerschale",    label: "Weitere Feuerschalen von MK Design" },
  grillzubehoer:   { tag: "grillzubehoer",  label: "Weiteres Plancha-Zubehör von MK Design" },
  holzschild:      { tag: "holzschild",     label: "Weitere Holzschilder mit Spruch" },
  holzuhr:         { tag: "holzuhr",        label: "Weitere Holzuhren von MK Design" },
  nachtlicht:      { tag: "nachtlicht",     label: "Weitere Nachtlichter entdecken" },
  schieferuhr:     { tag: "schieferuhr",   label: "Weitere Schieferuhren von MK Design" },
  "3d-druck":      { tag: "3d-druck",       label: "Weitere 3D-Drucke aus unserem Sortiment" },
  laser:           { tag: "laser",          label: "Weitere Gravuren & Laserarbeiten" },
  "custom-design": { tag: "CustomDesign",   label: "Weitere Custom-Designs" },
  default:         { tag: undefined,        label: "Das könnte dir auch gefallen" },
};
