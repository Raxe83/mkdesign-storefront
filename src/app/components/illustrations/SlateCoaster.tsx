import React, { JSX, ReactNode } from "react";

// ─── Farb-System & Kompatibilitäts-Mapping ──────────────────────────────────

export type SlateColor = "anthrazit" | "grau" | "rust";

/** * Macht die Komponente kompatibel mit dem "BarrelColor"-Farbschema deines Editors,
 * damit TypeScript keine Typ-Fehler wirft.
 */
export type CompatibleColor = "schwarz" | "silber" | "grau" | "gold" | SlateColor;

const SLATE_PALETTE: Record<SlateColor, { base: string; light: string; dark: string }> = {
  anthrazit: {
    base: "#1e1e1e",
    light: "#3a3a3a",
    dark: "#0f0f0f",
  },
  grau: {
    base: "#3a3d40",
    light: "#5a5e63",
    dark: "#222426",
  },
  rust: {
    base: "#3d2d1e",
    light: "#6e5237",
    dark: "#1f150d",
  },
};

/**
 * Wandelt Editor-Farben (z. B. BarrelColor) intelligent in passende Schiefer-Töne um.
 */
function mapToSlateColor(color?: CompatibleColor): SlateColor {
  if (!color) return "anthrazit";
  if (color === "schwarz" || color === "silber" || color === "anthrazit") {
    return "anthrazit";
  }
  if (color === "gold" || color === "rust") {
    return "rust";
  }
  return "grau"; // fängt "grau" ab
}

// ─── Props ──────────────────────────────────────────────────────────────────

export interface SlateCoasterProps {
  /** Das Design-Element (Gravur), welches auf den Untersetzer projiziert wird */
  design?: ReactNode;
  /** Schaltet den dunklen Studio-Hintergrund an/aus. Standard: true. */
  showBackground?: boolean;
  /** Schaltet den weichen Kontaktschatten am Boden an/aus. Standard: true. */
  showFloorShadow?: boolean;
  /** Farbe des Schiefers (Akzeptiert auch BarrelColor-Typen für den Editor) */
  color?: CompatibleColor;
  /** Optionale CSS-Klassen für den SVG-Container */
  className?: string;
}

// ─── Gemeinsame Defs (Hintergründe, Texturen & Schatten) ────────────────────

function SlateDefs({ id, color = "anthrazit" }: { id: string; color?: CompatibleColor }) {
  const resolvedColor = mapToSlateColor(color);
  const p = SLATE_PALETTE[resolvedColor];

  return (
    <defs>
      {/* Dunkler radialer Studio-Hintergrund */}
      <radialGradient id={`${id}Bg`} cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#292524" />
        <stop offset="100%" stopColor="#0c0a09" />
      </radialGradient>

      {/* Farbverlauf für die Steinoberfläche */}
      <linearGradient id={`${id}SurfaceGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={p.light} />
        <stop offset="30%" stopColor={p.base} />
        <stop offset="70%" stopColor={p.base} />
        <stop offset="100%" stopColor={p.dark} />
      </linearGradient>

      {/* SVG-Rauschfilter zur Simulation der matten Gesteins-Poren (Grain) */}
      <filter id={`${id}SlateTexture`} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" result="colorNoise" />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>

      {/* Weicher Schatten unter der Steinplatte */}
      <filter id={`${id}Shadow`} x="-20%" y="-20%" width="145%" height="145%">
        <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#000" floodOpacity="0.8" />
      </filter>

      {/* Masken (Clips), damit Gravuren exakt auf der Oberfläche bleiben */}
      <clipPath id={`${id}SquareClip`}>
        <rect x="52" y="102" width="196" height="196" rx="6" />
      </clipPath>
      <clipPath id={`${id}RoundClip`}>
        <circle cx="150" cy="200" r="102" />
      </clipPath>
    </defs>
  );
}

// ─── 1. VARIANTE: ECKIGER SCHIEFERUNTERSETZER ─────────────────────────────────

export function SlateCoasterSquare({
  design = null,
  showBackground = true,
  showFloorShadow = true,
  color = "anthrazit",
  className = "",
}: SlateCoasterProps): JSX.Element {
  const id = "slateSq";

  return (
    <svg
      viewBox="0 0 300 400"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Schieferuntersetzer eckig"
      className={`absolute inset-0 ${className}`}
    >
      <SlateDefs id={id} color={color} />

      {showBackground && <rect width="300" height="400" fill={`url(#${id}Bg)`} />}

      {showFloorShadow && (
        <rect x="42" y="295" width="216" height="20" rx="10" fill="#000" opacity="0.6" filter="blur(8px)" />
      )}

      {/* Plastische Unterkante für 3D-Dicke (ca. 5mm) */}
      <rect x="47" y="103" width="206" height="200" rx="8" fill="#141414" />

      {/* Die Schieferplatte mit unregelmäßigen Kantenverläufen (Spaltkanten-Look) */}
      <path
        d="M 48,103 
           Q 100,101 150,102 Q 200,101 252,103
           Q 254,150 253,200 Q 254,250 252,297
           Q 200,299 150,298 Q 100,299 48,297
           Q 46,250 47,200 Q 46,150 48,103 Z"
        fill={`url(#${id}SurfaceGrad)`}
        filter={`url(#${id}Shadow)`}
      />

      {/* Überlagerte Gesteins-Textur (Grain) */}
      <path
        d="M 48,103 
           Q 100,101 150,102 Q 200,101 252,103
           Q 254,150 253,200 Q 254,250 252,297
           Q 200,299 150,298 Q 100,299 48,297
           Q 46,250 47,200 Q 46,150 48,103 Z"
        fill={`url(#${id}SurfaceGrad)`}
        filter={`url(#${id}SlateTexture)`}
        style={{ mixBlendMode: "overlay" }}
      />

      {/* Subtile Lichtkanten für die Bruchkante oben & links */}
      <path
        d="M 48,103 Q 100,101 150,102 Q 200,101 252,103"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        opacity="0.15"
      />
      <path
        d="M 48,103 Q 46,150 47,200 Q 46,250 48,297"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.0"
        opacity="0.1"
      />

      {/* Kunden-Design (Laser-Gravur) */}
      {design && <g clipPath={`url(#${id}SquareClip)`}>{design}</g>}
    </svg>
  );
}

// ─── 2. VARIANTE: RUNDER SCHIEFERUNTERSETZER ──────────────────────────────────

export function SlateCoasterRound({
  design = null,
  showBackground = true,
  showFloorShadow = true,
  color = "anthrazit",
  className = "",
}: SlateCoasterProps): JSX.Element {
  const id = "slateRd";

  return (
    <svg
      viewBox="0 0 300 400"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Schieferuntersetzer rund"
      className={`absolute inset-0 ${className}`}
    >
      <SlateDefs id={id} color={color} />

      {showBackground && <rect width="300" height="400" fill={`url(#${id}Bg)`} />}

      {showFloorShadow && (
        <ellipse cx="150" cy="305" rx="110" ry="14" fill="#000" opacity="0.65" filter="blur(8px)" />
      )}

      {/* Plastische Unterkante für 3D-Dicke (ca. 5mm) */}
      <ellipse cx="150" cy="203" rx="104" ry="104" fill="#141414" />

      {/* Welliger Pfad für die natürlich abgeschlagene Rundkante */}
      <path
        d="M 150,96 
           C 178,95 205,103 226,121 C 243,136 254,159 254,186
           C 255,214 246,244 227,265 C 206,289 174,304 150,304
           C 123,304 93,291 74,269 C 55,247 46,219 46,190
           C 46,162 57,137 76,119 C 96,101 124,96 150,96 Z"
        fill={`url(#${id}SurfaceGrad)`}
        filter={`url(#${id}Shadow)`}
      />

      {/* Gesteins-Textur Layer */}
      <path
        d="M 150,96 
           C 178,95 205,103 226,121 C 243,136 254,159 254,186
           C 255,214 246,244 227,265 C 206,289 174,304 150,304
           C 123,304 93,291 74,269 C 55,247 46,219 46,190
           C 46,162 57,137 76,119 C 96,101 124,96 150,96 Z"
        fill={`url(#${id}SurfaceGrad)`}
        filter={`url(#${id}SlateTexture)`}
        style={{ mixBlendMode: "overlay" }}
      />

      {/* Unregelmäßige helle Glanzlichter entlang des Bruchs */}
      <path
        d="M 76,119 C 96,101 124,96 150,96 C 178,95 205,103 226,121"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        opacity="0.2"
      />

      {/* Kunden-Design (Laser-Gravur) */}
      {design && <g clipPath={`url(#${id}RoundClip)`}>{design}</g>}
    </svg>
  );
}

// ─── 3. GRAVUR-TEMPLATE (Optionales Hilfsmittel für Textgravur) ──────────────────

export function SlateLaserDesign({
  text,
  subtext,
}: {
  text: string;
  subtext?: string;
}): JSX.Element {
  return (
    <g opacity="0.45">
      <text
        x="150"
        y={subtext ? "198" : "210"}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="bold"
        letterSpacing="4"
        fill="#e5e5e0"
      >
        {text}
      </text>
      {subtext && (
        <text
          x="150"
          y="224"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="9"
          letterSpacing="2"
          fill="#d4d4cd"
        >
          {subtext}
        </text>
      )}
    </g>
  );
}