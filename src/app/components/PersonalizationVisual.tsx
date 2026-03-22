"use client";

import { useState, useEffect, useRef } from "react";
import { Type } from "lucide-react";
import {
  BarrelFull,
  BarrelNoLegs,
  BarrelSchale,
  BarrelSchaleXL,
  BarrelStehtisch,
} from "./illustrations/FireBarrels";

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
      <BarrelFull />

      {/* ── Gravur-Zone (gestrichelter Rahmen auf dem Barrel) ── */}
      <div
        className="absolute rounded-sm border-2 border-dashed border-rust/80 pointer-events-none"
        style={{
          left: "24%",
          top: "42%",
          width: "52%",
          height: "17%",
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
