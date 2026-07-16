import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Erzeugt eine kurze, eindeutige ID zur Verknüpfung zusammengehöriger
 * Warenkorb-Zeilen (Hauptprodukt + Zusatzprodukt/Seite B) über das
 * `_lineGroup`/`_linkedTo`-Attributpaar. Wird NICHT von der Produktvariante
 * abgeleitet — so bleiben mehrere Käufe desselben Produkts mit
 * unterschiedlicher Personalisierung als getrennte Warenkorb-Zeilen
 * eindeutig zuordenbar (vorher: `_linkedTo` = Varianten-ID, wodurch zwei
 * Zeilen derselben Variante dieselben Zusatzprodukte "geerbt" haben).
 */
export function generateLineGroupId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// utils.ts (oder wo auch immer deine Hilfsfunktionen liegen)

export function hexLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  let r: number, g: number, b: number;
  if (clean.length === 3 || clean.length === 4) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  }
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function shapeColorForProduct(
  productColor: string,
  threshold = 40,
): "#ffffff" | "#000000" {
  if (!productColor.startsWith("#")) return "#000000";
  return hexLuminance(productColor) <= threshold ? "#ffffff" : "#000000";
}
