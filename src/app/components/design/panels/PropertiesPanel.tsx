"use client";

import {
  AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline,
  Copy, MousePointer, Trash2,
  ChevronUp, ChevronDown,
  Minus, Type,
} from "lucide-react";
import { cn } from "@/app/utils/utils";
import { FONT_OPTIONS } from "../constants";

type Props = {
  hasActiveObject:  boolean;
  isTextSelected:   boolean;
  strokeWidth:      number;
  fillColor:        string;
  textAlign:        "left" | "center" | "right";
  isBold:           boolean;
  isItalic:         boolean;
  isUnderline:      boolean;
  fontFamily:       string;
  fontSize:         number;
  applyStrokeWidth: (n: number) => void;
  applyFillColor:   (c: string) => void;
  applyTextAlign:   (a: "left" | "center" | "right") => void;
  applyBold:        (b: boolean) => void;
  applyItalic:      (b: boolean) => void;
  applyUnderline:   (b: boolean) => void;
  applyFontFamily:  (f: string) => void;
  applyFontSize:    (n: number) => void;
  bringForward:     () => void;
  sendBackward:     () => void;
  duplicate:        () => void;
  deleteSelected:   () => void;
  onAddText:        () => void;
};

const SEP = <div className="h-5 w-px bg-stone-200/80 dark:bg-zinc-700 shrink-0 mx-0.5" />;

export function PropertiesPanel({
  hasActiveObject, isTextSelected,
  strokeWidth, fillColor,
  textAlign, isBold, isItalic, isUnderline,
  fontFamily, fontSize,
  applyStrokeWidth, applyFillColor,
  applyTextAlign, applyBold, applyItalic, applyUnderline,
  applyFontFamily, applyFontSize,
  bringForward, sendBackward, duplicate, deleteSelected,
  onAddText,
}: Props) {

  const on  = "border-rust bg-rustLight dark:bg-rustLight/20 text-rust";
  const off = "border-stone-200/80 dark:border-zinc-700 text-muted hover:border-rust/40 hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800";
  const btn = "w-8 h-8 rounded border flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0";

  const noFill = fillColor === "transparent" || fillColor === "";

  return (
    <div className="w-full rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 shadow-sm px-3 py-1.5 flex flex-col gap-1.5">

      {/* ── Hauptzeile ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-0.5">

        {/* Immer sichtbar: Text hinzufügen */}
        <button
          onClick={onAddText}
          title="Text hinzufügen"
          className={cn(btn, off, "gap-1 px-2.5 w-auto text-[11px] font-medium")}
        >
          <Type size={12} /> Text
        </button>

        {/* ── Schrift (nur bei Textauswahl) ───────────────────────── */}
        {isTextSelected && (
          <>
            {SEP}
            <select
              value={fontFamily}
              onChange={(e) => applyFontFamily(e.target.value)}
              style={{ fontFamily }}
              className="h-8 rounded border border-stone-200 dark:border-zinc-700 bg-background dark:bg-zinc-950 text-primary dark:text-cream text-[12px] px-2 focus:outline-none focus:ring-1 focus:ring-rust/40 cursor-pointer max-w-[120px]"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                  {f.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => applyFontSize(Math.max(10, fontSize - 2))}
                title="Kleiner"
                className={cn(btn, off, "text-base font-bold")}
              >−</button>
              <span className="w-9 text-center text-[12px] font-medium text-primary dark:text-cream tabular-nums select-none">
                {fontSize}
              </span>
              <button
                onClick={() => applyFontSize(Math.min(120, fontSize + 2))}
                title="Größer"
                className={cn(btn, off, "text-base font-bold")}
              >+</button>
            </div>

            {SEP}

            <div className="flex items-center gap-0.5">
              <button onClick={() => applyBold(!isBold)}            title="Fett"          className={cn(btn, isBold      ? on : off)}><Bold      size={13} /></button>
              <button onClick={() => applyItalic(!isItalic)}        title="Kursiv"        className={cn(btn, isItalic    ? on : off)}><Italic    size={13} /></button>
              <button onClick={() => applyUnderline(!isUnderline)}  title="Unterstrichen" className={cn(btn, isUnderline ? on : off)}><Underline size={13} /></button>
            </div>

            {SEP}

            <div className="flex items-center gap-0.5">
              <button onClick={() => applyTextAlign("left")}   title="Links"  className={cn(btn, textAlign === "left"   ? on : off)}><AlignLeft   size={13} /></button>
              <button onClick={() => applyTextAlign("center")} title="Mitte"  className={cn(btn, textAlign === "center" ? on : off)}><AlignCenter size={13} /></button>
              <button onClick={() => applyTextAlign("right")}  title="Rechts" className={cn(btn, textAlign === "right"  ? on : off)}><AlignRight  size={13} /></button>
            </div>

            {SEP}
          </>
        )}

        {/* ── Objekt-Eigenschaften (bei jeder Auswahl) ───────────── */}
        {hasActiveObject && (
          <>
            <button
              onClick={() => applyFillColor(noFill ? "#ffffff" : "transparent")}
              title={noFill ? "Füllung aktivieren" : "Keine Füllung"}
              className={cn(btn, noFill ? on : off)}
            >
              <Minus size={13} />
            </button>

            {SEP}

            <div className="flex items-center gap-1.5 shrink-0 px-1">
              <span className="text-[10px] text-muted whitespace-nowrap hidden sm:inline">
                Kontur <span className="text-primary dark:text-cream font-medium">{strokeWidth}px</span>
              </span>
              <input
                type="range" min={0} max={20} step={1}
                value={strokeWidth}
                onChange={(e) => applyStrokeWidth(Number(e.target.value))}
                className="w-16 accent-rust cursor-pointer"
              />
            </div>

            {SEP}

            <div className="flex items-center gap-0.5">
              <button onClick={bringForward}  title="Nach vorne"  className={cn(btn, off)}><ChevronUp   size={14} /></button>
              <button onClick={sendBackward}  title="Nach hinten" className={cn(btn, off)}><ChevronDown size={14} /></button>
            </div>

            {SEP}

            <div className="flex items-center gap-0.5">
              <button onClick={duplicate}      title="Duplizieren" className={cn(btn, off)}><Copy size={13} /></button>
              <button
                onClick={deleteSelected}
                title="Löschen"
                className="w-8 h-8 rounded border border-red-200/60 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </>
        )}

        {/* Hint wenn nichts ausgewählt */}
        {!hasActiveObject && (
          <>
            {SEP}
            <div className="flex items-center gap-1.5 text-[11px] text-muted/60 italic py-0.5 pl-1">
              <MousePointer size={11} className="shrink-0" />
              Klicke auf ein Objekt um es zu bearbeiten
            </div>
          </>
        )}
      </div>

    </div>
  );
}
