"use client";

import { Download, Trash2 } from "lucide-react";
import { cn } from "@/app/utils/utils";

type Props = {
  isTextSelected:   boolean;
  strokeWidth:      number;
  textAlign:        "left" | "center" | "right";
  isBold:           boolean;
  isItalic:         boolean;
  applyStrokeWidth: (n: number) => void;
  applyTextAlign:   (a: "left" | "center" | "right") => void;
  applyBold:        (b: boolean) => void;
  applyItalic:      (b: boolean) => void;
  bringForward:     () => void;
  sendBackward:     () => void;
  deleteSelected:   () => void;
  downloadPNG:      () => void;
};

export function PropertiesPanel({
  isTextSelected,
  strokeWidth,
  textAlign, isBold, isItalic,
  applyStrokeWidth,
  applyTextAlign, applyBold, applyItalic,
  bringForward, sendBackward,
  deleteSelected, downloadPNG,
}: Props) {
  const activeBtn   = "border-rust bg-rustLight dark:bg-rustLight/20 text-rust";
  const inactiveBtn = "border-stone-200/80 dark:border-zinc-700 text-muted hover:border-rust/40";

  return (
    <div className="w-full rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 shadow-sm px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

        {/* Label */}
        <span className="text-[10px] font-medium text-muted uppercase tracking-[0.1em] shrink-0">
          Objekt
        </span>

        {/* Stroke width */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-muted whitespace-nowrap">
            Kontur — <span className="text-primary dark:text-cream">{strokeWidth}px</span>
          </span>
          <input
            type="range" min={0} max={20} step={1}
            value={strokeWidth}
            onChange={(e) => applyStrokeWidth(Number(e.target.value))}
            className="w-24 accent-rust cursor-pointer"
          />
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-stone-200/80 dark:bg-zinc-700 shrink-0" />

        {/* Text controls — only when text is selected */}
        {isTextSelected && (
          <>
            <div className="flex gap-1">
              <button onClick={() => applyBold(!isBold)}       className={cn("w-7 h-7 rounded border text-[11px] font-bold  transition-all duration-150 cursor-pointer", isBold    ? activeBtn : inactiveBtn)}>B</button>
              <button onClick={() => applyItalic(!isItalic)}   className={cn("w-7 h-7 rounded border text-[11px] italic   transition-all duration-150 cursor-pointer", isItalic  ? activeBtn : inactiveBtn)}>I</button>
              <button onClick={() => applyTextAlign("left")}   className={cn("w-7 h-7 rounded border text-[11px]          transition-all duration-150 cursor-pointer", textAlign === "left"   ? activeBtn : inactiveBtn)}>L</button>
              <button onClick={() => applyTextAlign("center")} className={cn("w-7 h-7 rounded border text-[11px]          transition-all duration-150 cursor-pointer", textAlign === "center" ? activeBtn : inactiveBtn)}>M</button>
              <button onClick={() => applyTextAlign("right")}  className={cn("w-7 h-7 rounded border text-[11px]          transition-all duration-150 cursor-pointer", textAlign === "right"  ? activeBtn : inactiveBtn)}>R</button>
            </div>
            <div className="h-4 w-px bg-stone-200/80 dark:bg-zinc-700 shrink-0" />
          </>
        )}

        {/* Layer order */}
        <div className="flex gap-1 shrink-0">
          <button onClick={bringForward} className="px-2.5 h-7 rounded border border-stone-200/80 dark:border-zinc-700 text-muted hover:text-primary hover:border-rust/40 hover:bg-rustLight dark:hover:bg-zinc-800 text-[10px] font-medium transition-all duration-150 cursor-pointer">↑ Vorne</button>
          <button onClick={sendBackward} className="px-2.5 h-7 rounded border border-stone-200/80 dark:border-zinc-700 text-muted hover:text-primary hover:border-rust/40 hover:bg-rustLight dark:hover:bg-zinc-800 text-[10px] font-medium transition-all duration-150 cursor-pointer">↓ Hinten</button>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-stone-200/80 dark:bg-zinc-700 shrink-0" />

        {/* Delete / Download */}
        <div className="flex gap-1 shrink-0 ml-auto">
          <button
            onClick={downloadPNG}
            className="flex items-center gap-1.5 px-2.5 h-7 rounded border border-stone-200/80 dark:border-zinc-700 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-[10px] font-medium transition-colors duration-200 cursor-pointer"
          >
            <Download size={11} /> Download
          </button>
          <button
            onClick={deleteSelected}
            className="flex items-center gap-1.5 px-2.5 h-7 rounded border border-red-200/60 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-[10px] font-medium transition-colors duration-200 cursor-pointer"
          >
            <Trash2 size={11} /> Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
