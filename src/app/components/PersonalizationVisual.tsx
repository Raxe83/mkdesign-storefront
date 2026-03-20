"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Type } from "lucide-react";

// ─── Typen ────────────────────────────────────────────────────────────────────

type Phase = "blank" | "typing" | "hold" | "erasing";

const PHRASES = [
  "Familie Schmidt",
  "Sommer 2024",
  "Max ♥ Lisa",
  "Geburtstag 2025",
];

// ─── Cursor SVG ───────────────────────────────────────────────────────────────

function CursorSVG() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true">
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
  src: string;
  alt: string;
}

export function PersonalizationVisual({ src, alt }: PersonalizationVisualProps) {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<Phase>("blank");
  const phraseIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Typewriter state machine ──────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const phrase = PHRASES[phraseIdx.current];

    if (phase === "blank") {
      timerRef.current = setTimeout(() => setPhase("typing"), 700);
    } else if (phase === "typing") {
      if (displayText.length < phrase.length) {
        timerRef.current = setTimeout(
          () => setDisplayText(phrase.slice(0, displayText.length + 1)),
          78
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
          42
        );
      } else {
        phraseIdx.current = (phraseIdx.current + 1) % PHRASES.length;
        timerRef.current = setTimeout(() => setPhase("blank"), 350);
      }
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, displayText]);

  const panelVisible = phase !== "blank";

  return (
    <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden select-none">
      {/* ── Produktbild ── */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 70vw, 50vw"
        className="object-cover scale-150 object-center"
      />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent pointer-events-none" />

      {/* ── Gravur-Zone (gestrichelter Rahmen) ── */}
      <div
        className="absolute rounded-sm border-2 border-dashed border-rust/70 pointer-events-none"
        style={{
          left: "22%", top: "33%",
          width: "56%", height: "22%",
          animation: "pv-zone-pulse 2.8s ease-in-out infinite",
        }}
      />

      {/* ── Design-Panel (Eingabe-Vorschau) ── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "12%", top: "58%" }}
      >
        <div
          className="bg-cream/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-border rounded-sm px-3 py-2 shadow-md min-w-[140px]"
          style={{
            animation: panelVisible ? "pv-panel-in 0.25s ease-out forwards" : undefined,
            opacity: panelVisible ? 1 : 0,
            transition: panelVisible ? undefined : "opacity 0.2s ease",
          }}
        >
          <p className="text-[9px] font-medium text-gray-400 uppercase tracking-[0.14em] mb-1.5">
            Wunschtext
          </p>
          <div className="flex items-center gap-0.5 font-display text-sm text-white dark:text-primary min-h-[1.4rem]">
            <span>{displayText}</span>
            <span
              className="inline-block w-[2px] h-[14px] bg-rust align-middle"
              style={{ animation: "pv-caret 0.9s step-end infinite" }}
            />
          </div>
        </div>
      </div>

      {/* ── Font-Tool-Pill (oben links) ── */}
      <div
        className="absolute top-[10%] left-[14%] flex items-center gap-1.5 bg-cream/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-border rounded-sm px-2.5 py-1.5 pointer-events-none shadow-sm"
        style={{ animation: "pv-tool-drift 4s ease-in-out infinite" }}
      >
        <Type size={11} className="text-rust shrink-0" />
        <span className="font-body text-[10px] font-medium text-white dark:text-primary">
          Playfair Display
        </span>
      </div>

      {/* ── Dreieck + Selection-Indicator ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "28%",
          bottom: "52%",
          animation: "pv-triangle-scale 10s ease-in-out infinite",
          animationDelay: "0.5s",
          transformOrigin: "center",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
        }}
      >
        {/* Selection-Rahmen mit Eck-Handles — wird nach Klick eingeblendet */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-8px",
            border: "1.5px dashed rgba(255,255,255,0.85)",
            animation: "pv-selection-show 10s ease-in-out infinite",
            animationDelay: "0.5s",
            opacity: 0,
          }}
        >
          {/* Eck-Handles */}
          {[
            { top: -3, left: -3 }, { top: -3, right: -3 },
            { bottom: -3, left: -3 }, { bottom: -3, right: -3 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-[1px]"
              style={pos}
            />
          ))}
        </div>

        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden="true">
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
        className="absolute pointer-events-none"
        style={{
          right: "16%",
          bottom: "26%",
          animation: "pv-cursor 10s ease-in-out infinite",
          animationDelay: "0.5s",
          opacity: 0,
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
        }}
      >
        <CursorSVG />
      </div>
    </div>
  );
}
