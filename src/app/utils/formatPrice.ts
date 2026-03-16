export function formatPrice(amount: string, currencyCode = "EUR"): string {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amount))
  }
  
  