/**
 * FireBarrels — Illustrationen für verschiedene Produkt-Varianten
 *
 * Koordinaten (viewBox 300×400):
 *   Top rim:    y = 60
 *   Ring 1:     y ≈ 150–160   (1/3)
 *   Ring 2:     y ≈ 242–252   (2/3)
 *   Bottom cap: y = 335
 *   Legs:       y = 335–366
 *
 * Varianten:
 *   BarrelFull       — vollständige Tonne mit Füßen
 *   BarrelNoLegs     — Tonne ohne Füße
 *   BarrelSchaleXL   — ab Ring 1 aufgeschnitten (oberes Drittel weg)
 *   BarrelSchale     — ab Ring 2 aufgeschnitten (nur unteres Drittel)
 *   BarrelStehtisch  — Tonne mit Holz-Tischplatte oben
 */

const SVG_BASE = {
  width: "100%",
  height: "100%",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  className: "absolute inset-0",
} as const;

// ─── Defs ─────────────────────────────────────────────────────────────────────

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}Bg`} cx="50%" cy="35%" r="75%">
        <stop offset="0%"   stopColor="#292524" />
        <stop offset="100%" stopColor="#0c0a09" />
      </radialGradient>
      <linearGradient id={`${id}Barrel`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#161412" />
        <stop offset="28%"  stopColor="#3c3836" />
        <stop offset="60%"  stopColor="#252220" />
        <stop offset="82%"  stopColor="#38342f" />
        <stop offset="100%" stopColor="#161412" />
      </linearGradient>
      <linearGradient id={`${id}Ring`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#292522" />
        <stop offset="40%"  stopColor="#6b6460" />
        <stop offset="100%" stopColor="#292522" />
      </linearGradient>

      {/* Wood grain gradients for tabletop */}
      <linearGradient id={`${id}WoodEdge`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#8c6030" />
        <stop offset="50%"  stopColor="#6b4820" />
        <stop offset="100%" stopColor="#3d2812" />
      </linearGradient>
      <radialGradient id={`${id}WoodTop`} cx="38%" cy="38%" r="65%">
        <stop offset="0%"   stopColor="#d4944a" />
        <stop offset="45%"  stopColor="#a86c30" />
        <stop offset="100%" stopColor="#5c3a18" />
      </radialGradient>

      <radialGradient id={`${id}Flame`} cx="50%" cy="100%" r="90%">
        <stop offset="0%"   stopColor="#f97316" stopOpacity="0.55" />
        <stop offset="50%"  stopColor="#ea580c" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#f97316" stopOpacity="0"    />
      </radialGradient>
      <radialGradient id={`${id}TopGlow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#fb923c" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#fb923c" stopOpacity="0"    />
      </radialGradient>
      <filter id={`${id}Shadow`} x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.6" />
      </filter>
    </defs>
  );
}

// ─── Teilkomponenten ───────────────────────────────────────────────────────────

function BarrelBody({ id, clipId }: { id: string; clipId?: string }) {
  return (
    <g clipPath={clipId ? `url(#${clipId})` : undefined}>
      {/* Nearly cylindrical sides — only ~4 px outward at belly */}
      <path
        d="M 68,60 C 64,162 64,238 68,335 L 232,335 C 236,238 236,162 232,60 Z"
        fill={`url(#${id}Barrel)`}
        filter={`url(#${id}Shadow)`}
      />
      {/* Specular highlight — thin strip on left third */}
      <path
        d="M 115,68 C 113,160 112,238 113,328 Q 117,333 121,328 C 119,238 118,160 119,68 Z"
        fill="white" opacity="0.025"
      />
    </g>
  );
}

function Ring1({ id }: { id: string }) {
  return (
    <path d="M 67,150 C 59,153 59,157 67,160 L 233,160 C 241,157 241,153 233,150 Z"
      fill={`url(#${id}Ring)`} stroke="#57534e" strokeWidth="0.3" />
  );
}

function Ring2({ id }: { id: string }) {
  return (
    <path d="M 65,242 C 57,245 57,249 65,252 L 235,252 C 243,249 243,245 235,242 Z"
      fill={`url(#${id}Ring)`} stroke="#57534e" strokeWidth="0.3" />
  );
}

function TopRim({ id }: { id: string }) {
  return (
    <>
      <ellipse cx="150" cy="60" rx="82" ry="6"  fill="#222020" stroke="#57534e" strokeWidth="1.8" />
      <ellipse cx="150" cy="60" rx="70" ry="4"  fill="#0f0d0c" />
      <ellipse cx="150" cy="60" rx="70" ry="4"  fill={`url(#${id}Flame)`} />
      <ellipse cx="150" cy="46" rx="58" ry="22" fill={`url(#${id}TopGlow)`} />
      <ellipse cx="150" cy="34" rx="38" ry="14" fill="#f97316" opacity="0.05" />
    </>
  );
}

function BottomCap() {
  return <ellipse cx="150" cy="335" rx="82" ry="6" fill="#1a1815" stroke="#3c3836" strokeWidth="1.5" />;
}

function Legs() {
  return (
    <>
      <path d="M 108,335 L 104,362 Q 103,366 108,366 L 114,366 Q 119,365 118,361 L 113,335 Z" fill="#3a3532" />
      <path d="M 192,335 L 188,361 Q 187,365 193,366 L 199,366 Q 204,365 203,361 L 200,335 Z" fill="#3a3532" />
      <path d="M 147,335 L 145,361 Q 144,365 149,366 L 155,366 Q 160,365 158,361 L 156,335 Z" fill="#302d2a" />
    </>
  );
}

function FloorShadow({ cy = 372 }: { cy?: number }) {
  return <ellipse cx="150" cy={cy} rx="72" ry="6" fill="#000" opacity="0.4" />;
}

/**
 * Rand an der Schnittlinie — soll den Body-Clip natürlich abschließen.
 * Der clipRect muss bei cy+ry beginnen (unterhalb der Ellipse-Mitte),
 * damit der Rim die Schnittkante vollständig überlagert.
 */
function CutRim({ id, cy, rx = 86, ry = 6 }: { id: string; cy: number; rx?: number; ry?: number }) {
  return (
    <>
      {/* Äußerer Rand */}
      <ellipse cx="150" cy={cy} rx={rx}     ry={ry}     fill="#1e1c1a" stroke="#57534e" strokeWidth="1.5" />
      {/* Innerer Rand (dunkles Metall) */}
      <ellipse cx="150" cy={cy} rx={rx - 8} ry={Math.max(1, ry - 2)} fill="#0f0d0c" />
      {/* Flammen-Schein von innen */}
      <ellipse cx="150" cy={cy} rx={rx - 8} ry={Math.max(1, ry - 2)} fill={`url(#${id}Flame)`} />
      {/* Wärme-Glow über dem Rand */}
      <ellipse cx="150" cy={cy - 10} rx={rx - 14} ry={ry + 10} fill={`url(#${id}TopGlow)`} opacity="0.7" />
    </>
  );
}

// ─── Holz-Tischplatte ─────────────────────────────────────────────────────────

function WoodTabletop({ id }: { id: string }) {
  // Platte: cy=12 (Oberfläche), cy=20 (Kante unten) → Unterseite bei y≈29
  // Halter: von y=30 bis y=46 (Barrel-Rim-Top), x=108 und x=186
  // Abstand zur Tonne: ~16px
  return (
    <>
      {/* ── Halter (kein Sockel) ───────────────────────────── */}
      {/* Tabletop-Unterseite y=66, Halter bis y=76 (tief im Barrel-Rim) */}

      {/* Halter links */}
      <rect x="107" y="50" width="9" height="14" rx="1.5"
        fill="#3a3532" stroke="#57534e" strokeWidth="0.6" />
      <rect x="109" y="51" width="3" height="12" rx="1"
        fill="#5a5450" opacity="0.35" />

      {/* Halter rechts */}
      <rect x="184" y="50" width="9" height="14" rx="1.5"
        fill="#3a3532" stroke="#57534e" strokeWidth="0.6" />
      <rect x="186" y="51" width="3" height="12" rx="1"
        fill="#5a5450" opacity="0.35" />

      {/* ── Tischplatte (Unterseite bei y=50) ─────────────── */}
      {/* Kante */}
      <ellipse cx="150" cy="42" rx="185" ry="10" fill={`url(#${id}WoodEdge)`} stroke="#3d2812" strokeWidth="1" />
      {/* Oberfläche */}
      <ellipse cx="150" cy="32" rx="185" ry="10" fill={`url(#${id}WoodTop)`} stroke="#7a5228" strokeWidth="1" />

      {/* Holzmaserung */}
      <g stroke="#c07a38" strokeWidth="1" fill="none" opacity="0.22">
        <path d="M -22,29 Q 150,23 322,29" />
        <path d="M -24,32 Q 150,26 324,32" />
        <path d="M -20,35 Q 150,29 320,35" />
        <path d="M -14,39 Q 150,33 314,39" />
      </g>
      <g stroke="#5c3318" strokeWidth="0.7" fill="none" opacity="0.14">
        <path d="M -10,27 Q 150,22 310,27" />
        <path d="M -12,31 Q 150,25 312,31" />
        <path d="M -8,36 Q 150,30 308,36" />
      </g>

      {/* Glanzstreifen */}
      <ellipse cx="110" cy="28" rx="55" ry="5" fill="white" opacity="0.1" />
    </>
  );
}

// ─── Varianten ────────────────────────────────────────────────────────────────

// ─── Seitengriffe ─────────────────────────────────────────────────────────────

/**
 * Schlichte flache Metallösen direkt unterhalb des Schnittrand-cy.
 * `rimCy` = cy des CutRim (z. B. 247 oder 155).
 */
function SideHandles({ rimCy }: { rimCy: number }) {
  const y = rimCy + 5;   // knapp unter dem Rand
  const h = 10;
  const w = 26;
  return (
    <>
      {/* Linker Tab */}
      <rect x={44} y={y} width={w} height={h} rx="2.5"
        fill="#3c3835" stroke="#5a5450" strokeWidth="0.8" />
      {/* Glanzstreifen oben */}
      <rect x={45} y={y + 1} width={w - 2} height="2.5" rx="1"
        fill="#7a7470" opacity="0.28" />

      {/* Rechter Tab */}
      <rect x={230} y={y} width={w} height={h} rx="2.5"
        fill="#3c3835" stroke="#5a5450" strokeWidth="0.8" />
      <rect x={231} y={y + 1} width={w - 2} height="2.5" rx="1"
        fill="#7a7470" opacity="0.28" />
    </>
  );
}

// ─── Varianten ────────────────────────────────────────────────────────────────

interface BarrelProps {
  /** Render the dark background rect. Default: true. Set false in the design editor. */
  showBackground?: boolean;
  /** Render the floor shadow ellipse. Default: true. */
  showFloorShadow?: boolean;
}

export function BarrelFull({ showBackground = true, showFloorShadow = true }: BarrelProps) {
  const id = "pvFull";
  return (
    <svg viewBox="0 0 300 400" {...SVG_BASE}>
      <Defs id={id} />
      {showBackground   && <rect width="300" height="400" fill={`url(#${id}Bg)`} />}
      {showFloorShadow  && <FloorShadow />}
      <Legs />
      <BottomCap />
      <BarrelBody id={id} />
      <Ring1 id={id} />
      <Ring2 id={id} />
      <TopRim id={id} />
    </svg>
  );
}

export function BarrelNoLegs({ showBackground = true, showFloorShadow = true }: BarrelProps) {
  const id = "pvNoLegs";
  return (
    <svg viewBox="0 0 300 355" {...SVG_BASE}>
      <Defs id={id} />
      {showBackground   && <rect width="300" height="355" fill={`url(#${id}Bg)`} />}
      {showFloorShadow  && <FloorShadow cy={348} />}
      <BottomCap />
      <BarrelBody id={id} />
      <Ring1 id={id} />
      <Ring2 id={id} />
      <TopRim id={id} />
    </svg>
  );
}

export function BarrelSchaleXL({ showBackground = true, showFloorShadow = true }: BarrelProps) {
  const id = "pvSchaleXL";
  return (
    <svg viewBox="0 138 300 262" {...SVG_BASE}>
      <Defs id={id} />
      <defs>
        <clipPath id={`${id}Clip`}>
          <rect x="0" y="155" width="300" height="220" />
        </clipPath>
      </defs>
      {showBackground   && <rect x="0" y="138" width="300" height="262" fill={`url(#${id}Bg)`} />}
      {showFloorShadow  && <FloorShadow cy={372} />}
      <Legs />
      <BottomCap />
      <BarrelBody id={id} clipId={`${id}Clip`} />
      <Ring2 id={id} />
      <SideHandles rimCy={155} />
      <CutRim id={id} cy={155} rx={86} ry={6} />
    </svg>
  );
}

export function BarrelSchale({ showBackground = true, showFloorShadow = true }: BarrelProps) {
  const id = "pvSchale";
  return (
    <svg viewBox="0 230 300 170" {...SVG_BASE}>
      <Defs id={id} />
      <defs>
        <clipPath id={`${id}Clip`}>
          <rect x="0" y="247" width="300" height="130" />
        </clipPath>
      </defs>
      {showBackground   && <rect x="0" y="230" width="300" height="170" fill={`url(#${id}Bg)`} />}
      {showFloorShadow  && <FloorShadow cy={372} />}
      <Legs />
      <BottomCap />
      <BarrelBody id={id} clipId={`${id}Clip`} />
      <SideHandles rimCy={247} />
      <CutRim id={id} cy={247} rx={86} ry={6} />
    </svg>
  );
}

export function BarrelStehtisch({ showBackground = true, showFloorShadow = true }: BarrelProps) {
  const id = "pvStehtisch";
  return (
    <svg viewBox="0 -10 300 410" {...SVG_BASE}>
      <Defs id={id} />
      {showBackground   && <rect x="0" y="-10" width="300" height="410" fill={`url(#${id}Bg)`} />}
      {showFloorShadow  && <FloorShadow />}
      <Legs />
      <BottomCap />
      <BarrelBody id={id} />
      <Ring1 id={id} />
      <Ring2 id={id} />
      {/* Barrel-Rim als Auflage sichtbar lassen */}
      <ellipse cx="150" cy="60" rx="82" ry="6" fill="#222020" stroke="#57534e" strokeWidth="1.8" />
      <WoodTabletop id={id} />
    </svg>
  );
}
