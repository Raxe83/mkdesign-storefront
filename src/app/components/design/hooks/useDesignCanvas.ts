"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadDesign, uploadCanvasImage, type UploadState } from "@/app/lib/designApi";
import { CANVAS_BG, CANVAS_SIZE, FONT_OPTIONS } from "../constants";
import type { FabricConf, ProductOption } from "../types";

export function useDesignCanvas(selectedProduct: ProductOption | null) {
  const canvasElRef  = useRef<HTMLCanvasElement>(null);
  const fabricRef    = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);

  // Canvas status
  const [canvasReady,    setCanvasReady]    = useState(false);
  const [objectCount,    setObjectCount]    = useState(0);
  const [canvasScale,    setCanvasScale]    = useState(1);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadState,    setUploadState]    = useState<UploadState>({ status: "idle" });

  // Selected object properties
  const [hasActiveObject,  setHasActiveObject]  = useState(false);
  const [activeObjectType, setActiveObjectType] = useState("");
  const [fontSize,         setFontSize]         = useState(36);
  const [fontFamily,       setFontFamily]       = useState<string>(FONT_OPTIONS[0].value);
  const [strokeWidth,      setStrokeWidth]      = useState(2);
  const [opacity,          setOpacity]          = useState(100);
  const [textAlign,        setTextAlign]        = useState<"left" | "center" | "right">("left");
  const [isBold,           setIsBold]           = useState(false);
  const [isItalic,         setIsItalic]         = useState(false);

  /* ── Canvas scale ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setCanvasScale(Math.min(1, entry.contentRect.width / CANVAS_SIZE));
    });
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

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
      canvas = new Canvas(canvasElRef.current!, {
        width: CANVAS_SIZE, height: CANVAS_SIZE,
        backgroundColor: CANVAS_BG,
        selection: true, preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      const syncCount = () => setObjectCount(canvas.getObjects().length);
      canvas.on("object:added",   syncCount);
      canvas.on("object:removed", syncCount);

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

  /* ── Background swap ──────────────────────────────────────────── */
  useEffect(() => {
    if (!canvasReady || !fabricRef.current || !selectedProduct) return;
    const canvas = fabricRef.current;
    (async () => {
      if (selectedProduct.backgroundUrl) {
        try {
          const { FabricImage } = await import("fabric");
          const img = await FabricImage.fromURL(selectedProduct.backgroundUrl, { crossOrigin: "anonymous" });
          img.scaleToWidth(CANVAS_SIZE);
          img.scaleToHeight(CANVAS_SIZE);
          canvas.backgroundImage = img;
          canvas.backgroundColor = undefined;
        } catch {
          canvas.backgroundImage = null;
          canvas.backgroundColor = CANVAS_BG;
        }
      } else {
        canvas.backgroundImage = null;
        canvas.backgroundColor = CANVAS_BG;
      }
      canvas.requestRenderAll();
    })();
  }, [selectedProduct, canvasReady]);

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
    const t = new IText("Dein Text", {
      left: 120, top: 120, fontSize: 36,
      fontFamily: FONT_OPTIONS[0].value, fill: "#1c1917",
    });
    fabricRef.current.add(t);
    fabricRef.current.setActiveObject(t);
    fabricRef.current.requestRenderAll();
  }, []);

  const addShapeFromCatalog = useCallback(async (fc: FabricConf) => {
    if (!fabricRef.current) return;
    const base = {
      left: 250, top: 250, originX: "center", originY: "center",
      fill: "transparent", stroke: "#1c1917", strokeWidth: 2,
    } as const;
    const { Rect, Circle: FC, Ellipse, Triangle: FT, Line, Polygon, Path } = await import("fabric");
    let obj: any;
    switch (fc.k) {
      case "rect":     obj = new Rect({ ...base, width: fc.w, height: fc.h, rx: fc.rx ?? 0 }); break;
      case "circle":   obj = new FC({ ...base, radius: fc.r }); break;
      case "ellipse":  obj = new Ellipse({ ...base, rx: fc.rx, ry: fc.ry }); break;
      case "triangle": obj = new FT({ ...base, width: fc.w, height: fc.h }); break;
      case "line":     obj = new Line([0, 0, 140, 0], { ...base, originX: "left", originY: "top", left: 180, top: 250 }); break;
      case "poly":     obj = new Polygon(fc.pts, { ...base }); break;
      case "path":     obj = new Path(fc.d, { ...base }); break;
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
    imageUploading,
    uploadState,
    // selection state
    hasActiveObject,
    isTextSelected,
    fontSize,
    fontFamily,
    strokeWidth,
    opacity,
    textAlign,
    isBold,
    isItalic,
    // apply callbacks
    applyFontSize,
    applyFontFamily,
    applyStrokeWidth,
    applyOpacity,
    applyTextAlign,
    applyBold,
    applyItalic,
    // canvas actions
    bringForward,
    sendBackward,
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
