"use client";

import { useState, useEffect, useRef } from "react";
import { Type } from "lucide-react";

type Phase = "blank" | "typing" | "hold" | "erasing";

const PHRASES = [
  "Familie Schmidt",
  "Sommer 2024",
  "Max ♥ Lisa",
  "Geburtstag 2025",
];

function CursorSVG() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 2L18 13L11 14.5L15.5 23L12 24.5L7.5 16L4 20V2Z"
        fill="white"
        stroke="#18181b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Feuertonne SVG-Illustration ─────────────────────────────────────────────

function FireBarrel() {
  return (
    <svg
      viewBox="0 0 300 400"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="absolute inset-0"
    >
      <defs>
        <radialGradient id="pvBg" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="100%" stopColor="#0c0a09" />
        </radialGradient>
        <linearGradient id="pvBarrel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#161412" />
          <stop offset="28%" stopColor="#3c3836" />
          <stop offset="60%" stopColor="#252220" />
          <stop offset="82%" stopColor="#38342f" />
          <stop offset="100%" stopColor="#161412" />
        </linearGradient>
        <linearGradient id="pvRing" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#292522" />
          <stop offset="40%" stopColor="#6b6460" />
          <stop offset="100%" stopColor="#292522" />
        </linearGradient>
        <radialGradient id="pvFlame" cx="50%" cy="100%" r="90%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#ea580c" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pvTopGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <filter id="pvShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="10"
            floodColor="#000"
            floodOpacity="0.6"
          />
        </filter>
      </defs>

      {/* Background */}
      <rect width="300" height="400" fill="url(#pvBg)" />

      {/* Floor shadow */}
      <ellipse cx="150" cy="358" rx="75" ry="6" fill="#000" opacity="0.4" />

      {/* ─── Legs ─────────────────────────────────────────────── */}
      {/* Left leg */}
      <path
        d="M 108,316 L 103,346 Q 102,350 107,350 L 113,350 Q 118,349 117,345 L 112,316 Z"
        fill="#3a3532"
      />
      {/* Right leg */}
      <path
        d="M 192,316 L 188,345 Q 187,349 193,350 L 199,350 Q 204,349 203,345 L 200,316 Z"
        fill="#3a3532"
      />
      {/* Center leg (slightly recessed) */}
      <path
        d="M 147,316 L 145,345 Q 144,349 149,350 L 155,350 Q 160,349 158,345 L 156,316 Z"
        fill="#302d2a"
      />

      {/* ─── Barrel bottom cap ───────────────────────────────── */}
      <ellipse
        cx="150"
        cy="316"
        rx="82"
        ry="15"
        fill="#1a1815"
        stroke="#3c3836"
        strokeWidth="1.5"
      />

      {/* ─── Barrel body ─────────────────────────────────────── */}
      <path
        d="M 70,88 C 55,180 53,248 68,316 L 232,316 C 247,248 245,180 230,88 Z"
        fill="url(#pvBarrel)"
        filter="url(#pvShadow)"
      />

      {/* Subtle vertical light streak (reflection) */}
      <path
        d="M 118,95 C 115,180 114,248 116,310 Q 120,315 124,310 C 122,248 121,180 122,95 Z"
        fill="white"
        opacity="0.025"
      />

      {/* ─── Punch-hole decorations (lower section) ──────────── */}
      {/*
      <g fill="#0c0a09" stroke="#2c2926" strokeWidth="0.6">
        <circle cx="98"  cy="270" r="4.5" /><circle cx="115" cy="270" r="4.5" />
        <circle cx="132" cy="270" r="4.5" /><circle cx="150" cy="270" r="4.5" />
        <circle cx="168" cy="270" r="4.5" /><circle cx="185" cy="270" r="4.5" />
        <circle cx="202" cy="270" r="4.5" />
        <circle cx="106" cy="287" r="4.5" /><circle cx="123" cy="287" r="4.5" />
        <circle cx="141" cy="287" r="4.5" /><circle cx="159" cy="287" r="4.5" />
        <circle cx="177" cy="287" r="4.5" /><circle cx="194" cy="287" r="4.5" />
        <circle cx="98"  cy="304" r="4.5" /><circle cx="115" cy="304" r="4.5" />
        <circle cx="132" cy="304" r="4.5" /><circle cx="150" cy="304" r="4.5" />
        <circle cx="168" cy="304" r="4.5" /><circle cx="185" cy="304" r="4.5" />
        <circle cx="202" cy="304" r="4.5" />
      </g>
      <g fill="#f97316" opacity="0.12">
        <circle cx="98"  cy="270" r="3.5" /><circle cx="115" cy="270" r="3.5" />
        <circle cx="132" cy="270" r="3.5" /><circle cx="150" cy="270" r="3.5" />
        <circle cx="168" cy="270" r="3.5" /><circle cx="185" cy="270" r="3.5" />
        <circle cx="202" cy="270" r="3.5" />
        <circle cx="106" cy="287" r="3.5" /><circle cx="123" cy="287" r="3.5" />
        <circle cx="141" cy="287" r="3.5" /><circle cx="159" cy="287" r="3.5" />
        <circle cx="177" cy="287" r="3.5" /><circle cx="194" cy="287" r="3.5" />
      </g>
      */}

      {/* ─── Horizontal metal rings ───────────────────────────── */}
      {/* Ring 1 */}
      <path
        d="M 68,156 C 56,159 56,163 68,166 L 232,166 C 244,163 244,159 232,156 Z"
        fill="url(#pvRing)"
        stroke="#57534e"
        strokeWidth="0.3"
      />
      {/* Ring 2 */}
      <path
        d="M 63,268 C 51,271 51,275 63,278 L 237,278 C 249,275 249,271 237,268 Z"
        fill="url(#pvRing)"
        stroke="#57534e"
        strokeWidth="0.3"
      />

      {/* ─── Top rim ─────────────────────────────────────────── */}
      <ellipse
        cx="150"
        cy="88"
        rx="82"
        ry="16"
        fill="#222020"
        stroke="#57534e"
        strokeWidth="1.8"
      />
      {/* Inner top dark */}
      <ellipse cx="150" cy="88" rx="70" ry="13" fill="#0f0d0c" />
      {/* Flame glow inside */}
      <ellipse cx="150" cy="88" rx="70" ry="13" fill="url(#pvFlame)" />

      {/* Ambient glow above barrel */}
      <ellipse cx="150" cy="68" rx="60" ry="36" fill="url(#pvTopGlow)" />
      <ellipse cx="150" cy="50" rx="40" ry="24" fill="#f97316" opacity="0.05" />
    </svg>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

interface PersonalizationVisualProps {
  src?: string;
  alt?: string;
}

export function PersonalizationVisual(_props: PersonalizationVisualProps) {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<Phase>("blank");
  const phraseIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const phrase = PHRASES[phraseIdx.current];

    if (phase === "blank") {
      timerRef.current = setTimeout(() => setPhase("typing"), 700);
    } else if (phase === "typing") {
      if (displayText.length < phrase.length) {
        timerRef.current = setTimeout(
          () => setDisplayText(phrase.slice(0, displayText.length + 1)),
          78,
        );
      } else {
        timerRef.current = setTimeout(() => setPhase("hold"), 1800);
      }
    } else if (phase === "hold") {
      timerRef.current = setTimeout(() => setPhase("erasing"), 0);
    } else if (phase === "erasing") {
      if (displayText.length > 0) {
        timerRef.current = setTimeout(
          () => setDisplayText((t) => t.slice(0, -1)),
          42,
        );
      } else {
        phraseIdx.current = (phraseIdx.current + 1) % PHRASES.length;
        timerRef.current = setTimeout(() => setPhase("blank"), 350);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, displayText]);

  const panelVisible = phase !== "blank";

  return (
    <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden select-none bg-[#0c0a09]">
      {/* ── Feuertonne Illustration ── */}
      <FireBarrel />

      {/* ── Gravur-Zone (gestrichelter Rahmen auf dem Barrel) ── */}
      <div
        className="absolute rounded-sm border-2 border-dashed border-rust/80 pointer-events-none"
        style={{
          left: "24%",
          top: "43%",
          width: "52%",
          height: "21%",
          animation: "pv-zone-pulse 2.8s ease-in-out infinite",
        }}
      />

      {/* ── Design-Panel ── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "8%", top: "60%" }}
      >
        <div
          className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/60 rounded-sm px-3 py-2 shadow-md min-w-[140px]"
          style={{
            animation: panelVisible
              ? "pv-panel-in 0.25s ease-out forwards"
              : undefined,
            opacity: panelVisible ? 1 : 0,
            transition: panelVisible ? undefined : "opacity 0.2s ease",
          }}
        >
          <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-[0.14em] mb-1.5">
            Wunschtext
          </p>
          <div className="flex items-center gap-0.5 font-display text-sm text-white min-h-[1.4rem]">
            <span>{displayText}</span>
            <span
              className="inline-block w-[2px] h-[14px] bg-rust align-middle"
              style={{ animation: "pv-caret 0.9s step-end infinite" }}
            />
          </div>
        </div>
      </div>

      {/* ── Font-Tool-Pill ── */}
      <div
        className="absolute top-[9%] left-[12%] flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700/60 rounded-sm px-2.5 py-1.5 pointer-events-none shadow-sm"
        style={{ animation: "pv-tool-drift 4s ease-in-out infinite" }}
      >
        <Type size={11} className="text-rust shrink-0" />
        <span className="font-body text-[10px] font-medium text-zinc-200">
          Playfair Display
        </span>
      </div>

      {/* ── Dreieck + Selection-Indicator ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "32%",
          bottom: "44%",
          animation: "pv-triangle-scale 10s ease-in-out infinite",
          animationDelay: "0.5s",
          transformOrigin: "center",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-8px",
            border: "1.5px dashed rgba(255,255,255,0.8)",
            animation: "pv-selection-show 10s ease-in-out infinite",
            animationDelay: "0.5s",
            opacity: 0,
          }}
        >
          {[
            { top: -3, left: -3 },
            { top: -3, right: -3 },
            { bottom: -3, left: -3 },
            { bottom: -3, right: -3 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-[1px]"
              style={pos}
            />
          ))}
        </div>

        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 1.5L18.5 16.5H1.5L10 1.5Z"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Cursor ── */}
      <div
        className="absolute pointer-events-none right-[18%] bottom-[10%] sm:bottom-[22%] sm:right-[22%] md:bottom-[27%] md:right-[24%] lg:bottom-[18%] lg:right-[20%]"
        style={{
          animation: "pv-cursor 10s ease-in-out infinite",
          animationDelay: "0.5s",
          opacity: 0,
          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))",
        }}
      >
        <CursorSVG />
      </div>
    </div>
  );
}
