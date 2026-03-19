"use client";

import { Type } from "lucide-react";
import { cn } from "@/app/utils/utils";
import { FONT_OPTIONS } from "../constants";

type Props = {
  isTextSelected: boolean;
  fontFamily:     string;
  fontSize:       number;
  onAddText:       () => void;
  applyFontFamily: (f: string) => void;
  applyFontSize:   (n: number) => void;
};

export function TextPanel({ isTextSelected, fontFamily, fontSize, onAddText, applyFontFamily, applyFontSize }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onAddText}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded",
          "border border-stone-200/80 dark:border-zinc-700",
          "text-sm font-medium text-stone dark:text-muted",
          "hover:border-rust/40 hover:bg-rustLight dark:hover:bg-zinc-800 hover:text-rust",
          "transition-all duration-200 cursor-pointer active:scale-[0.98]",
        )}
      >
        <Type size={15} /> Text hinzufügen
      </button>

      {isTextSelected ? (
        <>
          <div>
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.08em] mb-2">Schriftart</p>
            <div className="grid grid-cols-2 gap-1.5">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => applyFontFamily(f.value)}
                  style={{ fontFamily: f.value }}
                  className={cn(
                    "py-1.5 px-2 rounded border text-[11px] truncate transition-all duration-150 cursor-pointer text-left",
                    fontFamily === f.value
                      ? "border-rust bg-rustLight dark:bg-rustLight/20 text-rust"
                      : "border-stone-200/80 dark:border-zinc-700 text-muted hover:border-rust/40 hover:text-rust",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.08em] mb-2">
              Größe — <span className="text-primary dark:text-cream">{fontSize}px</span>
            </p>
            <input
              type="range" min={10} max={120} step={2}
              value={fontSize}
              onChange={(e) => applyFontSize(Number(e.target.value))}
              className="w-full accent-rust cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>10</span><span>120</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-[11px] text-muted text-center py-1">
          Text auswählen um Eigenschaften zu bearbeiten
        </p>
      )}
    </div>
  );
}
