/**
 * Versanddaten – live aus der Shopify Admin API (deliveryProfiles).
 * Fallback auf statische Config wenn die API nicht erreichbar ist.
 */

import type { CmsShippingOption, CmsShippingProfile } from "../../types/shopify";
import { adminFetch } from "./adminClient";
import { SHIPPING_PROFILES } from "./shipping-config";

// ─── GraphQL ─────────────────────────────────────────────────────────────────

const DELIVERY_PROFILES_QUERY = /* GraphQL */ `
  query DeliveryProfiles {
    deliveryProfiles(first: 30) {
      edges {
        node {
          id
          name
          default
          profileItems(first: 1) {
            edges { node { id } }
          }
          profileLocationGroups {
            locationGroupZones(first: 10) {
              edges {
                node {
                  zone { name }
                  methodDefinitions(first: 10) {
                    edges {
                      node {
                        name
                        active
                        rateProvider {
                          ... on DeliveryRateDefinition {
                            price { amount currencyCode }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Types (API response) ─────────────────────────────────────────────────────

interface ApiMethodDef {
  name: string;
  active: boolean;
  rateProvider: { price?: { amount: string; currencyCode: string } } | null;
}

interface ApiZone {
  zone: { name: string };
  methodDefinitions: { edges: { node: ApiMethodDef }[] };
}

interface ApiProfile {
  id: string;
  name: string;
  default: boolean;
  profileItems: { edges: { node: { id: string } }[] };
  profileLocationGroups: { locationGroupZones: { edges: { node: ApiZone }[] } }[];
}

interface ApiResponse {
  deliveryProfiles: { edges: { node: ApiProfile }[] };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEur(amount: string): string {
  const num = parseFloat(amount);
  return num === 0
    ? "Kostenlos"
    : num.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function isExpress(name: string): boolean {
  return /express|eilig|over.?night/i.test(name);
}

/** Parst "2–4 Werktage" / "1 Werktag" / "5 Werktage" zu {min, max}. */
function parseDayRange(label: string): { min: number; max: number } | null {
  const match = label.match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
  if (!match) return null;
  const min = parseInt(match[1], 10);
  const max = match[2] ? parseInt(match[2], 10) : min;
  return { min, max };
}

function formatDayRange(min: number, max: number): string {
  if (min === max) return `${min} Werktag${min === 1 ? "" : "e"}`;
  return `${min}–${max} Werktage`;
}

/**
 * Kombiniert Anfertigungszeit (vor Versandbeginn) mit der reinen Versanddauer
 * zur Gesamt-Lieferzeit, z.B. "5–8 Werktage" + "2–4 Werktage" → "7–12 Werktage".
 * Ohne Anfertigungszeit (Lagerware) entspricht das Ergebnis der Versanddauer.
 */
function combineProductionAndShipping(productionDays: string | null, shippingDaysLabel: string): string {
  if (!productionDays) return shippingDaysLabel;
  const production = parseDayRange(productionDays);
  const shipping = parseDayRange(shippingDaysLabel);
  if (!production || !shipping) return shippingDaysLabel;
  return formatDayRange(production.min + shipping.min, production.max + shipping.max);
}

function isStandard(name: string, methods: ApiMethodDef[]): boolean {
  // Mark first active method as standard if none explicitly named "Standard"
  const active = methods.filter((m) => m.active);
  if (active.length === 0) return false;
  const lower = name.toLowerCase();
  if (lower.includes("standard") || lower.includes("paket")) return true;
  return active[0].name === name; // first active = standard fallback
}

function profileToOption(method: ApiMethodDef, zoneName: string, sortOrder: number): CmsShippingOption | null {
  if (!method.active) return null;
  const price = method.rateProvider?.price;
  if (!price) return null;

  const days = "2–4 Werktage"; // Admin API liefert keine Tage — statisch befüllt
  return {
    zone:       zoneName,
    method:     method.name,
    days,                          // wird ggf. durch Matching mit static config ergänzt
    productionDays: null,          // wird ggf. durch Matching mit static config ergänzt
    totalDays:  days,
    price:      formatEur(price.amount),
    freeFrom:   null,              // wird ggf. durch Matching mit static config ergänzt
    isStandard: isStandard(method.name, [method]),
    isExpress:  isExpress(method.name),
    sortOrder,
  };
}

// ─── Statischer Fallback ──────────────────────────────────────────────────────

function staticToOption(
  rate: (typeof SHIPPING_PROFILES)[number]["rates"][number],
  sortOrder: number,
  productionDays: string | null,
): CmsShippingOption {
  return {
    zone:      "Deutschland",
    method:    rate.method,
    days:      rate.days,
    productionDays,
    totalDays: combineProductionAndShipping(productionDays, rate.days),
    price:     rate.price,
    freeFrom:  rate.freeFrom ?? null,
    isStandard: rate.isStandard,
    isExpress:  rate.isExpress,
    sortOrder,
  };
}

function buildStaticProfiles(): CmsShippingProfile[] {
  return SHIPPING_PROFILES.map((p) => ({
    id:           p.id,
    name:         p.name,
    isDefault:    false,
    productCount: p.productCount,
    options:      p.rates.map((r, i) => staticToOption(r, i, p.productionDays)),
  }));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Alle Versandprofile – für die Versandseite.
 * Versucht live-Daten; fällt bei Fehler auf statische Config zurück.
 */
export async function getShippingProfiles(): Promise<CmsShippingProfile[]> {
  try {
    const data = await adminFetch<ApiResponse>(DELIVERY_PROFILES_QUERY);

    return data.deliveryProfiles.edges
      .filter((e) => e.node.name !== "Personalisierung")  // ohne leere Profile
      .map((e) => {
        const p = e.node;
        const options: CmsShippingOption[] = [];
        let sortOrder = 0;

        for (const group of p.profileLocationGroups) {
          for (const ze of group.locationGroupZones.edges) {
            const zone = ze.node;
            for (const me of zone.methodDefinitions.edges) {
              const opt = profileToOption(me.node, zone.zone.name, sortOrder++);
              if (opt) options.push(opt);
            }
          }
        }

        // Ergänze freeFrom + days aus statischer Config anhand des Namens
        const staticMatch = SHIPPING_PROFILES.find((s) =>
          p.name.toLowerCase().includes(s.name.toLowerCase()) ||
          s.name.toLowerCase().includes(p.name.toLowerCase()),
        );
        if (staticMatch) {
          options.forEach((opt, i) => {
            const staticRate = staticMatch.rates[i];
            if (staticRate) {
              opt.freeFrom = staticRate.freeFrom ?? null;
              opt.days     = staticRate.days;
              opt.productionDays = staticMatch.productionDays;
              opt.totalDays = combineProductionAndShipping(staticMatch.productionDays, staticRate.days);
            }
          });
        }

        return {
          id:           p.id,
          name:         p.name,
          isDefault:    p.default,
          productCount: p.profileItems.edges.length,
          options,
        } satisfies CmsShippingProfile;
      });
  } catch (err) {
    console.warn("[shipping] Admin API nicht erreichbar, nutze statische Config:", err);
    return buildStaticProfiles();
  }
}

/**
 * Versandoptionen für ein einzelnes Produkt (PDP).
 * Matching: productType → Tags → null (= "Versand wird im Checkout berechnet").
 * Läuft synchron gegen die statische Config (kein API-Call pro Produkt).
 */
export function getShippingOptions(
  productTags: string[] = [],
  productType = "",
): CmsShippingOption[] | null {
  const typeLower = productType.toLowerCase().trim();
  const tagsLower = productTags.map((t) => t.toLowerCase().trim());

  if (typeLower) {
    const byType = SHIPPING_PROFILES.find((p) =>
      p.matchProductTypes.some(
        (mt) => typeLower === mt || typeLower.includes(mt) || mt.includes(typeLower),
      ),
    );
    if (byType) return byType.rates.map((r, i) => staticToOption(r, i, byType.productionDays));
  }

  if (tagsLower.length > 0) {
    const byTag = SHIPPING_PROFILES.find((p) =>
      p.matchTags.some((mt) => tagsLower.some((t) => t.includes(mt) || mt.includes(t))),
    );
    if (byTag) return byTag.rates.map((r, i) => staticToOption(r, i, byTag.productionDays));
  }

  return null;
}
