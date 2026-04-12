export interface PriceAmount {
  amount: string;
  currencyCode: string;
}

export interface AddonItem {
  price: PriceAmount;
}

/**
 * Calculates the display price for a product including any selected addon items.
 * Returns the base price if no addons are selected.
 */
export function calculateDisplayPrice(
  basePrice: string,
  baseCurrencyCode: string,
  addons: AddonItem[],
): PriceAmount {
  if (addons.length === 0) {
    return { amount: basePrice, currencyCode: baseCurrencyCode };
  }
  const base = parseFloat(basePrice);
  const addonsTotal = addons.reduce(
    (sum, v) => sum + parseFloat(v.price.amount),
    0,
  );
  return {
    amount: (base + addonsTotal).toFixed(2),
    currencyCode: addons[0].price.currencyCode,
  };
}
