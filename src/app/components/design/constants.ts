// Shape-Katalog und Kategorien leben jetzt in shapes.ts — hier nur re-exportiert
// damit bestehende Importe weiterhin funktionieren.
export { SHAPE_CATALOG, SHAPE_CATEGORIES } from "./shapes";

export const CANVAS_BG = "#f5f5f4";

// ─── Canvas-Formate ───────────────────────────────────────────────────────────
// Jedes Produkt kann einem Preset zugewiesen werden.
// Neue Presets hier eintragen, neue Keywords in PRODUCT_CANVAS_MAP verknüpfen.

export interface CanvasPreset {
  id:     string;
  label:  string;
  width:  number;
  height: number;
}

export const CANVAS_PRESETS: CanvasPreset[] = [
  { id: "square-500", label: "Quadrat (Standard)",   width: 500, height: 500 },
  { id: "square-380", label: "Quadrat (Schale)",     width: 380, height: 380 },
  { id: "wide-560",   label: "Breit (Tisch/Platte)", width: 560, height: 360 },
  { id: "tall-380",   label: "Hochformat (Säule)",   width: 380, height: 520 },
];

// Keywords (Kleinbuchstaben) aus dem Produkttitel → Preset-ID
// Erste Übereinstimmung gewinnt — Reihenfolge beachten.
export const PRODUCT_CANVAS_MAP: Record<string, string> = {
  "feuerschale": "square-380",
  "schale":      "square-380",
  "bowl":        "square-380",
  "tisch":       "wide-560",
  "table":       "wide-560",
  "platte":      "wide-560",
  "säule":       "tall-380",
  "column":      "tall-380",
  // Tonne, Barrel usw. → Standard (square-500, kein Eintrag nötig)
};

export const DEFAULT_CANVAS_PRESET = CANVAS_PRESETS[0];

/** Hilfsfunktion: Produkttitel → passendes CanvasPreset */
export function getPresetForTitle(title: string): CanvasPreset {
  const lower = title.toLowerCase();
  for (const [kw, id] of Object.entries(PRODUCT_CANVAS_MAP)) {
    if (lower.includes(kw)) {
      return CANVAS_PRESETS.find((p) => p.id === id) ?? DEFAULT_CANVAS_PRESET;
    }
  }
  return DEFAULT_CANVAS_PRESET;
}

// Legacy-Export damit ältere Imports nicht brechen
export const CANVAS_SIZE = 500;

export const FONT_OPTIONS = [
  { label: "Playfair",   value: '"Playfair Display", Georgia, serif' },
  { label: "DM Sans",    value: '"DM Sans", system-ui, sans-serif' },
  { label: "Georgia",    value: "Georgia, serif" },
  { label: "Mono",       value: '"Courier New", monospace' },
  { label: "Arial",      value: "Arial, Helvetica, sans-serif" },
  { label: "Times",      value: '"Times New Roman", Times, serif' },
  { label: "Impact",     value: "Impact, Haettenschweiler, sans-serif" },
  { label: "Brush",      value: '"Brush Script MT", cursive' },
] as const;
