"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  X, Type, Square, Circle, Triangle, Image as ImageIcon,
  Spline, Layers, Box, AlignJustify,
} from "lucide-react";
import type { FabricObject } from "fabric";
import type { ActiveTool } from "../StudioEditor";
import type { useDesignCanvas } from "@/app/components/design/hooks/useDesignCanvas";
import { ShapesPanel } from "@/app/components/design/panels/ShapesPanel";
import { TextPanel } from "@/app/components/design/panels/TextPanel";
import { ImagePanel } from "@/app/components/design/panels/ImagePanel";

interface Props {
  activeTool: ActiveTool;
  canvas: ReturnType<typeof useDesignCanvas>;
  onClose: () => void;
}

const PANEL_LABELS: Partial<Record<ActiveTool, string>> = {
  select: "Ebenen",
  move:   "Ebenen",
  text:   "Text",
  shapes: "Formen",
  images: "Bilder",
  assets: "Ebenen",
};

export function EditorLeftPanel({ activeTool, canvas, onClose }: Props) {
  const [shapeCat, setShapeCat] = useState("Alle");
  const [shapePage, setShapePage] = useState(0);

  const showLayers =
    activeTool === "select" || activeTool === "move" || activeTool === "assets";

  return (
    <aside
      className="flex flex-col w-[220px] shrink-0"
      style={{ background: "#111318", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-9 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase">
          {PANEL_LABELS[activeTool] ?? "Panel"}
        </span>
        <button
          onClick={onClose}
          className="text-white/25 hover:text-white/60 transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {showLayers && <LayersContent canvas={canvas} />}

        {activeTool === "shapes" && (
          <div className="p-3">
            <ShapesPanel
              shapeCat={shapeCat}
              shapePage={shapePage}
              onCategoryChange={(cat) => { setShapeCat(cat); setShapePage(0); }}
              onPageChange={setShapePage}
              addShapeFromCatalog={canvas.addShapeFromCatalog}
            />
          </div>
        )}

        {activeTool === "text" && (
          <div className="p-3">
            <TextPanel onAddText={canvas.addText} />
          </div>
        )}

        {activeTool === "images" && (
          <div className="p-3">
            <ImagePanel
              imageUploading={canvas.imageUploading}
              onClickUpload={() => canvas.fileInputRef.current?.click()}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

/* ── Real layer list ─────────────────────────────────────────────────── */

interface LayerEntry {
  obj: FabricObject;
  label: string;
  icon: React.ReactNode;
}

function LayersContent({ canvas }: { canvas: ReturnType<typeof useDesignCanvas> }) {
  const [layers, setLayers]       = useState<LayerEntry[]>([]);
  const [activeObj, setActiveObj] = useState<FabricObject | null>(null);
  // Stores the cleanup fn that restores evented state after a layer-panel pin
  const unpinRef = useRef<(() => void) | null>(null);

  const sync = useCallback(() => {
    const fab = canvas.fabricRef?.current;
    if (!fab) return;
    const objs = fab.getObjects();
    // Reverse: topmost object first (Figma convention)
    setLayers(
      [...objs].reverse().map((obj) => ({
        obj,
        label: getLabel(obj),
        icon: getIcon(obj),
      })),
    );
    setActiveObj(fab.getActiveObject() ?? null);
  }, [canvas.fabricRef]);

  // Attach canvas event listeners once canvas is ready
  useEffect(() => {
    const fab = canvas.fabricRef?.current;
    if (!fab || !canvas.canvasReady) return;

    fab.on("object:added",      sync);
    fab.on("object:removed",    sync);
    fab.on("object:modified",   sync);
    fab.on("selection:created", sync);
    fab.on("selection:updated", sync);
    fab.on("selection:cleared", sync);

    sync(); // initial population

    return () => {
      fab.off("object:added",      sync);
      fab.off("object:removed",    sync);
      fab.off("object:modified",   sync);
      fab.off("selection:created", sync);
      fab.off("selection:updated", sync);
      fab.off("selection:cleared", sync);
    };
  }, [canvas.canvasReady, sync]);

  // Restore evented state on unmount
  useEffect(() => () => { unpinRef.current?.(); }, []);

  function selectLayer(obj: FabricObject) {
    const fab = canvas.fabricRef?.current;
    if (!fab) return;

    // Remove previous pin before setting a new one
    unpinRef.current?.();
    unpinRef.current = null;

    // Disable hit-testing on every other object so Fabric can't "steal" the
    // selection when the user clicks an overlapping area.
    const others      = fab.getObjects().filter((o) => o !== obj);
    const savedEvents = others.map((o) => o.evented);

    others.forEach((o) => o.set("evented", false));
    fab.setActiveObject(obj);
    fab.requestRenderAll();
    setActiveObj(obj);

    // Restore when the user clicks outside the pinned object (selection:cleared)
    const restore = () => {
      others.forEach((o, i) => o.set("evented", savedEvents[i]));
      unpinRef.current = null;
    };

    const onCleared = () => {
      restore();
      fab.off("selection:cleared", onCleared);
    };

    fab.on("selection:cleared", onCleared);

    // Also expose cleanup so a subsequent selectLayer call can restore first
    unpinRef.current = () => {
      restore();
      fab.off("selection:cleared", onCleared);
    };
  }

  if (!canvas.canvasReady) {
    return (
      <p className="px-3 py-4 text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
        Canvas wird geladen…
      </p>
    );
  }

  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-3 py-8">
        <AlignJustify size={22} style={{ color: "rgba(255,255,255,0.12)" }} />
        <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          Noch keine Objekte.<br />Füge Text oder Formen hinzu.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-1">
      {layers.map((layer, i) => {
        const isActive = layer.obj === activeObj;
        return (
          <button
            key={i}
            onClick={() => selectLayer(layer.obj)}
            className="w-full flex items-center gap-2 h-8 px-3 text-left cursor-pointer transition-colors truncate"
            style={{
              background: isActive ? "rgba(184,92,42,0.15)" : "transparent",
              color:      isActive ? "var(--color-rust)"    : "rgba(255,255,255,0.55)",
              borderLeft: isActive ? "2px solid var(--color-rust)" : "2px solid transparent",
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            <span className="shrink-0 opacity-60">{layer.icon}</span>
            <span className="text-[12px] truncate">{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function getLabel(obj: FabricObject): string {
  const type = obj.type ?? "";
  if (type === "i-text" || type === "text") {
    const raw = (obj as FabricObject & { text?: string }).text ?? "";
    const trimmed = raw.trim().slice(0, 24);
    return trimmed || "Text";
  }
  const map: Record<string, string> = {
    rect:     "Rechteck",
    circle:   "Kreis",
    ellipse:  "Ellipse",
    triangle: "Dreieck",
    path:     "Pfad",
    polygon:  "Vieleck",
    image:    "Bild",
    group:    "Gruppe",
    line:     "Linie",
  };
  return map[type] ?? "Objekt";
}

function getIcon(obj: FabricObject): React.ReactNode {
  const type = obj.type ?? "";
  const s = 12;
  if (type === "i-text" || type === "text") return <Type     size={s} />;
  if (type === "rect")                       return <Square   size={s} />;
  if (type === "circle")                     return <Circle   size={s} />;
  if (type === "ellipse")                    return <Circle   size={s} />;
  if (type === "triangle")                   return <Triangle size={s} />;
  if (type === "image")                      return <ImageIcon size={s} />;
  if (type === "group")                      return <Layers   size={s} />;
  if (type === "path" || type === "polygon") return <Spline   size={s} />;
  return <Box size={s} />;
}
