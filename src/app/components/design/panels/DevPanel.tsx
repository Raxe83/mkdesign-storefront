"use client";

import { cn } from "@/app/utils/utils";

export interface FitState {
  widthFrac: number;
  svgAspect: number;
  topFrac:   number;
  canvasH:   number;
}

type Props = {
  canvasWidth:         number;
  fit:                 FitState;
  onCanvasWidthChange: (v: number) => void;
  onFitChange:         (patch: Partial<FitState>) => void;
};

const inputCls = cn(
  "w-full rounded border border-stone-200 dark:border-zinc-700",
  "bg-background dark:bg-zinc-950 text-primary dark:text-cream",
  "px-2 py-1 text-xs tabular-nums transition-colors duration-200",
  "focus:outline-none focus:ring-2 focus:ring-amber-400/40",
);

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[10px] text-muted">{label}</span>
      {children}
    </div>
  );
}

export function DevPanel({
  canvasWidth, fit,
  onCanvasWidthChange, onFitChange,
}: Props) {
  return (
    <div className="rounded border border-amber-400/40 bg-amber-50/60 dark:bg-amber-950/20 shadow-sm">
      <div className="px-3 py-2 border-b border-amber-400/30 flex items-center gap-1.5">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          ⚙ Dev — Canvas &amp; Fit
        </span>
      </div>
      <div className="p-3 flex flex-col gap-2.5">
        {/* Canvas size */}
        <Row label="Canvas B (px)">
          <input
            type="number" min={100} max={3000} step={10}
            value={canvasWidth}
            onChange={(e) => onCanvasWidthChange(Math.max(100, Math.min(3000, +e.target.value || canvasWidth)))}
            className={inputCls}
          />
        </Row>
        <Row label="Canvas H (px)">
          <input
            type="number" min={100} max={3000} step={10}
            value={fit.canvasH}
            onChange={(e) => onFitChange({ canvasH: Math.max(100, Math.min(3000, +e.target.value || fit.canvasH)) })}
            className={inputCls}
          />
        </Row>

        <hr className="border-amber-400/20" />

        {/* Barrel fit */}
        <Row label="widthFrac">
          <input
            type="number" min={0.1} max={1} step={0.01}
            value={fit.widthFrac}
            onChange={(e) => onFitChange({ widthFrac: Math.max(0.1, Math.min(1, +e.target.value)) })}
            className={inputCls}
          />
        </Row>
        <Row label="svgAspect">
          <input
            type="number" min={0.1} max={4} step={0.01}
            value={fit.svgAspect}
            onChange={(e) => onFitChange({ svgAspect: Math.max(0.1, Math.min(4, +e.target.value)) })}
            className={inputCls}
          />
        </Row>
        <Row label="topFrac">
          <input
            type="number" min={0} max={0.9} step={0.01}
            value={fit.topFrac}
            onChange={(e) => onFitChange({ topFrac: Math.max(0, Math.min(0.9, +e.target.value)) })}
            className={inputCls}
          />
        </Row>

        <p className="text-[9px] text-amber-600/70 dark:text-amber-400/60 pt-0.5">
          Nur im Dev-Modus sichtbar — Werte in BARREL_ENTRIES übertragen.
        </p>
      </div>
    </div>
  );
}
