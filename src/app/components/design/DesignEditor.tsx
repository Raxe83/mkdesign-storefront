"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Hand, Loader2, Monitor } from "lucide-react";
import { cn } from "@/app/utils/utils";
import { useCart } from "@/app/context/CartContext";
import PageHeader from "@/app/components/PageHeader";
import { getPresetForTitle } from "./constants";
import { getBarrelEntry, type BarrelFit } from "./barrel";
import { useDesignCanvas } from "./hooks/useDesignCanvas";
import { useEditorProducts } from "./hooks/useEditorProducts";
import { useEditorZoomPan } from "./hooks/useEditorZoomPan";
import type { SidebarTab } from "./types";
import { CanvasControls } from "./panels/CanvasControls";
import { ImagePanel } from "./panels/ImagePanel";
import { MobileToolbar } from "./panels/MobileToolbar";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ProductPanel } from "./panels/ProductPanel";
import { ShapesPanel } from "./panels/ShapesPanel";
import { TextPanel } from "./panels/TextPanel";
import { DevPanel } from "./panels/DevPanel";
import type { FitState } from "./panels/DevPanel";

const IS_DEV = process.env.NODE_ENV === "development";

const TAB_LABELS: Record<SidebarTab, string> = {
  shapes: "Formen",
  text: "Text",
  image: "Bild",
};

export default function DesignEditor() {
  const { addItem } = useCart();

  /* ── Products ──────────────────────────────────────────────────── */
  const { products, productsLoading, selectedProduct, setSelectedProduct } =
    useEditorProducts();

  /* ── Canvas preset ─────────────────────────────────────────────── */
  const canvasPreset = useMemo(
    () => getPresetForTitle(selectedProduct?.label ?? ""),
    [selectedProduct],
  );

  /* ── Barrel entry + fit state ──────────────────────────────────── */
  const { Component: BarrelIllustration, fit: defaultFit } = getBarrelEntry(
    selectedProduct?.label ?? "",
  );
  const [fitOverride, setFitOverride] = useState<FitState>(defaultFit);
  useEffect(() => { setFitOverride(defaultFit); }, [selectedProduct?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const fit = IS_DEV ? fitOverride : defaultFit;

  /* ── Canvas width override ─────────────────────────────────────── */
  const [customWidth, setCustomWidth] = useState(canvasPreset.width);
  useEffect(() => { setCustomWidth(canvasPreset.width); }, [canvasPreset.id]);

  const overridePreset = useMemo(
    () => ({ ...canvasPreset, width: customWidth, height: fit.canvasH }),
    [canvasPreset, customWidth, fit.canvasH],
  );

  /* ── Canvas ─────────────────────────────────────────────────────── */
  const canvas = useDesignCanvas(selectedProduct, overridePreset);

  /* ── Barrel layout geometry ────────────────────────────────────── */
  const svgW      = canvas.wrapperWidth || canvas.canvasWidth;
  const svgH      = svgW * fit.svgAspect;
  const dispW     = fit.widthFrac * svgW;
  const dispH     = dispW * (canvas.canvasHeight / canvas.canvasWidth);
  const dispScale = dispW / canvas.canvasWidth;
  const canvasTop  = fit.topFrac * svgH;
  const canvasLeft = (svgW - dispW) / 2;

  /* ── Zoom / pan ─────────────────────────────────────────────────── */
  const zoom = useEditorZoomPan(
    canvas.wrapperRef,
    svgW,
    svgH,
    selectedProduct?.id,
  );

  /* ── Sidebar state ─────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<SidebarTab>("shapes");
  const [shapeCat,  setShapeCat]  = useState("Alle");
  const [shapePage, setShapePage] = useState(0);

  /* ── Cart action ───────────────────────────────────────────────── */
  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct?.variantId || canvas.uploadState.status !== "success") return;
    const { result } = canvas.uploadState as Extract<
      typeof canvas.uploadState,
      { status: "success" }
    >;
    await addItem(selectedProduct.variantId, 1, [
      { key: "Design-Vorschau", value: result.previewUrl },
      { key: "_design_id",      value: result.designId },
      { key: "_design_json",    value: result.jsonUrl },
    ]);
  }, [addItem, selectedProduct?.variantId, canvas.uploadState]);

  return (
    <div className="pb-24">
      <PageHeader
        title="Gestalte dein Unikat"
        eyebrow="Design Editor"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Design Editor" }]}
      />

      {/* Desktop hint for small screens */}
      <div className="md:hidden mt-4 mb-2 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 rounded-sm">
        <Monitor size={17} className="shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Desktop empfohlen</p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            Der Design Editor ist für größere Bildschirme optimiert. Für das beste Erlebnis empfehlen wir einen Desktop oder Laptop.
          </p>
        </div>
      </div>

      <div>
        {/* Properties bar */}
        <div className="mt-4" data-no-deselect>
          <PropertiesPanel
            hasActiveObject={canvas.hasActiveObject}
            isTextSelected={canvas.isTextSelected}
            strokeWidth={canvas.strokeWidth}
            fillColor={canvas.fillColor}
            opacity={canvas.opacity}
            textAlign={canvas.textAlign}
            isBold={canvas.isBold}
            isItalic={canvas.isItalic}
            applyStrokeWidth={canvas.applyStrokeWidth}
            applyFillColor={canvas.applyFillColor}
            applyOpacity={canvas.applyOpacity}
            applyTextAlign={canvas.applyTextAlign}
            applyBold={canvas.applyBold}
            applyItalic={canvas.applyItalic}
            bringForward={canvas.bringForward}
            sendBackward={canvas.sendBackward}
            duplicate={canvas.duplicate}
            deleteSelected={canvas.deleteSelected}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start mt-4">
          {/* Left: Tool panel */}
          <div className="hidden lg:flex flex-col gap-4 w-52 shrink-0 relative z-10" data-no-deselect>
            <div className="flex flex-col rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 shadow-sm overflow-hidden">
              <div className="flex border-b border-stone-200/60 dark:border-zinc-700/60">
                {(["shapes", "text", "image"] as SidebarTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 py-2.5 text-[11px] font-medium tracking-[0.07em] uppercase transition-colors duration-200 cursor-pointer",
                      activeTab === tab
                        ? "text-rust border-b-2 border-rust bg-rustLight/50 dark:bg-rustLight/10 -mb-px"
                        : "text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>
              <div className="p-3">
                {activeTab === "shapes" && (
                  <ShapesPanel
                    shapeCat={shapeCat}
                    shapePage={shapePage}
                    onCategoryChange={(cat) => { setShapeCat(cat); setShapePage(0); }}
                    onPageChange={setShapePage}
                    addShapeFromCatalog={canvas.addShapeFromCatalog}
                  />
                )}
                {activeTab === "text" && (
                  <TextPanel
                    isTextSelected={canvas.isTextSelected}
                    fontFamily={canvas.fontFamily}
                    fontSize={canvas.fontSize}
                    onAddText={() => { canvas.addText(); setActiveTab("text"); }}
                    applyFontFamily={canvas.applyFontFamily}
                    applyFontSize={canvas.applyFontSize}
                  />
                )}
                {activeTab === "image" && (
                  <ImagePanel
                    imageUploading={canvas.imageUploading}
                    onClickUpload={() => canvas.fileInputRef.current?.click()}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Middle: Canvas */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div
              ref={canvas.wrapperRef}
              className="w-full relative overflow-hidden rounded-sm bg-cream"
              style={{ height: svgH }}
            >
              {zoom.midPanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <div className="flex items-center gap-2 bg-black/60 text-white/90 text-xs px-3 py-1.5 rounded-sm backdrop-blur-sm select-none">
                    <Hand size={13} /> Verschieben
                  </div>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translate(${zoom.cssTx}px, ${zoom.cssTy}px) scale(${zoom.cssZoom})`,
                  transformOrigin: "0 0",
                  cursor: zoom.panMode ? "grab" : "default",
                }}
              >
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  <BarrelIllustration showBackground={false} showFloorShadow={false} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: dispW, height: dispH,
                    left: canvasLeft, top: canvasTop,
                    zIndex: 1,
                    outline: "1.5px dashed rgba(255,255,255,0.45)",
                    pointerEvents: zoom.panMode ? "none" : "auto",
                  }}
                >
                  {!canvas.canvasReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3 text-white/70">
                        <Loader2 size={28} className="animate-spin" />
                        <span className="text-sm">Canvas wird geladen…</span>
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      transform: `scale(${dispScale})`,
                      transformOrigin: "top left",
                      width: canvas.canvasWidth,
                      height: canvas.canvasHeight,
                      display: canvas.canvasReady ? "block" : "none",
                      position: "absolute",
                      inset: 0,
                    }}
                  >
                    <canvas ref={canvas.canvasElRef} />
                  </div>
                </div>
              </div>
            </div>

            {canvas.canvasReady && (
              <CanvasControls
                cssZoom={zoom.cssZoom}
                panMode={zoom.panMode}
                onZoomIn={zoom.zoomIn}
                onZoomOut={zoom.zoomOut}
                onZoomReset={zoom.zoomReset}
                onTogglePan={() => zoom.setPanMode((v) => !v)}
                onDownload={canvas.downloadPNG}
              />
            )}

            <div className="lg:hidden" data-no-deselect>
              <MobileToolbar
                imageUploading={canvas.imageUploading}
                hasSelection={canvas.objectCount > 0}
                onAddText={() => { canvas.addText(); setActiveTab("text"); }}
                onUploadImage={() => canvas.fileInputRef.current?.click()}
                onDelete={canvas.deleteSelected}
                onDownload={canvas.downloadPNG}
              />
            </div>
          </div>

          {/* Right: Product + Save */}
          <aside className="w-full lg:w-60 xl:w-72 flex flex-col gap-4 relative z-10" data-no-deselect>
            <ProductPanel
              products={products}
              productsLoading={productsLoading}
              selectedProduct={selectedProduct}
              objectCount={canvas.objectCount}
              uploadState={canvas.uploadState}
              onSelectProduct={(p) => { setSelectedProduct(p); canvas.resetUploadState(); }}
              onSave={canvas.saveDesign}
              onResetUpload={canvas.resetUploadState}
              onAddToCart={handleAddToCart}
            />
            {IS_DEV && (
              <DevPanel
                canvasWidth={customWidth}
                fit={fitOverride}
                onCanvasWidthChange={setCustomWidth}
                onFitChange={(patch) => setFitOverride((prev) => ({ ...prev, ...patch }))}
              />
            )}
          </aside>
        </div>

        <input
          ref={canvas.fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={canvas.handleImageUpload}
        />
      </div>
    </div>
  );
}
