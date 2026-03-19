"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Download, Loader2, ZoomIn } from "lucide-react";
import { cn } from "@/app/utils/utils";

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const CANVAS_SIZE = 500;

const EXPORT_OPTIONS = [
  { label: "2× — 1000 px",   sublabel: "Web-Vorschau",    multiplier: 2 },
  { label: "4× — 2000 px",   sublabel: "Kleindruck",      multiplier: 4 },
  { label: "6× — 3000 px",   sublabel: "Großdruck",       multiplier: 6 },
  { label: "8× — 4000 px",   sublabel: "Postergröße",     multiplier: 8 },
] as const;

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type ViewerState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready" };

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function DesignViewer() {
  const searchParams  = useSearchParams();
  const canvasElRef   = useRef<HTMLCanvasElement>(null);
  const fabricRef     = useRef<any>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);

  const [viewerState, setViewerState] = useState<ViewerState>({ status: "idle" });
  const [multiplier,  setMultiplier]  = useState<number>(4);
  const [exporting,   setExporting]   = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);

  const jsonUrl = searchParams.get("json");

  /* ---- Scale canvas to container ---------------------------------- */
  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setCanvasScale(Math.min(1, entry.contentRect.width / CANVAS_SIZE));
    });
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  /* ---- Load design ------------------------------------------------ */
  useEffect(() => {
    if (!canvasElRef.current) return;

    if (!jsonUrl) {
      setViewerState({ status: "error", message: 'URL-Parameter "json" fehlt. Erwartet: /view?json=https%3A%2F%2F…' });
      return;
    }

    let canvas: any;
    (async () => {
      setViewerState({ status: "loading" });
      try {
        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error(`Fetch fehlgeschlagen (HTTP ${res.status}).`);
        const fabricJson = await res.json();

        const { StaticCanvas } = await import("fabric");
        canvas = new StaticCanvas(canvasElRef.current!, { width: CANVAS_SIZE, height: CANVAS_SIZE });
        fabricRef.current = canvas;

        await canvas.loadFromJSON(fabricJson);
        canvas.requestRenderAll();
        setViewerState({ status: "ready" });
      } catch (err) {
        setViewerState({ status: "error", message: err instanceof Error ? err.message : "Unbekannter Fehler." });
      }
    })();

    return () => { canvas?.dispose(); fabricRef.current = null; };
  }, [jsonUrl]);

  /* ---- Export PNG ------------------------------------------------- */
  const exportPNG = useCallback(async () => {
    if (!fabricRef.current || viewerState.status !== "ready") return;
    setExporting(true);
    try {
      await new Promise<void>((r) => setTimeout(r, 50));
      const dataURL = fabricRef.current.toDataURL({ format: "png", multiplier });
      const a       = document.createElement("a");
      a.href        = dataURL;
      a.download    = `design-druckdatei-${multiplier}x.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  }, [multiplier, viewerState.status]);

  /* ------------------------------------------------------------------ */
  /*  Render                                                              */
  /* ------------------------------------------------------------------ */

  const isReady  = viewerState.status === "ready";
  const outputPx = CANVAS_SIZE * multiplier;

  return (
    <div className="w-full bg-cream dark:bg-zinc-950 min-h-screen">

      {/* ── Header ── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 pt-16 pb-8 md:pt-24 md:pb-10">
        <span className="block text-xs font-medium tracking-[0.15em] uppercase text-rust mb-2">
          Admin-Ansicht · Read-Only
        </span>
        <h1 className="font-display text-3xl md:text-[clamp(2rem,4vw,3rem)] tracking-tight text-charcoal dark:text-cream leading-[1.1]">
          Design-Vorschau
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone dark:text-muted max-w-[50ch]">
          Exakte Darstellung des Kunden-Designs. Nicht interaktiv.
        </p>
      </div>

      {/* ── Body ── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 pb-24">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-10 items-start">

          {/* Canvas column */}
          <div className="w-full xl:flex-1 flex flex-col gap-4">
            <div ref={wrapperRef} className="w-full">
              <div
                style={{ width: CANVAS_SIZE * canvasScale, height: CANVAS_SIZE * canvasScale, overflow: "hidden" }}
                className="mx-auto"
              >
                {/* Error */}
                {viewerState.status === "error" && (
                  <div
                    style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, transform: `scale(${canvasScale})`, transformOrigin: "top left" }}
                    className="flex items-center justify-center bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900/40"
                  >
                    <div className="flex flex-col items-center gap-3 text-red-500 px-8 text-center">
                      <AlertCircle size={28} />
                      <p className="text-sm font-medium">Laden fehlgeschlagen</p>
                      <p className="text-xs opacity-70 font-mono break-all">{viewerState.message}</p>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {viewerState.status === "loading" && (
                  <div
                    style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, transform: `scale(${canvasScale})`, transformOrigin: "top left" }}
                    className="flex flex-col items-center justify-center gap-3 bg-stone-100 dark:bg-zinc-800 rounded text-muted"
                  >
                    <Loader2 size={28} className="animate-spin" />
                    <span className="text-sm">Design wird geladen…</span>
                  </div>
                )}

                {/* Canvas */}
                <div
                  style={{ transform: `scale(${canvasScale})`, transformOrigin: "top left", width: CANVAS_SIZE, height: CANVAS_SIZE, display: isReady ? "block" : "none" }}
                  className="rounded shadow-md overflow-hidden"
                >
                  <canvas ref={canvasElRef} />
                </div>
              </div>
            </div>

            {isReady && (
              <p className="text-center text-xs text-stone dark:text-muted flex items-center justify-center gap-1.5">
                <ZoomIn size={12} />
                Vorschau · {CANVAS_SIZE}×{CANVAS_SIZE} px · Nicht interaktiv
              </p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full xl:w-72 flex flex-col gap-5">

            {/* Export options */}
            <div className="rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 shadow-sm p-4">
              <p className="text-[10px] font-medium text-muted uppercase tracking-[0.1em] mb-3">Auflösung</p>
              <div className="flex flex-col gap-2">
                {EXPORT_OPTIONS.map((opt) => (
                  <label
                    key={opt.multiplier}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded border cursor-pointer",
                      "transition-colors duration-200",
                      multiplier === opt.multiplier
                        ? "border-rust/40 bg-rustLight dark:bg-zinc-800"
                        : "border-stone-200/60 dark:border-zinc-700/60 hover:border-rust/30 hover:bg-rustLight/50 dark:hover:bg-zinc-800/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="multiplier"
                      value={opt.multiplier}
                      checked={multiplier === opt.multiplier}
                      onChange={() => setMultiplier(opt.multiplier)}
                      className="accent-rust"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium leading-tight", multiplier === opt.multiplier ? "text-rust" : "text-primary dark:text-cream")}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{opt.sublabel}</p>
                    </div>
                  </label>
                ))}
              </div>

              {isReady && (
                <p className="text-xs text-muted mt-3 text-right">
                  Ausgabe: {outputPx}×{outputPx} px PNG
                </p>
              )}
            </div>

            {/* Export button */}
            <button
              onClick={exportPNG}
              disabled={!isReady || exporting}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded",
                "text-sm font-medium tracking-[0.04em] uppercase",
                "bg-rust text-white transition-colors duration-200",
                "hover:bg-rustMid",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              {exporting
                ? <><Loader2 size={15} className="animate-spin" /> Wird exportiert…</>
                : <><Download size={15} /> Druckdatei exportieren</>
              }
            </button>

            {/* URL info */}
            {!isReady && viewerState.status !== "error" && (
              <div className="rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 p-4 text-xs text-muted leading-relaxed">
                <p className="font-medium text-primary dark:text-cream mb-2">URL-Format</p>
                <p className="font-mono text-[11px] break-all text-rust">
                  /pages/design/view?json=https%3A%2F%2F…
                </p>
                <p className="mt-2">
                  Die URL kommt aus dem Feld <code className="font-mono">_design_json</code> der Shopify-Bestellung.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
