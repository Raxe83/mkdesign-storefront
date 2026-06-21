"use client";

import { useEffect, useRef, useState } from "react";
import { CANVAS_BG, FONT_OPTIONS, type CanvasPreset } from "../constants";
import type { Canvas, FabricObject, IText } from "fabric";

function loadCanvasFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("canvas-extra-fonts")) return;
  const families = FONT_OPTIONS
    .filter((f) => f.google)
    .map((f) => f.google)
    .join("&family=");
  const link = document.createElement("link");
  link.id = "canvas-extra-fonts";
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  document.head.appendChild(link);
}

export function useCanvasInit(canvasPreset: CanvasPreset) {
  const canvasElRef     = useRef<HTMLCanvasElement>(null);
  const fabricRef       = useRef<Canvas | null>(null);
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const canvasPresetRef = useRef<CanvasPreset>(canvasPreset);
  const clipboardRef    = useRef<FabricObject | null>(null);

  const [canvasReady,   setCanvasReady]   = useState(false);
  const [objectCount,   setObjectCount]   = useState(0);
  const [wrapperWidth,  setWrapperWidth]  = useState(canvasPreset.width);
  const [lastModified,  setLastModified]  = useState(0);

  // Selection state (synced from canvas events)
  const [hasActiveObject,  setHasActiveObject]  = useState(false);
  const [activeObjectType, setActiveObjectType] = useState("");
  const [fontSize,         setFontSize]         = useState(36);
  const [fontFamily,       setFontFamily]       = useState<string>(FONT_OPTIONS[0].value);
  const [strokeWidth,      setStrokeWidth]      = useState(2);
  const [strokeColor,      setStrokeColor]      = useState("#ffffff");
  const [fillColor,        setFillColor]        = useState<string>("transparent");
  const [textAlign,        setTextAlign]        = useState<"left" | "center" | "right">("left");
  const [isBold,           setIsBold]           = useState(false);
  const [isItalic,         setIsItalic]         = useState(false);
  const [isUnderline,      setIsUnderline]      = useState(false);

  // Keep preset ref current
  useEffect(() => { canvasPresetRef.current = canvasPreset; }, [canvasPreset]);

  // Wrapper resize observer
  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new ResizeObserver(([entry]) => setWrapperWidth(entry.contentRect.width));
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  // Canvas resize when preset changes
  useEffect(() => {
    if (!canvasReady || !fabricRef.current) return;
    fabricRef.current.setDimensions({ width: canvasPreset.width, height: canvasPreset.height });
    fabricRef.current.requestRenderAll();
  }, [canvasPreset, canvasReady]);

  // Init Fabric.js canvas
  useEffect(() => {
    loadCanvasFonts();
    if (!canvasElRef.current) return;
    let canvas: Canvas | undefined;

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      const isInput =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      const mod = e.ctrlKey || e.metaKey;

      // ── Copy (Ctrl/⌘ + C) ──────────────────────────────────────────
      if (mod && e.key === "c" && !isInput) {
        const active = fabricRef.current?.getActiveObject();
        // Don't intercept while Fabric IText is in edit mode
        const isEditingText = (active as FabricObject & { isEditing?: boolean })?.isEditing;
        if (active && !isEditingText) {
          active.clone().then((cloned: FabricObject) => {
            clipboardRef.current = cloned;
          });
          e.preventDefault();
        }
        return;
      }

      // ── Paste (Ctrl/⌘ + V) ─────────────────────────────────────────
      if (mod && e.key === "v" && !isInput) {
        const cb = clipboardRef.current;
        if (cb && fabricRef.current) {
          // Clone from clipboard each time so repeated pastes cascade
          cb.clone().then((c: FabricObject) => {
            c.set({
              left: (cb.left ?? 0) + 16,
              top:  (cb.top  ?? 0) + 16,
            });
            fabricRef.current!.add(c);
            fabricRef.current!.setActiveObject(c);
            fabricRef.current!.requestRenderAll();
            // Shift the stored clipboard so the next paste is further offset
            clipboardRef.current = c;
          });
          e.preventDefault();
        }
        return;
      }

      // ── Delete / Backspace ──────────────────────────────────────────
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (isInput) return;
      if (!fabricRef.current) return;
      fabricRef.current
        .getActiveObjects()
        .forEach((o: FabricObject) => fabricRef.current!.remove(o));
      fabricRef.current.discardActiveObject();
      fabricRef.current.requestRenderAll();
      e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);

    (async () => {
      const { Canvas } = await import("fabric");
      const preset = canvasPresetRef.current;
      canvas = new Canvas(canvasElRef.current!, {
        width: preset.width,
        height: preset.height,
        backgroundColor: CANVAS_BG,
        selection: true,
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      const touch         = () => setLastModified(Date.now());
      const syncCount     = () => { setObjectCount(canvas!.getObjects().length); touch(); };
      const syncSelection = () => {
        const obj = canvas!.getActiveObject();
        if (!obj) return;
        setHasActiveObject(true);
        setActiveObjectType(obj.type ?? "");
        if (obj.type === "i-text" || obj.type === "text") {
          const t = obj as IText;
          setFontSize(t.fontSize ?? 36);
          setFontFamily(t.fontFamily ?? FONT_OPTIONS[0].value);
          setTextAlign((t.textAlign as "left" | "center" | "right") ?? "left");
          setIsBold(t.fontWeight === "bold");
          setIsItalic(t.fontStyle === "italic");
          setIsUnderline(t.underline === true);
        }
        setStrokeWidth(obj.strokeWidth ?? 2);
        setStrokeColor(
          typeof obj.stroke === "string" && obj.stroke ? obj.stroke : "#1c1917",
        );
        setFillColor(typeof obj.fill === "string" ? obj.fill : "transparent");
      };

      canvas.on("object:added",      syncCount);
      canvas.on("object:removed",    syncCount);
      canvas.on("object:modified",   touch);
      canvas.on("selection:created", syncSelection);
      canvas.on("selection:updated", syncSelection);
      canvas.on("selection:cleared", () => {
        setHasActiveObject(false);
        setActiveObjectType("");
      });

      setCanvasReady(true);
    })();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      canvas?.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Transparent background so SVG illustration shows through
  useEffect(() => {
    if (!canvasReady || !fabricRef.current) return;
    fabricRef.current.backgroundColor = "transparent";
    fabricRef.current.requestRenderAll();
  }, [canvasReady]);

  // Deselect when clicking outside the canvas
  useEffect(() => {
    if (!canvasReady) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const fabric = fabricRef.current;
      if (!fabric) return;
      const wrapper = (fabric as { wrapperEl?: HTMLElement }).wrapperEl;
      if (!wrapper || wrapper.contains(e.target as Node)) return;
      if ((e.target as Element).closest?.("[data-no-deselect]")) return;
      fabric.discardActiveObject();
      fabric.requestRenderAll();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [canvasReady]);

  const isTextSelected =
    hasActiveObject &&
    (activeObjectType === "i-text" || activeObjectType === "text");

  return {
    // refs
    canvasElRef, fileInputRef, wrapperRef, fabricRef, canvasPresetRef,
    // status
    canvasReady, objectCount, wrapperWidth, lastModified,
    // selection state + setters (setters used by apply callbacks in useDesignCanvas)
    hasActiveObject,  setHasActiveObject,
    activeObjectType, setActiveObjectType,
    isTextSelected,
    fontSize,   setFontSize,
    fontFamily, setFontFamily,
    strokeWidth, setStrokeWidth,
    strokeColor, setStrokeColor,
    fillColor,   setFillColor,
    textAlign,   setTextAlign,
    isBold,      setIsBold,
    isItalic,    setIsItalic,
    isUnderline, setIsUnderline,
  };
}
