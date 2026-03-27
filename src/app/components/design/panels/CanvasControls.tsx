"use client";

import { Download, Hand } from "lucide-react";
import { cn } from "@/app/utils/utils";

interface Props {
  cssZoom: number;
  panMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onTogglePan: () => void;
  onDownload: () => void;
}

export function CanvasControls({
  cssZoom,
  panMode,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onTogglePan,
  onDownload,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <button
        onClick={onTogglePan}
        title={panMode ? "Verschieben deaktivieren" : "Verschieben aktivieren"}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[11px] font-medium transition-colors duration-200 cursor-pointer",
          panMode
            ? "border-rust bg-rustLight/40 text-rust dark:bg-rustLight/10"
            : "border-stone-200/80 dark:border-zinc-700 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800",
        )}
      >
        <Hand size={13} />
        Verschieben
      </button>

      <div className="flex items-center rounded border border-stone-200/80 dark:border-zinc-700 overflow-hidden">
        <button
          onClick={onZoomOut}
          title="Rauszoomen"
          className="px-2.5 py-1.5 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-sm leading-none transition-colors duration-200 cursor-pointer"
        >
          −
        </button>
        <button
          onClick={onZoomReset}
          title="Zoom zurücksetzen"
          className="px-2 py-1.5 text-[11px] font-medium text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 border-x border-stone-200/80 dark:border-zinc-700 tabular-nums w-11 text-center transition-colors duration-200 cursor-pointer"
        >
          {Math.round(cssZoom * 100)}%
        </button>
        <button
          onClick={onZoomIn}
          title="Reinzoomen"
          className="px-2.5 py-1.5 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-sm leading-none transition-colors duration-200 cursor-pointer"
        >
          +
        </button>
      </div>

      <button
        onClick={onDownload}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-200/80 dark:border-zinc-700 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-[11px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer shrink-0"
      >
        <Download size={12} /> PNG herunterladen
      </button>
    </div>
  );
}
