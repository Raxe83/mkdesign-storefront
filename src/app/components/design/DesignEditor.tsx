"use client";

import { useCallback, useEffect, useState } from "react";
import { Circle, Diamond, Hexagon, Loader2, Minus, Square, Star, Triangle, Type } from "lucide-react";
import { cn } from "@/app/utils/utils";
import { useCart } from "@/app/context/CartContext";
import { getProducts } from "@/app/services/shopify";
import PageHeader from "@/app/components/PageHeader";
import { CANVAS_SIZE } from "./constants";
import { useDesignCanvas } from "./hooks/useDesignCanvas";
import type { ProductOption, SidebarTab } from "./types";
import { ImagePanel }      from "./panels/ImagePanel";
import { MobileToolbar }   from "./panels/MobileToolbar";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ProductPanel }    from "./panels/ProductPanel";
import { ShapesPanel }     from "./panels/ShapesPanel";
import { TextPanel }       from "./panels/TextPanel";

export default function DesignEditor() {
  const { addItem } = useCart();

  /* ── Products ─────────────────────────────────────────────────── */
  const [products,        setProducts]        = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getProducts(50, undefined, "CustomDesign");
        const mapped: ProductOption[] = raw.map((p) => {
          const variant = p.variants.edges[0]?.node ?? null;
          return {
            id:            p.id,
            label:         p.title,
            backgroundUrl: p.featuredImage?.url ?? null,
            variantId:     variant?.id ?? null,
            price:         variant ? `${parseFloat(variant.price.amount).toFixed(2)} ${variant.price.currencyCode}` : "",
          };
        });
        setProducts(mapped);
        if (mapped.length > 0) setSelectedProduct(mapped[0]);
      } catch (err) {
        console.error("Produkte konnten nicht geladen werden:", err);
      } finally {
        setProductsLoading(false);
      }
    })();
  }, []);

  /* ── Canvas hook ──────────────────────────────────────────────── */
  const canvas = useDesignCanvas(selectedProduct);

  /* ── Sidebar UI state ─────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<SidebarTab>("shapes");
  const [shapeCat,  setShapeCat]  = useState("Alle");
  const [shapePage, setShapePage] = useState(0);

  /* ── Cart action ──────────────────────────────────────────────── */
  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct?.variantId || canvas.uploadState.status !== "success") return;
    const { result } = canvas.uploadState as Extract<typeof canvas.uploadState, { status: "success" }>;
    await addItem(selectedProduct.variantId, 1, [
      { key: "Design-Vorschau", value: result.previewUrl },
      { key: "_design_id",      value: result.designId },
      { key: "_design_json",    value: result.jsonUrl },
    ]);
  }, [addItem, selectedProduct?.variantId, canvas.uploadState]);

  /* ── Mobile shape actions ─────────────────────────────────────── */
  const mobileShapes = [
    { icon: <Square   size={16} />, label: "Rect",    action: () => canvas.addShapeFromCatalog({ k: "rect",   w: 140, h: 90 }) },
    { icon: <Circle   size={16} />, label: "Kreis",   action: () => canvas.addShapeFromCatalog({ k: "circle", r: 55 }) },
    { icon: <Triangle size={16} />, label: "Dreieck", action: () => canvas.addShapeFromCatalog({ k: "triangle", w: 130, h: 110 }) },
    { icon: <Minus    size={16} />, label: "Linie",   action: () => canvas.addShapeFromCatalog({ k: "line" }) },
    { icon: <Star     size={16} />, label: "Stern",   action: () => canvas.addShapeFromCatalog({ k: "poly", pts: [{ x: 0, y: -62 }, { x: 14, y: -22 }, { x: 59, y: -19 }, { x: 23, y: 9 }, { x: 36, y: 54 }, { x: 0, y: 31 }, { x: -36, y: 54 }, { x: -23, y: 9 }, { x: -59, y: -19 }, { x: -14, y: -22 }] }) },
    { icon: <Hexagon  size={16} />, label: "Sechseck",action: () => canvas.addShapeFromCatalog({ k: "poly", pts: [{ x: 60, y: 0 }, { x: 30, y: 52 }, { x: -30, y: 52 }, { x: -60, y: 0 }, { x: -30, y: -52 }, { x: 30, y: -52 }] }) },
    { icon: <Diamond  size={16} />, label: "Raute",   action: () => canvas.addShapeFromCatalog({ k: "poly", pts: [{ x: 0, y: -68 }, { x: 54, y: 0 }, { x: 0, y: 68 }, { x: -54, y: 0 }] }) },
    { icon: <Type     size={16} />, label: "Text",    action: () => { canvas.addText(); setActiveTab("text"); } },
  ];

  /* ── Tab labels ───────────────────────────────────────────────── */
  const TAB_LABELS: Record<SidebarTab, string> = { shapes: "Formen", text: "Text", image: "Bild" };

  return (
    <div className="pb-24">
      <PageHeader
        title="Gestalte dein Unikat"
        eyebrow="Design Editor"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Design Editor" }]}
      />

      {/* ── Properties bar (full width, below header) ── */}
      {canvas.hasActiveObject && (
        <div className="mt-4">
          <PropertiesPanel
            isTextSelected={canvas.isTextSelected}
            strokeWidth={canvas.strokeWidth}
            textAlign={canvas.textAlign}
            isBold={canvas.isBold}
            isItalic={canvas.isItalic}
            applyStrokeWidth={canvas.applyStrokeWidth}
            applyTextAlign={canvas.applyTextAlign}
            applyBold={canvas.applyBold}
            applyItalic={canvas.applyItalic}
            bringForward={canvas.bringForward}
            sendBackward={canvas.sendBackward}
            deleteSelected={canvas.deleteSelected}
            downloadPNG={canvas.downloadPNG}
          />
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6 items-start mt-4">

        {/* ══ Left: Tool panel (desktop only) ══ */}
        <div className="hidden xl:flex flex-col gap-4 w-56 shrink-0">

          {/* Tab switcher + panel content */}
          <div className="flex flex-col rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 shadow-sm overflow-hidden">
            {/* Tab bar */}
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

            {/* Panel body */}
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

        {/* ══ Middle: Canvas ══ */}
        <div className="w-full xl:flex-1 flex flex-col gap-4">
          <div ref={canvas.wrapperRef} className="w-full">
            <div
              style={{ width: CANVAS_SIZE * canvas.canvasScale, height: CANVAS_SIZE * canvas.canvasScale, overflow: "hidden" }}
              className="mx-auto rounded shadow-md"
            >
              {!canvas.canvasReady && (
                <div
                  style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, transform: `scale(${canvas.canvasScale})`, transformOrigin: "top left" }}
                  className="flex items-center justify-center bg-stone-100 dark:bg-zinc-800 rounded"
                >
                  <div className="flex flex-col items-center gap-3 text-muted">
                    <Loader2 size={28} className="animate-spin" />
                    <span className="text-sm">Canvas wird geladen…</span>
                  </div>
                </div>
              )}
              <div
                style={{
                  transform: `scale(${canvas.canvasScale})`, transformOrigin: "top left",
                  width: CANVAS_SIZE, height: CANVAS_SIZE,
                  display: canvas.canvasReady ? "block" : "none",
                }}
                className="overflow-hidden"
              >
                <canvas ref={canvas.canvasElRef} />
              </div>
            </div>
          </div>

          {canvas.canvasReady && (
            <p className="text-center text-xs text-stone dark:text-muted">
              Klicken zum Auswählen&ensp;·&ensp;Doppelklick zum Bearbeiten&ensp;·&ensp;Ecken zum Skalieren
            </p>
          )}

          {/* Mobile toolbar */}
          <div className="xl:hidden">
            <MobileToolbar
              shapes={mobileShapes}
              imageUploading={canvas.imageUploading}
              hasSelection={canvas.objectCount > 0}
              onUploadImage={() => canvas.fileInputRef.current?.click()}
              onDelete={canvas.deleteSelected}
              onDownload={canvas.downloadPNG}
            />
          </div>
        </div>

        {/* ══ Right: Product + Save ══ */}
        <aside className="w-full xl:w-72 flex flex-col gap-4">
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
        </aside>
      </div>

      {/* Hidden file input */}
      <input
        ref={canvas.fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={canvas.handleImageUpload}
      />
    </div>
  );
}
