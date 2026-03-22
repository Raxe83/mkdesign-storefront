"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadDesign, uploadCanvasImage, type UploadState } from "@/app/lib/designApi";
import { CANVAS_BG, DEFAULT_CANVAS_PRESET, FONT_OPTIONS, type CanvasPreset } from "../constants";
import type { FabricConf, ProductOption } from "../types";

export function useDesignCanvas(
  selectedProduct: ProductOption | null,
  canvasPreset: CanvasPreset = DEFAULT_CANVAS_PRESET,
) {
  const canvasElRef      = useRef<HTMLCanvasElement>(null);
  const fabricRef        = useRef<any>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const wrapperRef       = useRef<HTMLDivElement>(null);
  const canvasPresetRef  = useRef<CanvasPreset>(canvasPreset);

  // Canvas status
  const [canvasReady,    setCanvasReady]    = useState(false);
  const [objectCount,    setObjectCount]    = useState(0);
  const [wrapperWidth,   setWrapperWidth]   = useState(canvasPreset.width);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadState,    setUploadState]    = useState<UploadState>({ status: "idle" });

  // Selected object properties
  const [hasActiveObject,  setHasActiveObject]  = useState(false);
  const [activeObjectType, setActiveObjectType] = useState("");
  const [fontSize,         setFontSize]         = useState(36);
  const [fontFamily,       setFontFamily]       = useState<string>(FONT_OPTIONS[0].value);
  const [strokeWidth,      setStrokeWidth]      = useState(2);
  const [strokeColor,      setStrokeColor]      = useState("#ffffff");
  const [fillColor,        setFillColor]        = useState<string>("transparent");
  const [opacity,          setOpacity]          = useState(100);
  const [textAlign,        setTextAlign]        = useState<"left" | "center" | "right">("left");
  const [isBold,           setIsBold]           = useState(false);
  const [isItalic,         setIsItalic]         = useState(false);

  // Derived scale — reacts to both wrapper size and active preset
  const canvasScale = Math.min(1, wrapperWidth / canvasPreset.width);

  /* ── Keep preset ref current ──────────────────────────────────── */
  useEffect(() => {
    canvasPresetRef.current = canvasPreset;
  }, [canvasPreset]);

  /* ── Wrapper resize observer ──────────────────────────────────── */
  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setWrapperWidth(entry.contentRect.width);
    });
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Canvas resize when preset changes ───────────────────────── */
  useEffect(() => {
    if (!canvasReady || !fabricRef.current) return;
    fabricRef.current.setDimensions({ width: canvasPreset.width, height: canvasPreset.height });
    fabricRef.current.requestRenderAll();
  }, [canvasPreset, canvasReady]);

  /* ── Init canvas ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!canvasElRef.current) return;
    let canvas: any;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (document.activeElement as HTMLElement)?.isContentEditable) return;
      if (!fabricRef.current) return;
      fabricRef.current.getActiveObjects().forEach((o: any) => fabricRef.current!.remove(o));
      fabricRef.current.discardActiveObject();
      fabricRef.current.requestRenderAll();
      e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);

    (async () => {
      const { Canvas } = await import("fabric");
      const preset = canvasPresetRef.current;
      canvas = new Canvas(canvasElRef.current!, {
        width: preset.width, height: preset.height,
        backgroundColor: CANVAS_BG,
        selection: true, preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      const syncCount = () => setObjectCount(canvas.getObjects().length);

      const syncSelection = () => {
        const obj = canvas.getActiveObject();
        if (!obj) return;
        setHasActiveObject(true);
        setActiveObjectType(obj.type ?? "");
        if (obj.type === "i-text" || obj.type === "text") {
          setFontSize((obj as any).fontSize ?? 36);
          setFontFamily((obj as any).fontFamily ?? FONT_OPTIONS[0].value);
          setTextAlign((obj as any).textAlign ?? "left");
          setIsBold((obj as any).fontWeight === "bold");
          setIsItalic((obj as any).fontStyle === "italic");
        }
        setStrokeWidth((obj as any).strokeWidth ?? 2);
        setStrokeColor(typeof (obj as any).stroke === "string" && (obj as any).stroke ? (obj as any).stroke : "#1c1917");
        setFillColor(typeof (obj as any).fill === "string" ? (obj as any).fill : "transparent");
        setOpacity(Math.round(((obj as any).opacity ?? 1) * 100));
      };
      canvas.on("selection:created", syncSelection);
      canvas.on("selection:updated", syncSelection);
      canvas.on("selection:cleared", () => { setHasActiveObject(false); setActiveObjectType(""); });

      setCanvasReady(true);
    })();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      canvas?.dispose();
      fabricRef.current = null;
    };
  }, []);

  /* ── Background: transparent so SVG behind canvas shows through ── */
  useEffect(() => {
    if (!canvasReady || !fabricRef.current) return;
    fabricRef.current.backgroundColor = "transparent";
    fabricRef.current.requestRenderAll();
  }, [canvasReady]);

  /* ── Deselect when clicking outside the canvas element ───────── */
  useEffect(() => {
    if (!canvasReady) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const fabric = fabricRef.current;
      if (!fabric) return;
      // fabric.wrapperEl wraps both the lower (render) and upper (interaction) canvas
      const wrapper = (fabric as any).wrapperEl as HTMLElement | undefined;
      if (!wrapper || wrapper.contains(e.target as Node)) return;
      fabric.discardActiveObject();
      fabric.requestRenderAll();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [canvasReady]);

  /* ── Apply callbacks ──────────────────────────────────────────── */
  const applyFontSize = useCallback((size: number) => {
    setFontSize(size);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontSize", size);
      fabricRef.current?.requestRenderAll();
    }
  }, []);

  const applyFontFamily = useCallback((family: string) => {
    setFontFamily(family);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontFamily", family);
      fabricRef.current?.requestRenderAll();
    }
  }, []);

  const applyStrokeWidth = useCallback((w: number) => {
    setStrokeWidth(w);
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { obj.set("strokeWidth", w); fabricRef.current?.requestRenderAll(); }
  }, []);

  const applyOpacity = useCallback((val: number) => {
    setOpacity(val);
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { obj.set("opacity", val / 100); fabricRef.current?.requestRenderAll(); }
  }, []);

  const applyFillColor = useCallback((color: string) => {
    setFillColor(color);
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { obj.set("fill", color); fabricRef.current?.requestRenderAll(); }
  }, []);

  const applyStrokeColor = useCallback((color: string) => {
    setStrokeColor(color);
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { obj.set("stroke", color); fabricRef.current?.requestRenderAll(); }
  }, []);

  const applyTextAlign = useCallback((align: "left" | "center" | "right") => {
    setTextAlign(align);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("textAlign", align);
      fabricRef.current?.requestRenderAll();
    }
  }, []);

  const applyBold = useCallback((bold: boolean) => {
    setIsBold(bold);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontWeight", bold ? "bold" : "normal");
      fabricRef.current?.requestRenderAll();
    }
  }, []);

  const applyItalic = useCallback((italic: boolean) => {
    setIsItalic(italic);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontStyle", italic ? "italic" : "normal");
      fabricRef.current?.requestRenderAll();
    }
  }, []);

  /* ── Canvas actions ───────────────────────────────────────────── */
  const bringForward = useCallback(() => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { fabricRef.current?.bringObjectForward(obj); fabricRef.current?.requestRenderAll(); }
  }, []);

  const sendBackward = useCallback(() => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { fabricRef.current?.sendObjectBackwards(obj); fabricRef.current?.requestRenderAll(); }
  }, []);

  const duplicate = useCallback(async () => {
    const obj = fabricRef.current?.getActiveObject();
    if (!obj || !fabricRef.current) return;
    const cloned = await obj.clone();
    cloned.set({ left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20 });
    fabricRef.current.add(cloned);
    fabricRef.current.setActiveObject(cloned);
    fabricRef.current.requestRenderAll();
  }, []);

  const deleteSelected = useCallback(() => {
    if (!fabricRef.current) return;
    fabricRef.current.getActiveObjects().forEach((o: any) => fabricRef.current!.remove(o));
    fabricRef.current.discardActiveObject();
    fabricRef.current.requestRenderAll();
  }, []);

  const downloadPNG = useCallback(() => {
    if (!fabricRef.current) return;
    const a    = document.createElement("a");
    a.href     = fabricRef.current.toDataURL({ format: "png", multiplier: 2 });
    a.download = `design-${selectedProduct?.id ?? "custom"}.png`;
    a.click();
  }, [selectedProduct]);

  const addText = useCallback(async () => {
    if (!fabricRef.current) return;
    const { IText } = await import("fabric");
    const cx = canvasPresetRef.current.width  / 2;
    const cy = canvasPresetRef.current.height / 2;
    const t = new IText("Dein Text", {
      left: cx, top: cy, originX: "center", originY: "center",
      fontSize: 36, fontFamily: FONT_OPTIONS[0].value, fill: "#ffffff",
    });
    fabricRef.current.add(t);
    fabricRef.current.setActiveObject(t);
    fabricRef.current.requestRenderAll();
  }, []);

  const addShapeFromCatalog = useCallback(async (fc: FabricConf) => {
    if (!fabricRef.current) return;
    const cx = canvasPresetRef.current.width  / 2;
    const cy = canvasPresetRef.current.height / 2;
    const base = {
      left: cx, top: cy, originX: "center", originY: "center",
      fill: "transparent", stroke: "#ffffff", strokeWidth: 2,
    } as const;
    const { Rect, Circle: FC, Ellipse, Triangle: FT, Line, Polygon, Path } = await import("fabric");
    let obj: any;
    switch (fc.k) {
      case "rect":     obj = new Rect({ ...base, width: fc.w, height: fc.h, rx: fc.rx ?? 0 }); break;
      case "circle":   obj = new FC({ ...base, radius: fc.r }); break;
      case "ellipse":  obj = new Ellipse({ ...base, rx: fc.rx, ry: fc.ry }); break;
      case "triangle": obj = new FT({ ...base, width: fc.w, height: fc.h }); break;
      case "line":     obj = new Line([0, 0, 140, 0], { ...base, originX: "left", originY: "top", left: cx - 70, top: cy }); break;
      case "poly":     obj = new Polygon(fc.pts, { ...base }); break;
      case "path":     obj = new Path(fc.d, { ...base }); break;
      case "svg": {
        const { FabricImage: FImg } = await import("fabric");
        const blob = new Blob([fc.markup], { type: "image/svg+xml" });
        const url  = URL.createObjectURL(blob);
        const img  = await FImg.fromURL(url);
        img.set({ left: cx, top: cy, originX: "center", originY: "center" });
        img.scaleToWidth(130);
        URL.revokeObjectURL(url);
        obj = img;
        break;
      }
      default: return;
    }
    fabricRef.current.add(obj);
    fabricRef.current.setActiveObject(obj);
    fabricRef.current.requestRenderAll();
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricRef.current || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    e.target.value = "";
    setImageUploading(true);
    try {
      const cdnUrl = await uploadCanvasImage(file);
      const { FabricImage } = await import("fabric");
      const img = await FabricImage.fromURL(cdnUrl, { crossOrigin: "anonymous" });
      img.scaleToWidth(200);
      fabricRef.current.add(img);
      fabricRef.current.setActiveObject(img);
      fabricRef.current.requestRenderAll();
    } finally {
      setImageUploading(false);
    }
  }, []);

  /* ── Save & upload ────────────────────────────────────────────── */
  const saveDesign = useCallback(async () => {
    if (!fabricRef.current || !selectedProduct) return;
    setUploadState({ status: "uploading", step: "preview" });
    try {
      const canvasJson     = fabricRef.current.toJSON();
      const previewDataUrl = fabricRef.current.toDataURL({ format: "png", multiplier: 2 });
      const result = await uploadDesign(
        { productId: selectedProduct.id, canvasJson, previewDataUrl },
        (step) => setUploadState({ status: "uploading", step }),
      );
      setUploadState({ status: "success", result });
    } catch (err) {
      setUploadState({
        status: "error",
        message: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  }, [selectedProduct]);

  const resetUploadState = useCallback(() => setUploadState({ status: "idle" }), []);

  /* ── Derived ──────────────────────────────────────────────────── */
  const isTextSelected = hasActiveObject && (activeObjectType === "i-text" || activeObjectType === "text");

  return {
    // refs
    canvasElRef,
    fileInputRef,
    wrapperRef,
    // status
    canvasReady,
    objectCount,
    canvasScale,
    canvasWidth:  canvasPreset.width,
    canvasHeight: canvasPreset.height,
    wrapperWidth,
    imageUploading,
    uploadState,
    // selection state
    hasActiveObject,
    isTextSelected,
    fontSize,
    fontFamily,
    strokeWidth,
    strokeColor,
    fillColor,
    opacity,
    textAlign,
    isBold,
    isItalic,
    // apply callbacks
    applyFontSize,
    applyFontFamily,
    applyStrokeWidth,
    applyStrokeColor,
    applyFillColor,
    applyOpacity,
    applyTextAlign,
    applyBold,
    applyItalic,
    // canvas actions
    bringForward,
    sendBackward,
    duplicate,
    deleteSelected,
    downloadPNG,
    addText,
    addShapeFromCatalog,
    handleImageUpload,
    // save
    saveDesign,
    resetUploadState,
  };
}
