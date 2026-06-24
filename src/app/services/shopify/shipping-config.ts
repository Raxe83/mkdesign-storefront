/**
 * Statische Versandprofile — gespiegelt aus Shopify Admin → Versand und Zustellung.
 * Wenn sich ein Profil ändert, hier anpassen.
 *
 * matchTags: Shopify-Produkt-Tags (lowercase) die diesem Profil zugeordnet sind.
 * isStandard: true  → wird als "Standardversand" auf der Produktseite angezeigt.
 * freeFrom: optionaler Mindestbestellwert ab dem kostenlos versendet wird (z.B. "250,00 €").
 */

export interface StaticShippingRate {
  method: string;
  days: string;
  price: string;
  freeFrom?: string; // Mindestbestellwert für kostenlosen Versand
  isStandard: boolean;
  isExpress: boolean;
}

export interface StaticShippingProfile {
  id: string;
  name: string;
  /** Anzahl der Produkte in diesem Versandprofil (aus Shopify Admin) */
  productCount: number;
  /**
   * Shopify productType-Werte (lowercase) — stärkste Matching-Methode.
   * Zu finden auf der Produktseite im Dev-Badge oder in Shopify Admin → Produkt → Produkttyp.
   */
  matchProductTypes: string[];
  /** Shopify-Produkt-Tags (lowercase) — Fallback wenn productType nicht matcht */
  matchTags: string[];
  /**
   * Anfertigungszeit vor Versandbeginn (handgefertigte/personalisierte Produkte),
   * z.B. "5–8 Werktage". null = sofort versandfertig (Lagerware).
   * Läuft VOR der Versandzeit (`rates[].days`) — wird zur Gesamt-Lieferzeit addiert.
   */
  productionDays: string | null;
  rates: StaticShippingRate[];
}

export const SHIPPING_PROFILES: StaticShippingProfile[] = [
  {
    id: "feuertonnen-feuerschalen",
    name: "Feuertonnen und Feuerschalen",
    productCount: 175,
    matchProductTypes: ["feuertonne", "feuerschale", "fire barrel", "fire bowl"],
    matchTags: ["feuertonne", "feuerschale", "feuer-tonne", "feuer-schale"],
    productionDays: "5–8 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "25,00 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "nachtlichter",
    name: "Nachtlichter",
    productCount: 28,
    matchProductTypes: ["nachtlicht", "nachtlichter"],
    matchTags: ["nachtlicht", "nightlight", "night-light"],
    productionDays: "3–5 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "5,90 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "holzschild",
    name: "Holzschild",
    productCount: 12,
    matchProductTypes: ["holzschild", "holzschilder"],
    matchTags: ["holzschild", "holz-schild"],
    productionDays: "3–5 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "5,90 €",
        freeFrom: "180,10 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "schiefer-uhr",
    name: "Schiefer Uhr",
    productCount: 14,
    matchProductTypes: ["schiefer uhr", "schieferuhr", "schiefer-uhr"],
    matchTags: ["schiefer-uhr", "schiefer uhr", "schieferuhr"],
    productionDays: "4–6 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "5,90 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "weinverpackung",
    name: "Weinverpackung",
    productCount: 62,
    matchProductTypes: ["weinverpackung", "weinkiste"],
    matchTags: ["weinverpackung", "weinkiste", "wein-verpackung"],
    productionDays: "2–3 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "5,90 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "stehtisch-beheizt",
    name: "Stehtisch beheizt",
    productCount: 158,
    matchProductTypes: ["stehtisch", "stehtisch beheizt", "heizstehtisch"],
    matchTags: ["stehtisch", "beheizt", "stehtisch-beheizt"],
    productionDays: "7–10 Werktage",
    rates: [
      {
        method: "Cargo International · 80–100 kg",
        days: "5 Werktage",
        price: "130,00 €",
        isStandard: true,
        isExpress: false,
      },
      {
        method: "Cargo International · 101–200 kg",
        days: "5 Werktage",
        price: "210,00 €",
        isStandard: false,
        isExpress: false,
      },
      {
        method: "Cargo International · 201–300 kg",
        days: "5 Werktage",
        price: "290,00 €",
        isStandard: false,
        isExpress: false,
      },
      {
        method: "Cargo International · 301–400 kg",
        days: "5 Werktage",
        price: "370,00 €",
        isStandard: false,
        isExpress: false,
      },
      {
        method: "Cargo International · 401–500 kg",
        days: "5 Werktage",
        price: "450,00 €",
        isStandard: false,
        isExpress: false,
      },
    ],
  },
  {
    id: "schiefer-untersetzer",
    name: "Schiefer-Untersetzer",
    productCount: 78,
    matchProductTypes: ["schiefer-untersetzer", "schieferuntersetzer", "untersetzer"],
    matchTags: ["schiefer-untersetzer", "schieferuntersetzer", "untersetzer"],
    productionDays: "3–5 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "5,90 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "grillplatte-schlummerlichter",
    name: "Grillplatte und Schlummerlichter",
    productCount: 22,
    matchProductTypes: ["grillplatte", "schlummerlicht", "schlummerlichter"],
    matchTags: ["grillplatte", "schlummerlicht", "schlummerlichter"],
    productionDays: "3–5 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "12,90 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "holz-uhr",
    name: "Holz Uhr",
    productCount: 3,
    matchProductTypes: ["holz uhr", "holzuhr", "holz-uhr"],
    matchTags: ["holz-uhr", "holzuhr", "holz uhr"],
    productionDays: "4–6 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "5,90 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "tischplatte-120er",
    name: "Tischplatte 120er",
    productCount: 6,
    matchProductTypes: ["tischplatte 120er", "tischplatte", "tischplatte-120"],
    matchTags: ["tischplatte-120", "tischplatte", "120er"],
    productionDays: "5–7 Werktage",
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "30,00 €",
        freeFrom: "250,00 €",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
  {
    id: "klein-material",
    name: "Klein Material",
    productCount: 1,
    matchProductTypes: ["klein material", "kleinmaterial"],
    matchTags: ["klein-material", "kleinmaterial"],
    productionDays: null,
    rates: [
      {
        method: "Standard",
        days: "2–4 Werktage",
        price: "Kostenlos",
        isStandard: true,
        isExpress: false,
      },
    ],
  },
];

