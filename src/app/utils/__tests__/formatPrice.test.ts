import { describe, it, expect } from "vitest";
import { formatPrice } from "../formatPrice";

describe("formatPrice", () => {
  it("formats EUR with German locale", () => {
    expect(formatPrice("29.99", "EUR")).toBe("29,99\u00a0€");
  });

  it("defaults to EUR when no currency code given", () => {
    expect(formatPrice("10.00")).toBe("10,00\u00a0€");
  });

  it("formats whole numbers without decimal noise", () => {
    expect(formatPrice("100.00", "EUR")).toBe("100,00\u00a0€");
  });

  it("handles string integers", () => {
    expect(formatPrice("5", "EUR")).toBe("5,00\u00a0€");
  });

  it("formats USD", () => {
    const result = formatPrice("49.99", "USD");
    expect(result).toContain("49,99");
    expect(result).toContain("$");
  });
});
