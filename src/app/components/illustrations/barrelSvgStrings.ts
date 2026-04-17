/**
 * SVG-Strings der Feuertonen-Varianten für Fabric.js Canvas-Hintergründe.
 * Identische Geometrie wie FireBarrels.tsx, aber als reine Template-Strings
 * damit sie als Blob-URL in FabricImage geladen werden können.
 *
 * Varianten:  full | noLegs | schaleXL | schale | stehtisch
 */

// ─── Shared defs ──────────────────────────────────────────────────────────────

function defs(id: string) {
  return `
  <defs>
    <radialGradient id="${id}Bg" cx="50%" cy="35%" r="75%">
      <stop offset="0%"   stop-color="#292524"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </radialGradient>
    <linearGradient id="${id}Barrel" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#161412"/>
      <stop offset="28%"  stop-color="#3c3836"/>
      <stop offset="60%"  stop-color="#252220"/>
      <stop offset="82%"  stop-color="#38342f"/>
      <stop offset="100%" stop-color="#161412"/>
    </linearGradient>
    <linearGradient id="${id}Ring" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#292522"/>
      <stop offset="40%"  stop-color="#6b6460"/>
      <stop offset="100%" stop-color="#292522"/>
    </linearGradient>
    <linearGradient id="${id}WoodEdge" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#8c6030"/>
      <stop offset="50%"  stop-color="#6b4820"/>
      <stop offset="100%" stop-color="#3d2812"/>
    </linearGradient>
    <radialGradient id="${id}WoodTop" cx="38%" cy="38%" r="65%">
      <stop offset="0%"   stop-color="#d4944a"/>
      <stop offset="45%"  stop-color="#a86c30"/>
      <stop offset="100%" stop-color="#5c3a18"/>
    </radialGradient>
    <radialGradient id="${id}Flame" cx="50%" cy="100%" r="90%">
      <stop offset="0%"   stop-color="#f97316" stop-opacity="0.55"/>
      <stop offset="50%"  stop-color="#ea580c" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}TopGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#fb923c" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#fb923c" stop-opacity="0"/>
    </radialGradient>
    <filter id="${id}Shadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>`;
}

// ─── Shared parts ─────────────────────────────────────────────────────────────

const legs = `
  <path d="M 108,335 L 104,362 Q 103,366 108,366 L 114,366 Q 119,365 118,361 L 113,335 Z" fill="#3a3532"/>
  <path d="M 192,335 L 188,361 Q 187,365 193,366 L 199,366 Q 204,365 203,361 L 200,335 Z" fill="#3a3532"/>
  <path d="M 147,335 L 145,361 Q 144,365 149,366 L 155,366 Q 160,365 158,361 L 156,335 Z" fill="#302d2a"/>`;

const bottomCap = `
  <ellipse cx="150" cy="335" rx="82" ry="13" fill="#1a1815" stroke="#3c3836" stroke-width="1.5"/>`;

function barrelBody(id: string) {
  return `
  <path d="M 68,60 C 60,150 58,235 68,335 L 232,335 C 242,235 240,150 232,60 Z"
    fill="url(#${id}Barrel)" filter="url(#${id}Shadow)"/>
  <path d="M 116,68 C 113,155 112,238 114,328 Q 118,333 122,328 C 120,238 119,155 120,68 Z"
    fill="white" opacity="0.025"/>`;
}

function ring1(id: string) {
  return `<path d="M 67,150 C 55,153 55,157 67,160 L 233,160 C 245,157 245,153 233,150 Z"
    fill="url(#${id}Ring)" stroke="#57534e" stroke-width="0.3"/>`;
}

function ring2(id: string) {
  return `<path d="M 65,242 C 53,245 53,249 65,252 L 235,252 C 247,249 247,245 235,242 Z"
    fill="url(#${id}Ring)" stroke="#57534e" stroke-width="0.3"/>`;
}

function topRim(id: string) {
  return `
  <ellipse cx="150" cy="60" rx="82" ry="14" fill="#222020" stroke="#57534e" stroke-width="1.8"/>
  <ellipse cx="150" cy="60" rx="70" ry="11" fill="#0f0d0c"/>
  <ellipse cx="150" cy="60" rx="70" ry="11" fill="url(#${id}Flame)"/>
  <ellipse cx="150" cy="42" rx="58" ry="28" fill="url(#${id}TopGlow)"/>
  <ellipse cx="150" cy="28" rx="38" ry="18" fill="#f97316" opacity="0.05"/>`;
}

function cutRim(id: string, cy: number, rx = 86, ry = 14) {
  return `
  <ellipse cx="150" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1e1c1a" stroke="#57534e" stroke-width="1.5"/>
  <ellipse cx="150" cy="${cy}" rx="${rx - 8}" ry="${ry - 4}" fill="#0f0d0c"/>
  <ellipse cx="150" cy="${cy}" rx="${rx - 8}" ry="${ry - 4}" fill="url(#${id}Flame)"/>
  <ellipse cx="150" cy="${cy - 10}" rx="${rx - 14}" ry="${ry + 8}" fill="url(#${id}TopGlow)" opacity="0.7"/>`;
}

function floorShadow(cy = 372) {
  return `<ellipse cx="150" cy="${cy}" rx="72" ry="6" fill="#000" opacity="0.4"/>`;
}

function woodTabletop(id: string) {
  return `
  <!-- Halter links -->
  <rect x="107" y="50" width="9" height="14" rx="1.5" fill="#3a3532" stroke="#57534e" stroke-width="0.6"/>
  <rect x="109" y="51" width="3" height="12" rx="1" fill="#5a5450" opacity="0.35"/>
  <!-- Halter rechts -->
  <rect x="184" y="50" width="9" height="14" rx="1.5" fill="#3a3532" stroke="#57534e" stroke-width="0.6"/>
  <rect x="186" y="51" width="3" height="12" rx="1" fill="#5a5450" opacity="0.35"/>
  <!-- Tischplatte Kante -->
  <ellipse cx="150" cy="42" rx="148" ry="10" fill="url(#${id}WoodEdge)" stroke="#3d2812" stroke-width="1"/>
  <!-- Tischplatte Oberfläche -->
  <ellipse cx="150" cy="32" rx="146" ry="10" fill="url(#${id}WoodTop)" stroke="#7a5228" stroke-width="1"/>
  <!-- Maserung -->
  <g stroke="#c07a38" stroke-width="1" fill="none" opacity="0.22">
    <path d="M -22,29 Q 150,23 322,29"/>
    <path d="M -24,32 Q 150,26 324,32"/>
    <path d="M -20,35 Q 150,29 320,35"/>
    <path d="M -14,39 Q 150,33 314,39"/>
  </g>
  <ellipse cx="110" cy="28" rx="55" ry="5" fill="white" opacity="0.1"/>`;
}

// ─── SVG-String-Generatoren ────────────────────────────────────────────────────

export function svgBarrelFull(): string {
  const id = "cvFull";
  return `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  ${defs(id)}
  <rect width="300" height="400" fill="url(#${id}Bg)"/>
  ${floorShadow()}
  ${legs}
  ${bottomCap}
  ${barrelBody(id)}
  ${ring1(id)}
  ${ring2(id)}
  ${topRim(id)}
</svg>`;
}

export function svgBarrelNoLegs(): string {
  const id = "cvNoLegs";
  return `<svg viewBox="0 0 300 355" xmlns="http://www.w3.org/2000/svg">
  ${defs(id)}
  <rect width="300" height="355" fill="url(#${id}Bg)"/>
  ${floorShadow(348)}
  ${bottomCap}
  ${barrelBody(id)}
  ${ring1(id)}
  ${ring2(id)}
  ${topRim(id)}
</svg>`;
}

export function svgBarrelSchaleXL(): string {
  const id = "cvSchaleXL";
  return `<svg viewBox="0 138 300 262" xmlns="http://www.w3.org/2000/svg">
  ${defs(id)}
  <defs>
    <clipPath id="${id}Clip">
      <rect x="0" y="155" width="300" height="220"/>
    </clipPath>
  </defs>
  <rect x="0" y="138" width="300" height="262" fill="url(#${id}Bg)"/>
  ${floorShadow()}
  ${legs}
  ${bottomCap}
  <g clip-path="url(#${id}Clip)">
    ${barrelBody(id)}
  </g>
  ${ring2(id)}
  ${cutRim(id, 155, 86, 14)}
</svg>`;
}

export function svgBarrelSchale(): string {
  const id = "cvSchale";
  return `<svg viewBox="0 230 300 170" xmlns="http://www.w3.org/2000/svg">
  ${defs(id)}
  <defs>
    <clipPath id="${id}Clip">
      <rect x="0" y="247" width="300" height="130"/>
    </clipPath>
  </defs>
  <rect x="0" y="230" width="300" height="170" fill="url(#${id}Bg)"/>
  ${floorShadow()}
  ${legs}
  ${bottomCap}
  <g clip-path="url(#${id}Clip)">
    ${barrelBody(id)}
  </g>
  ${cutRim(id, 247, 86, 14)}
</svg>`;
}

export function svgBarrelStehtisch(): string {
  const id = "cvStehtisch";
  return `<svg viewBox="0 -10 300 410" xmlns="http://www.w3.org/2000/svg">
  ${defs(id)}
  <rect x="0" y="-10" width="300" height="410" fill="url(#${id}Bg)"/>
  ${floorShadow()}
  ${legs}
  ${bottomCap}
  ${barrelBody(id)}
  ${ring1(id)}
  ${ring2(id)}
  <ellipse cx="150" cy="60" rx="82" ry="14" fill="#222020" stroke="#57534e" stroke-width="1.8"/>
  ${woodTabletop(id)}
</svg>`;
}

// ─── Mapping: Produkttitel → SVG-String ───────────────────────────────────────

const BARREL_SVG_MAP: Array<{ keywords: string[]; fn: () => string }> = [
  { keywords: ["stehtisch", "tisch", "table", "platte"], fn: svgBarrelStehtisch },
  { keywords: ["schale xl", "xl schale"],                fn: svgBarrelSchaleXL  },
  { keywords: ["schale", "feuerschale", "bowl"],         fn: svgBarrelSchale    },
  { keywords: ["tonne", "barrel", "feuertonne"],         fn: svgBarrelFull      },
];

export function getBarrelSvgForTitle(title: string): string {
  const lower = title.toLowerCase();
  for (const { keywords, fn } of BARREL_SVG_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return fn();
  }
  return svgBarrelFull();
}
