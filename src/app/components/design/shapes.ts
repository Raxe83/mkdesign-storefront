import type { ShapeEntry } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SHAPES — Zentrale Katalog-Datei
// ─────────────────────────────────────────────────────────────────────────────
//
// Neue SVG-Form hinzufügen:
//
//   1. SVG-Markup als `markup`-String angeben (viewBox empfohlen)
//   2. Kategorie "SVG" verwenden – oder neue Kategorie in SHAPE_CATEGORIES eintragen
//   3. Einzigartige `id` und deutschen `label` vergeben
//
//   Beispiel:
//   {
//     id: "my-logo",
//     label: "Mein Logo",
//     cat: "SVG",
//     fc: {
//       k: "svg",
//       markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
//                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="4"/>
//                </svg>`,
//     },
//   },
//
// ─────────────────────────────────────────────────────────────────────────────

export const SHAPE_CATEGORIES = [
  "Alle", "Grundformen", "Vielecke", "Sterne", "Pfeile", "Symbole", "Natur", "Icons", "SVG",
] as const;

/* ── Geometrie-Hilfsfunktionen ────────────────────────────────────────────── */

// Rundet auf 4 Dezimalstellen — verhindert Floating-Point-Abweichungen
// zwischen Node.js (SSR) und Browser-V8, die zu Hydration-Fehlern führen.
const r4 = (n: number) => Math.round(n * 10000) / 10000;

function starPoints(outerR: number, innerR: number, numPts: number) {
  return Array.from({ length: numPts * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (Math.PI / numPts) * i - Math.PI / 2;
    return { x: r4(r * Math.cos(a)), y: r4(r * Math.sin(a)) };
  });
}

function polyPoints(r: number, sides: number, startAngle = 0) {
  return Array.from({ length: sides }, (_, i) => {
    const a = (2 * Math.PI * i) / sides + startAngle;
    return { x: r4(r * Math.cos(a)), y: r4(r * Math.sin(a)) };
  });
}

/* ── Shape-Katalog ────────────────────────────────────────────────────────── */

export const SHAPE_CATALOG: ShapeEntry[] = [
  // ── Grundformen ─────────────────────────────────────────────────────────
  { id: "rect",      label: "Rechteck",      cat: "Grundformen", fc: { k: "rect",     w: 140, h: 90 } },
  { id: "square",    label: "Quadrat",       cat: "Grundformen", fc: { k: "rect",     w: 110, h: 110 } },
  { id: "circle",    label: "Kreis",         cat: "Grundformen", fc: { k: "circle",   r: 55 } },
  { id: "ellipse",   label: "Ellipse",       cat: "Grundformen", fc: { k: "ellipse",  rx: 72, ry: 44 } },
  { id: "triangle",  label: "Dreieck",       cat: "Grundformen", fc: { k: "triangle", w: 130, h: 110 } },
  { id: "roundrect", label: "Abger. Rect",   cat: "Grundformen", fc: { k: "rect",     w: 140, h: 90, rx: 18 } },
  { id: "line",      label: "Linie",         cat: "Grundformen", fc: { k: "line" } },
  // ── Vielecke ────────────────────────────────────────────────────────────
  { id: "pentagon",  label: "Fünfeck",        cat: "Vielecke", fc: { k: "poly", pts: polyPoints(62, 5, -Math.PI / 2) } },
  { id: "hexagon",   label: "Sechseck",       cat: "Vielecke", fc: { k: "poly", pts: polyPoints(62, 6) } },
  { id: "heptagon",  label: "Siebeneck",      cat: "Vielecke", fc: { k: "poly", pts: polyPoints(62, 7, -Math.PI / 2) } },
  { id: "octagon",   label: "Achteck",        cat: "Vielecke", fc: { k: "poly", pts: polyPoints(62, 8, -Math.PI / 8) } },
  { id: "diamond",   label: "Raute",          cat: "Vielecke", fc: { k: "poly", pts: [{ x: 0, y: -68 }, { x: 54, y: 0 }, { x: 0, y: 68 }, { x: -54, y: 0 }] } },
  { id: "trapez",    label: "Trapez",         cat: "Vielecke", fc: { k: "poly", pts: [{ x: -38, y: -42 }, { x: 38, y: -42 }, { x: 55, y: 42 }, { x: -55, y: 42 }] } },
  { id: "parallelo", label: "Parallelogramm", cat: "Vielecke", fc: { k: "poly", pts: [{ x: -35, y: 42 }, { x: 55, y: 42 }, { x: 35, y: -42 }, { x: -55, y: -42 }] } },
  // ── Sterne ──────────────────────────────────────────────────────────────
  { id: "star3",   label: "3-Zacken", cat: "Sterne", fc: { k: "poly", pts: starPoints(62, 26, 3) } },
  { id: "star4",   label: "4-Zacken", cat: "Sterne", fc: { k: "poly", pts: starPoints(62, 26, 4) } },
  { id: "star5",   label: "5-Zacken", cat: "Sterne", fc: { k: "poly", pts: starPoints(62, 26, 5) } },
  { id: "star6",   label: "6-Zacken", cat: "Sterne", fc: { k: "poly", pts: starPoints(62, 26, 6) } },
  { id: "star8",   label: "8-Zacken", cat: "Sterne", fc: { k: "poly", pts: starPoints(62, 26, 8) } },
  { id: "burst",   label: "Strahlen", cat: "Sterne", fc: { k: "poly", pts: starPoints(62, 44, 16) } },
  { id: "rosette", label: "Rosette",  cat: "Sterne", fc: { k: "poly", pts: starPoints(62, 36, 12) } },
  // ── Pfeile ──────────────────────────────────────────────────────────────
  { id: "arr-r",  label: "→ Pfeil",   cat: "Pfeile", fc: { k: "poly", pts: [{ x: -52, y: -22 }, { x: 10, y: -22 }, { x: 10, y: -48 }, { x: 62, y: 0 }, { x: 10, y: 48 }, { x: 10, y: 22 }, { x: -52, y: 22 }] } },
  { id: "arr-l",  label: "← Pfeil",   cat: "Pfeile", fc: { k: "poly", pts: [{ x: 52, y: -22 }, { x: -10, y: -22 }, { x: -10, y: -48 }, { x: -62, y: 0 }, { x: -10, y: 48 }, { x: -10, y: 22 }, { x: 52, y: 22 }] } },
  { id: "arr-u",  label: "↑ Pfeil",   cat: "Pfeile", fc: { k: "poly", pts: [{ x: -22, y: 52 }, { x: -22, y: -10 }, { x: -48, y: -10 }, { x: 0, y: -62 }, { x: 48, y: -10 }, { x: 22, y: -10 }, { x: 22, y: 52 }] } },
  { id: "arr-d",  label: "↓ Pfeil",   cat: "Pfeile", fc: { k: "poly", pts: [{ x: -22, y: -52 }, { x: -22, y: 10 }, { x: -48, y: 10 }, { x: 0, y: 62 }, { x: 48, y: 10 }, { x: 22, y: 10 }, { x: 22, y: -52 }] } },
  { id: "arr-lr", label: "↔ Doppel",  cat: "Pfeile", fc: { k: "poly", pts: [{ x: -62, y: 0 }, { x: -24, y: -36 }, { x: -24, y: -16 }, { x: 24, y: -16 }, { x: 24, y: -36 }, { x: 62, y: 0 }, { x: 24, y: 36 }, { x: 24, y: 16 }, { x: -24, y: 16 }, { x: -24, y: 36 }] } },
  { id: "chev-r", label: "Chevron →", cat: "Pfeile", fc: { k: "poly", pts: [{ x: -28, y: -58 }, { x: 28, y: 0 }, { x: -28, y: 58 }, { x: -8, y: 58 }, { x: 48, y: 0 }, { x: -8, y: -58 }] } },
  { id: "chev-l", label: "Chevron ←", cat: "Pfeile", fc: { k: "poly", pts: [{ x: 28, y: -58 }, { x: -28, y: 0 }, { x: 28, y: 58 }, { x: 8, y: 58 }, { x: -48, y: 0 }, { x: 8, y: -58 }] } },
  { id: "notch",  label: "Kerbe →",   cat: "Pfeile", fc: { k: "poly", pts: [{ x: -60, y: -36 }, { x: 20, y: -36 }, { x: 60, y: 0 }, { x: 20, y: 36 }, { x: -60, y: 36 }, { x: -30, y: 0 }] } },
  // ── Symbole ─────────────────────────────────────────────────────────────
  { id: "heart",    label: "Herz",        cat: "Symbole", fc: { k: "path", d: "M 0 -22 C -5 -42 -42 -42 -42 -16 C -42 12 -22 32 0 54 C 22 32 42 12 42 -16 C 42 -42 5 -42 0 -22 Z" } },
  { id: "plus",     label: "Plus",        cat: "Symbole", fc: { k: "poly", pts: [{ x: -14, y: -58 }, { x: 14, y: -58 }, { x: 14, y: -14 }, { x: 58, y: -14 }, { x: 58, y: 14 }, { x: 14, y: 14 }, { x: 14, y: 58 }, { x: -14, y: 58 }, { x: -14, y: 14 }, { x: -58, y: 14 }, { x: -58, y: -14 }, { x: -14, y: -14 }] } },
  { id: "shield",   label: "Schild",      cat: "Symbole", fc: { k: "path", d: "M 0 -58 L -48 -30 L -48 12 C -48 42 0 64 0 64 C 0 64 48 42 48 12 L 48 -30 Z" } },
  { id: "crown",    label: "Krone",       cat: "Symbole", fc: { k: "poly", pts: [{ x: -56, y: 34 }, { x: -56, y: -14 }, { x: -30, y: 14 }, { x: 0, y: -38 }, { x: 30, y: 14 }, { x: 56, y: -14 }, { x: 56, y: 34 }] } },
  { id: "cloud",    label: "Wolke",       cat: "Symbole", fc: { k: "path", d: "M -30 22 C -52 22 -58 -5 -42 -17 C -47 -44 -15 -54 4 -37 C 10 -57 42 -57 50 -37 C 68 -37 68 -10 52 5 L 52 22 Z" } },
  { id: "lightning",label: "Blitz",       cat: "Symbole", fc: { k: "poly", pts: [{ x: 12, y: -60 }, { x: -18, y: 8 }, { x: 4, y: 8 }, { x: -12, y: 60 }, { x: 30, y: -8 }, { x: 8, y: -8 }] } },
  { id: "speech",   label: "Sprechblase", cat: "Symbole", fc: { k: "path", d: "M -52 -44 L 52 -44 L 52 20 L 14 20 L -8 52 L -8 20 L -52 20 Z" } },
  { id: "tag",      label: "Etikett",     cat: "Symbole", fc: { k: "poly", pts: [{ x: -56, y: -42 }, { x: 14, y: -42 }, { x: 58, y: 0 }, { x: 14, y: 42 }, { x: -56, y: 42 }] } },
  { id: "infinity", label: "Unendlich",   cat: "Symbole", fc: { k: "path", d: "M -28 0 C -28 -24 -15 -34 0 -17 C 15 -34 28 -24 28 0 C 28 24 15 34 0 17 C -15 34 -28 24 -28 0 Z" } },
  { id: "bookmark", label: "Lesezeichen", cat: "Symbole", fc: { k: "poly", pts: [{ x: -40, y: -60 }, { x: 40, y: -60 }, { x: 40, y: 60 }, { x: 0, y: 32 }, { x: -40, y: 60 }] } },
  // ── Natur ────────────────────────────────────────────────────────────────
  { id: "leaf",      label: "Blatt",        cat: "Natur", fc: { k: "path", d: "M 0 -62 C 36 -32 46 0 26 42 C 16 56 -16 56 -26 42 C -46 0 -36 -32 0 -62 Z" } },
  { id: "drop",      label: "Tropfen",      cat: "Natur", fc: { k: "path", d: "M 0 -62 C -33 -16 -40 18 -40 28 C -40 52 -22 64 0 64 C 22 64 40 52 40 28 C 40 18 33 -16 0 -62 Z" } },
  { id: "crescent",  label: "Halbmond",     cat: "Natur", fc: { k: "path", d: "M 4 -56 C 26 -46 40 -24 40 0 C 40 24 26 46 4 56 C -12 50 -22 38 -26 24 C -10 18 4 6 4 -4 C 4 -14 -10 -28 -26 -36 C -22 -52 -12 -60 4 -56 Z" } },
  { id: "sun",       label: "Sonne",        cat: "Natur", fc: { k: "poly", pts: starPoints(62, 40, 12) } },
  { id: "flower",    label: "Blume",        cat: "Natur", fc: { k: "poly", pts: starPoints(62, 22, 8) } },
  { id: "snowflake", label: "Schneeflocke", cat: "Natur", fc: { k: "path", d: "M 0 -60 L 0 60 M -60 0 L 60 0 M -42 -42 L 42 42 M 42 -42 L -42 42 M -16 -44 L 0 -60 L 16 -44 M -16 44 L 0 60 L 16 44 M -44 -16 L -60 0 L -44 16 M 44 -16 L 60 0 L 44 16" } },
  { id: "tree",      label: "Baum",         cat: "Natur", fc: { k: "poly", pts: [{ x: 0, y: -62 }, { x: 40, y: -10 }, { x: 20, y: -10 }, { x: 38, y: 22 }, { x: 16, y: 22 }, { x: 30, y: 54 }, { x: -30, y: 54 }, { x: -16, y: 22 }, { x: -38, y: 22 }, { x: -20, y: -10 }, { x: -40, y: -10 }] } },
  // ── Icons ────────────────────────────────────────────────────────────────
  { id: "flame",  label: "Flamme",    cat: "Icons", fc: { k: "path", d: "M 0 60 C -36 60 -52 36 -52 16 C -52 -6 -38 -20 -28 -30 C -20 -38 -15 -47 -14 -58 C -6 -42 -4 -32 -10 -16 C -2 -26 5 -42 0 -62 C 16 -44 26 -26 20 -10 C 26 -20 28 -36 22 -50 C 36 -34 52 -6 52 16 C 52 36 36 60 0 60 Z" } },
  { id: "peace",  label: "Frieden",   cat: "Icons", fc: { k: "path", d: "M 0 -58 C 32 -58 58 -32 58 0 C 58 32 32 58 0 58 C -32 58 -58 32 -58 0 C -58 -32 -32 -58 0 -58 Z M 0 -58 L 0 58 M 0 0 L -42 40 M 0 0 L 42 40" } },
  { id: "note",   label: "Musiknote", cat: "Icons", fc: { k: "path", d: "M 10 -48 L 42 -58 L 42 -32 L 10 -22 Z M 10 -22 L 10 24 C 10 36 -16 42 -16 30 C -16 18 10 20 10 30 Z" } },
  { id: "eye",    label: "Auge",      cat: "Icons", fc: { k: "path", d: "M -58 0 C -40 -36 40 -36 58 0 C 40 36 -40 36 -58 0 Z M 0 -18 C 10 -18 18 -10 18 0 C 18 10 10 18 0 18 C -10 18 -18 10 -18 0 C -18 -10 -10 -18 0 -18 Z" } },
  { id: "lock",   label: "Schloss",   cat: "Icons", fc: { k: "path", d: "M -30 -4 L -30 -30 C -30 -52 30 -52 30 -30 L 30 -4 M -44 -4 L 44 -4 L 44 58 L -44 58 Z M 0 20 C 8 20 14 26 14 34 C 14 42 8 48 0 48 C -8 48 -14 42 -14 34 C -14 26 -8 20 0 20 Z" } },
  { id: "smiley", label: "Smiley",    cat: "Icons", fc: { k: "path", d: "M 0 -58 C 32 -58 58 -32 58 0 C 58 32 32 58 0 58 C -32 58 -58 32 -58 0 C -58 -32 -32 -58 0 -58 Z M -20 -16 C -16 -16 -12 -20 -12 -24 C -12 -28 -16 -32 -20 -32 C -24 -32 -28 -28 -28 -24 C -28 -20 -24 -16 -20 -16 Z M 20 -16 C 24 -16 28 -20 28 -24 C 28 -28 24 -32 20 -32 C 16 -32 12 -28 12 -24 C 12 -20 16 -16 20 -16 Z M -28 14 C -20 34 20 34 28 14" } },
  { id: "gem",    label: "Diamant",   cat: "Icons", fc: { k: "poly", pts: [{ x: 0, y: -60 }, { x: 42, y: -22 }, { x: 62, y: -22 }, { x: 0, y: 60 }, { x: -62, y: -22 }, { x: -42, y: -22 }] } },

  // ── SVG — eigene Vektoren ────────────────────────────────────────────────
  // Hier neue SVG-Formen hinzufügen (Anleitung am Anfang dieser Datei lesen)

  {
    id: "svg-feuertonne",
    label: "Feuertonne",
    cat: "SVG",
    fc: {
      k: "svg",
      markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
        <ellipse cx="50" cy="85" rx="38" ry="11" fill="none" stroke="#1c1917" stroke-width="3"/>
        <path d="M 12 85 L 12 52 Q 12 18 50 18 Q 88 18 88 52 L 88 85" fill="none" stroke="#1c1917" stroke-width="3" stroke-linejoin="round"/>
        <line x1="12" y1="65" x2="88" y2="65" stroke="#1c1917" stroke-width="2" stroke-dasharray="4,3"/>
        <line x1="28" y1="85" x2="23" y2="100" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
        <line x1="50" y1="85" x2="50" y2="100" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
        <line x1="72" y1="85" x2="77" y2="100" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    },
  },
  {
    id: "svg-badge-round",
    label: "Rundes Badge",
    cat: "SVG",
    fc: {
      k: "svg",
      markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#1c1917" stroke-width="3"/>
        <circle cx="50" cy="50" r="36" fill="none" stroke="#1c1917" stroke-width="1.5" stroke-dasharray="3,2"/>
      </svg>`,
    },
  },
  {
    id: "svg-label-banner",
    label: "Banner",
    cat: "SVG",
    fc: {
      k: "svg",
      markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60">
        <path d="M 0 0 L 110 0 L 120 30 L 110 60 L 0 60 L 10 30 Z" fill="none" stroke="#1c1917" stroke-width="3" stroke-linejoin="round"/>
      </svg>`,
    },
  },
  {
    id: "svg-crosshair",
    label: "Fadenkreuz",
    cat: "SVG",
    fc: {
      k: "svg",
      markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="none" stroke="#1c1917" stroke-width="3"/>
        <line x1="50" y1="4"  x2="50" y2="22" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
        <line x1="50" y1="78" x2="50" y2="96" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
        <line x1="4"  y1="50" x2="22" y2="50" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
        <line x1="78" y1="50" x2="96" y2="50" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    },
  },
];
