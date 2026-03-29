import type { CmsShippingOption, CmsShippingProfile } from "../../types/shopify";
import { SHIPPING_PROFILES, type StaticShippingRate } from "./shipping-config";

function toOption(rate: StaticShippingRate, sortOrder: number): CmsShippingOption {
  return {
    zone: "Deutschland",
    method: rate.method,
    days: rate.days,
    price: rate.price,
    freeFrom: rate.freeFrom ?? null,
    isStandard: rate.isStandard,
    isExpress: rate.isExpress,
    sortOrder,
  };
}

/** Alle Versandprofile — für die Versandseite. */
export function getShippingProfiles(): CmsShippingProfile[] {
  return SHIPPING_PROFILES.map((p) => ({
    id: p.id,
    name: p.name,
    isDefault: false,
    productCount: p.productCount,
    options: p.rates.map(toOption),
  }));
}

/**
 * Versandoptionen für ein Produkt.
 * Matching: productType zuerst (exakt, case-insensitive), dann Tags (substring).
 * Gibt null zurück wenn kein Profil passt → PDP zeigt "Versand wird im Checkout berechnet".
 */
export function getShippingOptions(
  productTags: string[] = [],
  productType = "",
): CmsShippingOption[] | null {
  const typeLower = productType.toLowerCase().trim();
  const tagsLower = productTags.map((t) => t.toLowerCase().trim());

  // 1. productType exakt oder als Substring gegen matchProductTypes
  if (typeLower) {
    const byType = SHIPPING_PROFILES.find((p) =>
      p.matchProductTypes.some(
        (mt) => typeLower === mt || typeLower.includes(mt) || mt.includes(typeLower),
      ),
    );
    if (byType) return byType.rates.map(toOption);
  }

  // 2. Tags als Substring gegen matchTags
  if (tagsLower.length > 0) {
    const byTag = SHIPPING_PROFILES.find((p) =>
      p.matchTags.some((mt) => tagsLower.some((t) => t.includes(mt) || mt.includes(t))),
    );
    if (byTag) return byTag.rates.map(toOption);
  }

  return null;
}
