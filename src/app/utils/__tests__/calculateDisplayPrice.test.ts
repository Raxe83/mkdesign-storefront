import { describe, it, expect } from "vitest";
import { calculateDisplayPrice } from "../calculateDisplayPrice";

const eur = (amount: string) => ({ price: { amount, currencyCode: "EUR" } });

describe("calculateDisplayPrice", () => {
  it("returns base price when no addons selected", () => {
    const result = calculateDisplayPrice("29.99", "EUR", []);
    expect(result).toEqual({ amount: "29.99", currencyCode: "EUR" });
  });

  it("adds a single addon to the base price", () => {
    const result = calculateDisplayPrice("29.99", "EUR", [eur("5.00")]);
    expect(result.amount).toBe("34.99");
    expect(result.currencyCode).toBe("EUR");
  });

  it("adds multiple addons", () => {
    const result = calculateDisplayPrice("100.00", "EUR", [eur("10.00"), eur("5.50")]);
    expect(result.amount).toBe("115.50");
  });

  it("uses the currency code from the first addon (not base)", () => {
    const usdAddon = { price: { amount: "5.00", currencyCode: "USD" } };
    const result = calculateDisplayPrice("29.99", "EUR", [usdAddon]);
    expect(result.currencyCode).toBe("USD");
  });

  it("handles floating point sums correctly (toFixed precision)", () => {
    // 0.1 + 0.2 floating point pitfall
    const result = calculateDisplayPrice("0.10", "EUR", [eur("0.20")]);
    expect(result.amount).toBe("0.30");
  });
});
