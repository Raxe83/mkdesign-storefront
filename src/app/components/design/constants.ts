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

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  DEV-CONFIG: Canvas-Dimensionen pro Preset                             │
// │  Hier die width/height anpassen um die Zeichenfläche zu vergrößern /   │
// │  verkleinern. Die Werte gelten für das native Fabric.js-Canvas;        │
// │  die Anzeigegröße skaliert automatisch auf den verfügbaren Platz.      │
// └─────────────────────────────────────────────────────────────────────────┘
export const CANVAS_PRESETS: CanvasPreset[] = [
  { id: "square-500", label: "Quadrat (Standard)",   width: 700, height: 700 },
  { id: "square-380", label: "Quadrat (Schale)",     width: 560, height: 560 },
  { id: "wide-560",   label: "Breit (Tisch/Platte)", width: 760, height: 480 },
  { id: "tall-380",   label: "Hochformat (Säule)",   width: 520, height: 720 },
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
  // Serif
  { label: "Playfair",    value: '"Playfair Display", Georgia, serif',        google: "Playfair+Display:wght@400;700" },
  { label: "Cinzel",      value: '"Cinzel", Georgia, serif',                   google: "Cinzel:wght@400;700" },
  { label: "Georgia",     value: "Georgia, serif",                              google: null },
  { label: "Times",       value: '"Times New Roman", Times, serif',            google: null },
  // Sans-Serif
  { label: "DM Sans",     value: '"DM Sans", system-ui, sans-serif',           google: "DM+Sans:wght@400;700" },
  { label: "Oswald",      value: '"Oswald", sans-serif',                        google: "Oswald:wght@400;700" },
  { label: "Bebas",       value: '"Bebas Neue", Impact, sans-serif',            google: "Bebas+Neue" },
  { label: "Orbitron",    value: '"Orbitron", monospace',                       google: "Orbitron:wght@400;700" },
  // Script / Display
  { label: "Dancing",     value: '"Dancing Script", cursive',                   google: "Dancing+Script:wght@400;700" },
  { label: "Pacifico",    value: '"Pacifico", cursive',                         google: "Pacifico" },
  { label: "Lobster",     value: '"Lobster", cursive',                          google: "Lobster" },
  // Mono / Technical
  { label: "Mono",        value: '"Courier New", monospace',                    google: null },
  { label: "Impact",      value: "Impact, Haettenschweiler, sans-serif",        google: null },
] as const;
