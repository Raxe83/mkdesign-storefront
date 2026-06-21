"use client";

import { useCallback, useState } from "react";
import { uploadDualDesign, uploadCanvasImage, type UploadState } from "@/app/lib/designApi";
import { FONT_OPTIONS, type CanvasPreset } from "../constants";
import type { FabricConf, ProductOption } from "../types";
import type { FabricObject } from "fabric";
import { useCanvasInit } from "./useCanvasInit";
import { useCanvasHistory } from "./useCanvasHistory";

/** Rendert ein Fabric-JSON-Objekt auf einem Offscreen-Canvas und gibt ein PNG-DataURL zurück. */
async function renderJsonToDataUrl(json: object, preset: CanvasPreset): Promise<string> {
  const el = document.createElement("canvas");
  el.width  = preset.width;
  el.height = preset.height;
  const { Canvas } = await import("fabric");
  const fc = new Canvas(el, { width: preset.width, height: preset.height });
  await fc.loadFromJSON(json);
  fc.backgroundColor = "transparent";
  fc.requestRenderAll();
  const dataUrl = fc.toDataURL({ format: "png", multiplier: 2 });
  fc.dispose();
  return dataUrl;
}

export function useDesignCanvas(
  selectedProduct: ProductOption | null,
  canvasPreset: CanvasPreset,
) {
  const init = useCanvasInit(canvasPreset);
  const { fabricRef, canvasPresetRef } = init;
  const history = useCanvasHistory(fabricRef, init.canvasReady);

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadState,    setUploadState]    = useState<UploadState>({ status: "idle" });

  // ─── Apply callbacks ────────────────────────────────────────────────────────

  const applyFontSize = useCallback((size: number) => {
    init.setFontSize(size);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontSize", size);
      fabricRef.current?.requestRenderAll();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFontFamily = useCallback((family: string) => {
    init.setFontFamily(family);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontFamily", family);
      fabricRef.current?.requestRenderAll();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyStrokeWidth = useCallback((w: number) => {
    init.setStrokeWidth(w);
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { obj.set("strokeWidth", w); fabricRef.current?.requestRenderAll(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFillColor = useCallback((color: string) => {
    init.setFillColor(color);
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { obj.set("fill", color); fabricRef.current?.requestRenderAll(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyStrokeColor = useCallback((color: string) => {
    init.setStrokeColor(color);
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { obj.set("stroke", color); fabricRef.current?.requestRenderAll(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyTextAlign = useCallback((align: "left" | "center" | "right") => {
    init.setTextAlign(align);
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      const w = canvasPresetRef.current.width;
      obj.set("textAlign", align);
      // Snap position to canvas edge
      if (align === "left") {
        obj.set({ originX: "left", left: 10 });
      } else if (align === "center") {
        obj.set({ originX: "center", left: w / 2 });
      } else {
        obj.set({ originX: "right", left: w - 10 });
      }
      canvas?.requestRenderAll();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyBold = useCallback((bold: boolean) => {
    init.setIsBold(bold);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontWeight", bold ? "bold" : "normal");
      fabricRef.current?.requestRenderAll();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyItalic = useCallback((italic: boolean) => {
    init.setIsItalic(italic);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("fontStyle", italic ? "italic" : "normal");
      fabricRef.current?.requestRenderAll();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyUnderline = useCallback((underline: boolean) => {
    init.setIsUnderline(underline);
    const obj = fabricRef.current?.getActiveObject();
    if (obj && (obj.type === "i-text" || obj.type === "text")) {
      obj.set("underline", underline);
      fabricRef.current?.requestRenderAll();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Canvas actions ─────────────────────────────────────────────────────────

  const bringForward = useCallback(() => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { fabricRef.current?.bringObjectForward(obj); fabricRef.current?.requestRenderAll(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendBackward = useCallback(() => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj) { fabricRef.current?.sendObjectBackwards(obj); fabricRef.current?.requestRenderAll(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const duplicate = useCallback(async () => {
    const obj = fabricRef.current?.getActiveObject();
    if (!obj || !fabricRef.current) return;
    const cloned = await obj.clone();
    cloned.set({ left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20 });
    fabricRef.current.add(cloned);
    fabricRef.current.setActiveObject(cloned);
    fabricRef.current.requestRenderAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteSelected = useCallback(() => {
    if (!fabricRef.current) return;
    fabricRef.current
      .getActiveObjects()
      .forEach((o: FabricObject) => fabricRef.current!.remove(o));
    fabricRef.current.discardActiveObject();
    fabricRef.current.requestRenderAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const downloadPNG = useCallback(() => {
    if (!fabricRef.current) return;
    const a    = document.createElement("a");
    a.href     = fabricRef.current.toDataURL({ format: "png", multiplier: 2 });
    a.download = `design-${selectedProduct?.id ?? "custom"}.png`;
    a.click();
  }, [selectedProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  const addText = useCallback(async () => {
    if (!fabricRef.current) return;
    const { IText } = await import("fabric");
    const cx = canvasPresetRef.current.width  / 2;
    const cy = canvasPresetRef.current.height / 2;
    const t  = new IText("Dein Text", {
      left: cx, top: cy, originX: "center", originY: "center",
      fontSize: 36, fontFamily: FONT_OPTIONS[0].value, fill: "#ffffff",
    });
    fabricRef.current.add(t);
    fabricRef.current.setActiveObject(t);
    fabricRef.current.requestRenderAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addCurvedText = useCallback(async (text: string, radius = 180, fontFamily = FONT_OPTIONS[0].value, fontSize = 36) => {
    if (!fabricRef.current) return;
    const size = radius * 2 + fontSize * 2;
    const cx = size / 2;
    const cy = size / 2;
    const r  = radius;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs>
        <path id="arc" d="M ${cx - r},${cy} a ${r},${r} 0 0,1 ${r * 2},0" />
      </defs>
      <text fill="white" font-size="${fontSize}" font-family="${fontFamily}" text-anchor="middle">
        <textPath href="#arc" startOffset="50%">${text}</textPath>
      </text>
    </svg>`;
    const { FabricImage } = await import("fabric");
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = await FabricImage.fromURL(url);
    const canvasW = canvasPresetRef.current.width;
    const canvasH = canvasPresetRef.current.height;
    img.set({ left: canvasW / 2, top: canvasH / 2, originX: "center", originY: "center" });
    img.scaleToWidth(Math.min(canvasW * 0.8, size));
    URL.revokeObjectURL(url);
    fabricRef.current.add(img);
    fabricRef.current.setActiveObject(img);
    fabricRef.current.requestRenderAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addShapeFromCatalog = useCallback(async (fc: FabricConf) => {
    if (!fabricRef.current) return;
    const cx   = canvasPresetRef.current.width  / 2;
    const cy   = canvasPresetRef.current.height / 2;
    const base = {
      left: cx, top: cy, originX: "center", originY: "center",
      fill: "transparent", stroke: "#ffffff", strokeWidth: 2,
    } as const;
    const { Rect, Circle: FC, Ellipse, Triangle: FT, Line, Polygon, Path } =
      await import("fabric");
    let obj: FabricObject | undefined;
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ─── Save & upload ──────────────────────────────────────────────────────────

  const saveDesign = useCallback(async (otherSideJson?: object | null) => {
    if (!fabricRef.current || !selectedProduct) return;
    setUploadState({ status: "uploading", step: "preview-a" });
    try {
      const canvasJson     = fabricRef.current.toJSON();
      const previewDataUrl = fabricRef.current.toDataURL({ format: "png", multiplier: 2 });

      const result = await uploadDualDesign(
        {
          productId: selectedProduct.id,
          sideA: { canvasJson, previewDataUrl },
          sideB: otherSideJson
            ? {
                canvasJson: otherSideJson,
                previewDataUrl: await renderJsonToDataUrl(otherSideJson, canvasPresetRef.current),
              }
            : undefined,
        },
        (step) => setUploadState({ status: "uploading", step }),
      );
      setUploadState({ status: "success", result });
    } catch (err) {
      setUploadState({
        status: "error",
        message: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  }, [selectedProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetUploadState = useCallback(() => setUploadState({ status: "idle" }), []);

  const getCanvasJSON = useCallback(() => {
    return fabricRef.current?.toJSON() ?? null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCanvasJSON = useCallback(async (json: object | null) => {
    if (!fabricRef.current) return;
    if (!json) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = "transparent";
      fabricRef.current.requestRenderAll();
      return;
    }
    await fabricRef.current.loadFromJSON(json);
    fabricRef.current.backgroundColor = "transparent";
    fabricRef.current.requestRenderAll();
    // Trigger object count sync
    fabricRef.current.fire("object:added" as Parameters<typeof fabricRef.current.fire>[0]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // from init
    canvasElRef:   init.canvasElRef,
    fileInputRef:  init.fileInputRef,
    wrapperRef:    init.wrapperRef,
    fabricRef:     init.fabricRef,
    canvasReady:   init.canvasReady,
    objectCount:   init.objectCount,
    lastModified:  init.lastModified,
    canvasWidth:   canvasPreset.width,
    canvasHeight: canvasPreset.height,
    wrapperWidth: init.wrapperWidth,
    canvasScale:  Math.min(1, init.wrapperWidth / canvasPreset.width),
    // selection state
    hasActiveObject:  init.hasActiveObject,
    isTextSelected:   init.isTextSelected,
    fontSize:         init.fontSize,
    fontFamily:       init.fontFamily,
    strokeWidth:      init.strokeWidth,
    strokeColor:      init.strokeColor,
    fillColor:        init.fillColor,
    textAlign:        init.textAlign,
    isBold:           init.isBold,
    isItalic:         init.isItalic,
    isUnderline:      init.isUnderline,
    // upload
    imageUploading,
    uploadState,
    // apply callbacks
    applyFontSize, applyFontFamily, applyStrokeWidth, applyStrokeColor,
    applyFillColor, applyTextAlign, applyBold, applyItalic, applyUnderline,
    // actions
    bringForward, sendBackward, duplicate, deleteSelected,
    downloadPNG, addText, addCurvedText, addShapeFromCatalog, handleImageUpload,
    // save
    saveDesign, resetUploadState,
    // side switching
    getCanvasJSON, loadCanvasJSON,
    // history
    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}
