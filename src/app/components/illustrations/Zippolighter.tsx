import React, { JSX, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────

type ZippoDefsProps = {
  id: string;
};

type ZippoLighterProps = {
  design?: ReactNode;
  lidDesign?: ReactNode;
  showBackground?: boolean;
  showFloorShadow?: boolean;
  className?: string;
};

type ZippoTextDesignProps = {
  text?: string;
  subtext?: string;
};

// ─── Defs ────────────────────────────────────────────────────────────────

function ZippoDefs({ id }: ZippoDefsProps) {
  return (
    <defs>
      <radialGradient id={`${id}Bg`} cx="50%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#292524" />
        <stop offset="100%" stopColor="#0c0a09" />
      </radialGradient>

      <linearGradient id={`${id}Steel`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="8%" stopColor="#3a3a38" />
        <stop offset="18%" stopColor="#606060" />
        <stop offset="32%" stopColor="#888884" />
        <stop offset="45%" stopColor="#6e6e6a" />
        <stop offset="58%" stopColor="#8a8a86" />
        <stop offset="70%" stopColor="#5a5a58" />
        <stop offset="82%" stopColor="#3e3e3c" />
        <stop offset="92%" stopColor="#2a2a28" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>

      <linearGradient id={`${id}Rim`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1c1c1a" />
        <stop offset="20%" stopColor="#8c8c88" />
        <stop offset="42%" stopColor="#d0cdc8" />
        <stop offset="58%" stopColor="#b8b5b0" />
        <stop offset="80%" stopColor="#6a6a66" />
        <stop offset="100%" stopColor="#1c1c1a" />
      </linearGradient>

      <linearGradient id={`${id}Hinge`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#111" />
        <stop offset="40%" stopColor="#888" />
        <stop offset="100%" stopColor="#111" />
      </linearGradient>

      <pattern id={`${id}Grain`} x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
        <rect width="1" height="4" fill="none" />
        <rect y="0" width="1" height="1" fill="white" opacity="0.018" />
        <rect y="2" width="1" height="1" fill="black" opacity="0.022" />
      </pattern>

      <filter id={`${id}Shadow`} x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.7" />
      </filter>

      <clipPath id={`${id}BodyClip`}>
        <rect x="68" y="218" width="164" height="152" rx="5" />
      </clipPath>
      <clipPath id={`${id}LidClip`}>
        <rect x="68" y="132" width="164" height="86" rx="5" />
      </clipPath>
    </defs>
  );
}

// ─── Hauptkomponente ─────────────────────────────────────────────────────

export function ZippoLighter({
  design = null,
  lidDesign = null,
  showBackground = true,
  showFloorShadow = true,
  className = "",
}: ZippoLighterProps) {
  const id = "zippo";

  return (
    <svg
      viewBox="0 0 300 400"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Zippo-Feuerzeug"
      className={`absolute inset-0 ${className}`}
    >
      <ZippoDefs id={id} />

      {showBackground && (
        <rect width="300" height="400" fill={`url(#${id}Bg)`} />
      )}

      {showFloorShadow && (
        <ellipse cx="150" cy="385" rx="68" ry="6" fill="#000" opacity="0.5" />
      )}

      {/* BODY */}
      <rect x="64" y="214" width="172" height="160" rx="10"
        fill={`url(#${id}Rim)`} filter={`url(#${id}Shadow)`} />

      <rect x="68" y="218" width="164" height="152" rx="5"
        fill={`url(#${id}Steel)`} />

      <rect x="68" y="218" width="164" height="152" rx="5"
        fill={`url(#${id}Grain)`} />

      <rect x="100" y="218" width="60" height="152"
        fill="white" opacity="0.018" />

      {design && (
        <g clipPath={`url(#${id}BodyClip)`}>
          {design}
        </g>
      )}

      <rect x="64" y="362" width="172" height="12" rx="6"
        fill="#1a1816" stroke="#3c3836" strokeWidth="1" />

      <rect x="64" y="218" width="5" height="152" rx="2" fill="white" opacity="0.06" />
      <rect x="231" y="218" width="5" height="152" rx="2" fill="white" opacity="0.04" />

      <rect x="68" y="213" width="164" height="5" fill="#0d0c0b" />
      <rect x="68" y="215" width="164" height="3" fill="black" opacity="0.4" />

      {/* LID */}
      <rect x="64" y="128" width="172" height="90" rx="10"
        fill={`url(#${id}Rim)`} filter={`url(#${id}Shadow)`} />

      <rect x="68" y="132" width="164" height="86" rx="5"
        fill={`url(#${id}Steel)`} />

      <rect x="68" y="132" width="164" height="86" rx="5"
        fill={`url(#${id}Grain)`} />

      <rect x="100" y="132" width="60" height="86"
        fill="white" opacity="0.018" />

      {lidDesign && (
        <g clipPath={`url(#${id}LidClip)`}>
          {lidDesign}
        </g>
      )}

      <rect x="64" y="128" width="172" height="12" rx="6"
        fill="#262422" stroke="#484440" strokeWidth="1" />

      <rect x="64" y="132" width="5" height="86" rx="2" fill="white" opacity="0.06" />
      <rect x="231" y="132" width="5" height="86" rx="2" fill="white" opacity="0.04" />

      {/* HINGE */}
      <rect x="56" y="185" width="14" height="11" rx="3"
        fill={`url(#${id}Hinge)`} stroke="#444" strokeWidth="0.4" />
      <rect x="56" y="200" width="14" height="16" rx="3"
        fill={`url(#${id}Hinge)`} stroke="#444" strokeWidth="0.4" />
      <rect x="56" y="220" width="14" height="11" rx="3"
        fill={`url(#${id}Hinge)`} stroke="#444" strokeWidth="0.4" />

      <line x1="63" y1="183" x2="63" y2="233" stroke="#666" strokeWidth="1" />
    </svg>
  );
}

// ─── Designs ─────────────────────────────────────────────────────────────

export function ZippoTextDesign({
  text = "ZIPPO",
  subtext = "",
}: ZippoTextDesignProps) {
  return (
    <>
      <text
        x="150"
        y={subtext ? "286" : "297"}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="22"
        letterSpacing="5"
        fill="white"
        opacity="0.22"
      >
        {text}
      </text>

      {subtext && (
        <text
          x="150"
          y="308"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="11"
          letterSpacing="3"
          fill="white"
          opacity="0.14"
        >
          {subtext}
        </text>
      )}
    </>
  );
}

export function ZippoFlameDesign(): JSX.Element {
  return (
    <g opacity="0.2">
      <path
        d="M150,240 C142,255 130,268 134,284 C136,293 142,298 140,310
           C138,320 130,326 132,338 C134,350 144,356 150,360
           C156,356 166,350 168,338 C170,326 162,320 160,310
           C158,298 164,293 166,284 C170,268 158,255 150,240Z"
        fill="white"
      />
      <path
        d="M150,252 C145,264 138,274 141,285 C143,292 148,296 147,306
           C146,314 140,319 142,328 C144,338 148,342 150,344
           C152,342 156,338 158,328 C160,319 154,314 153,306
           C152,296 157,292 159,285 C162,274 155,264 150,252Z"
        fill="#f97316"
        opacity="0.6"
      />
    </g>
  );
}