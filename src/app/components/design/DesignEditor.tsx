"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDesignDraft } from "./hooks/useDesignDraft";
import { Hand, HelpCircle, Info, Loader2, Monitor, X } from "lucide-react";
import { cn } from "@/app/utils/utils";
import { useCart } from "@/app/context/CartContext";
import { getPresetForTitle } from "./constants";
import { getBarrelEntry, type BarrelColor } from "./barrel";
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

const COLOR_MAP: Record<string, BarrelColor> = {
  schwarz: "schwarz",
  black: "schwarz",
  silber: "silber",
  silver: "silber",
  grau: "grau",
  gray: "grau",
  grey: "grau",
  gold: "gold",
};

const SWATCH_META: Record<
  BarrelColor,
  { label: string; bg: string; border: string }
> = {
  schwarz: { label: "Schwarz", bg: "#1a1a18", border: "#444" },
  grau: { label: "Unlackiert", bg: "#888886", border: "#aaa" },
  silber: { label: "Silber", bg: "#d0d0d0", border: "#bbb" },
  gold: { label: "Gold", bg: "#c8a020", border: "#a07818" },
};

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
  useEffect(() => {
    setFitOverride(defaultFit);
  }, [selectedProduct?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const fit = IS_DEV ? fitOverride : defaultFit;

  /* ── Canvas width override ─────────────────────────────────────── */
  const [customWidth, setCustomWidth] = useState(canvasPreset.width);
  useEffect(() => {
    setCustomWidth(canvasPreset.width);
  }, [canvasPreset.id]);

  const overridePreset = useMemo(
    () => ({ ...canvasPreset, width: customWidth, height: fit.canvasH }),
    [canvasPreset, customWidth, fit.canvasH],
  );

  /* ── Canvas ─────────────────────────────────────────────────────── */
  const canvas = useDesignCanvas(selectedProduct, overridePreset);

  /* ── Barrel layout geometry ────────────────────────────────────── */
  const svgW = canvas.wrapperWidth || canvas.canvasWidth;
  const svgH = svgW * fit.svgAspect;
  const dispW = fit.widthFrac * svgW;
  const dispH = dispW * (canvas.canvasHeight / canvas.canvasWidth);
  const dispScale = dispW / canvas.canvasWidth;
  const canvasTop = fit.topFrac * svgH;
  const canvasLeft = (svgW - dispW) / 2;

  /* ── Zoom / pan ─────────────────────────────────────────────────── */
  const zoom = useEditorZoomPan(
    canvas.wrapperRef,
    svgW,
    svgH,
    selectedProduct?.id,
  );

  /* ── Barrel-Farbe ───────────────────────────────────────────────── */
  const [selectedColor, setSelectedColor] = useState<BarrelColor>("grau");
  // Reset auf Grau bei Produktwechsel
  useEffect(() => {
    setSelectedColor("grau");
  }, [selectedProduct?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Dual canvas (Seite A / B) ─────────────────────────────────── */
  const hasSideB = !!selectedProduct?.sideBZusatzprodukt;
  const [sideBEnabled, setSideBEnabled] = useState(false);
  const [activeSide, setActiveSide] = useState<"A" | "B">("A");
  const sideAJsonRef = useRef<object | null>(null);
  const sideBJsonRef = useRef<object | null>(null);
  const [sideBCount, setSideBCount] = useState(0);

  /* ── Draft (localStorage, 24h TTL) ─────────────────────────────── */
  const draft = useDesignDraft();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Produkt wechsel oder Canvas-Ready → State zurücksetzen + Draft laden
  useEffect(() => {
    if (!canvas.canvasReady || !selectedProduct) return;

    clearTimeout(saveTimer.current);
    setSideBEnabled(false);
    sideBJsonRef.current = null;
    sideAJsonRef.current = null;
    setSideBCount(0);
    setActiveSide("A");

    const saved = draft.load(selectedProduct.id);
    if (saved) {
      sideAJsonRef.current = saved.sideAJson;
      sideBJsonRef.current = saved.sideBJson;
      if (saved.sideBEnabled) setSideBEnabled(true);
      canvas.loadCanvasJSON(saved.sideAJson);
    } else {
      canvas.loadCanvasJSON(null);
    }
  }, [selectedProduct?.id, canvas.canvasReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save bei jeder Canvas-Änderung (Objekt add/remove/modify)
  useEffect(() => {
    if (!canvas.canvasReady || !selectedProduct || canvas.lastModified === 0)
      return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const sideAJson =
        activeSide === "A"
          ? (canvas.getCanvasJSON() ?? null)
          : sideAJsonRef.current;
      const sideBJson =
        activeSide === "B"
          ? (canvas.getCanvasJSON() ?? null)
          : sideBJsonRef.current;
      draft.save(selectedProduct.id, sideAJson, sideBJson, sideBEnabled);
    }, 1500);
    return () => clearTimeout(saveTimer.current);
  }, [canvas.lastModified]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Gesamtpreis (Basis + Seite B falls aktiviert) ─────────────── */
  const displayPrice = useMemo(() => {
    if (!sideBEnabled || !selectedProduct?.sideBZusatzprodukt)
      return selectedProduct?.price ?? null;
    const base = parseFloat(selectedProduct.price);
    const extra = parseFloat(selectedProduct.sideBZusatzprodukt.price);
    const code = selectedProduct.price.split(" ")[1] ?? "EUR";
    return `${(base + extra).toFixed(2)} ${code}`;
  }, [sideBEnabled, selectedProduct]);

  const switchSide = useCallback(
    async (to: "A" | "B") => {
      if (to === activeSide) return;
      const currentJson = canvas.getCanvasJSON();
      const currentCount = canvas.objectCount;

      if (activeSide === "A") {
        sideAJsonRef.current = currentJson;
        await canvas.loadCanvasJSON(sideBJsonRef.current);
      } else {
        sideBJsonRef.current = currentJson;
        setSideBCount(currentCount);
        await canvas.loadCanvasJSON(sideAJsonRef.current);
      }

      setActiveSide(to);

      // Sofort speichern nach Seitenwechsel (Refs sind jetzt aktuell)
      if (selectedProduct) {
        clearTimeout(saveTimer.current);
        const sideAJson = to === "B" ? currentJson : sideBJsonRef.current;
        const sideBJson = to === "A" ? currentJson : sideAJsonRef.current;
        draft.save(
          selectedProduct.id,
          sideAJson as object | null,
          sideBJson as object | null,
          sideBEnabled,
        );
      }
    },
    [activeSide, canvas, selectedProduct, sideBEnabled, draft],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sidebar state ─────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<SidebarTab>("shapes");
  const [shapeCat, setShapeCat] = useState("Alle");
  const [shapePage, setShapePage] = useState(0);

  /* ── Save — übergibt die andere Seite für Dual-Upload ─────────── */
  const handleSave = useCallback(() => {
    const otherSide =
      activeSide === "A" ? sideBJsonRef.current : sideAJsonRef.current;
    canvas.saveDesign(otherSide);
  }, [activeSide, canvas]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Cart action ───────────────────────────────────────────────── */
  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct?.variantId || canvas.uploadState.status !== "success")
      return;
    const { result } = canvas.uploadState as Extract<
      typeof canvas.uploadState,
      { status: "success" }
    >;
    const attrs: { key: string; value: string }[] = [
      { key: "Design-Vorschau", value: result.sideA.previewUrl },
      { key: "_design_id", value: result.designId },
      { key: "_design_json", value: result.sideA.jsonUrl },
    ];
    if (result.sideB) {
      attrs.push({ key: "Design-Vorschau-B", value: result.sideB.previewUrl });
      attrs.push({ key: "_design_json_b", value: result.sideB.jsonUrl });
    }
    // Seite B als additionalLine → beides in einer Shopify-Mutation, ein Cart-Refresh
    const additionalLines =
      result.sideB && selectedProduct.sideBZusatzprodukt
        ? [
            {
              variantId: selectedProduct.sideBZusatzprodukt.variantId,
              quantity: 1,
              customAttributes: [
                { key: "_linkedTo", value: selectedProduct.variantId },
                { key: "_seite_b_aufpreis", value: "true" },
              ],
            },
          ]
        : undefined;

    await addItem(selectedProduct.variantId, 1, attrs, additionalLines);
  }, [addItem, selectedProduct, canvas.uploadState]);

  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="pb-24">
      {/* Minimal Editor-Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-medium text-muted uppercase tracking-[0.12em]">
            Design Editor
          </p>
          <h1 className="text-xl font-semibold text-primary dark:text-cream leading-tight">
            Gestalte dein Unikat
          </h1>
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded border border-stone-200/80 dark:border-zinc-700 text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-[11px] font-medium transition-colors duration-200 cursor-pointer"
        >
          <HelpCircle size={14} /> Bedienung
        </button>
      </div>

      {/* Desktop hint for small screens */}
      <div className="md:hidden mb-2 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 rounded-sm">
        <Monitor
          size={17}
          className="shrink-0 mt-0.5 text-amber-700 dark:text-amber-400"
        />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Desktop empfohlen
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
            Der Design Editor ist für größere Bildschirme optimiert. Für das
            beste Erlebnis empfehlen wir einen Desktop oder Laptop.
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
            textAlign={canvas.textAlign}
            isBold={canvas.isBold}
            isItalic={canvas.isItalic}
            isUnderline={canvas.isUnderline}
            fontFamily={canvas.fontFamily}
            fontSize={canvas.fontSize}
            applyStrokeWidth={canvas.applyStrokeWidth}
            applyFillColor={canvas.applyFillColor}
            applyTextAlign={canvas.applyTextAlign}
            applyBold={canvas.applyBold}
            applyItalic={canvas.applyItalic}
            applyUnderline={canvas.applyUnderline}
            applyFontFamily={canvas.applyFontFamily}
            applyFontSize={canvas.applyFontSize}
            bringForward={canvas.bringForward}
            sendBackward={canvas.sendBackward}
            duplicate={canvas.duplicate}
            deleteSelected={canvas.deleteSelected}
            onAddText={() => {
              canvas.addText();
              setActiveTab("text");
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start mt-4">
          {/* Left: Tool panel */}
          <div
            className="hidden lg:flex flex-col gap-4 w-52 shrink-0 relative z-10"
            data-no-deselect
          >
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
                    onCategoryChange={(cat) => {
                      setShapeCat(cat);
                      setShapePage(0);
                    }}
                    onPageChange={setShapePage}
                    addShapeFromCatalog={canvas.addShapeFromCatalog}
                  />
                )}
                {activeTab === "text" && (
                  <TextPanel
                    onAddText={() => {
                      canvas.addText();
                      setActiveTab("text");
                    }}
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
            {/* ── Side A / B Tabs ──────────────────────────────── */}
            <div className="flex items-center gap-2" data-no-deselect>
              {/* Seite A — immer sichtbar */}
              <button
                onClick={() => switchSide("A")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded border text-[11px] font-medium transition-all duration-200 cursor-pointer",
                  activeSide === "A"
                    ? "border-rust bg-rustLight dark:bg-rustLight/20 text-rust"
                    : "border-stone-200/80 dark:border-zinc-700 text-muted hover:text-primary hover:border-rust/40 dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800",
                )}
              >
                Seite A
              </button>

              {/* Seite B: erst "+" zum Aktivieren, dann Tab */}
              {hasSideB && !sideBEnabled && (
                <button
                  onClick={() => {
                    setSideBEnabled(true);
                    switchSide("B");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-dashed border-stone-300 dark:border-zinc-600 text-[11px] font-medium text-muted hover:text-rust hover:border-rust/60 transition-all duration-200 cursor-pointer"
                  title="Zweite Seite hinzufügen"
                >
                  <span className="text-base leading-none">+</span>
                  {selectedProduct!.sideBZusatzprodukt!.price}
                </button>
              )}
              {hasSideB && sideBEnabled && (
                <button
                  onClick={() => switchSide("B")}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded border text-[11px] font-medium transition-all duration-200 cursor-pointer",
                    activeSide === "B"
                      ? "border-rust bg-rustLight dark:bg-rustLight/20 text-rust"
                      : "border-stone-200/80 dark:border-zinc-700 text-muted hover:text-primary hover:border-rust/40 dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800",
                  )}
                >
                  Seite B
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-sm bg-rust/15 text-rust text-[9px] font-semibold">
                    +{selectedProduct!.sideBZusatzprodukt!.price}
                  </span>
                </button>
              )}

              {/* ── Farbauswahl (nur wenn farben im Produkt definiert) ── */}
              {selectedProduct && selectedProduct.farben.length > 0 && (
                <div
                  className="flex ml-auto items-center gap-2 flex-wrap"
                  data-no-deselect
                >
                  <span className="text-[10px] font-medium text-muted uppercase tracking-[0.1em]">
                    Farbe
                  </span>
                  {/* Grau ist immer als Vorschau-Standard wählbar */}
                  {(
                    [
                      "grau",
                      ...selectedProduct.farben
                        .map((f) => COLOR_MAP[f.toLowerCase()])
                        .filter((c): c is BarrelColor => !!c),
                    ] as BarrelColor[]
                  )
                    .filter((c, i, arr) => arr.indexOf(c) === i)
                    .map((c) => {
                      const meta = SWATCH_META[c];
                      const active = selectedColor === c;
                      return (
                        <button
                          key={c}
                          title={meta.label}
                          onClick={() => setSelectedColor(c)}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium transition-all duration-150 cursor-pointer",
                            active
                              ? "border-rust bg-rustLight dark:bg-rustLight/20 text-rust"
                              : "border-stone-200/80 dark:border-zinc-700 text-muted hover:text-primary dark:hover:text-cream hover:border-rust/40",
                          )}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border"
                            style={{
                              background: meta.bg,
                              borderColor: meta.border,
                            }}
                          />
                          {meta.label}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            <div
              ref={canvas.wrapperRef}
              className="w-full relative overflow-hidden rounded-sm bg-cream"
              style={{ height: svgH }}
            >
              {zoom.midPanning && (
                <div className="absolute inset-0 flex items-center justify-center cursor-move pointer-events-none z-50">
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
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    transform: activeSide === "B" ? "scaleX(-1)" : undefined,
                  }}
                >
                  <BarrelIllustration
                    showBackground={false}
                    showFloorShadow={false}
                    color={selectedColor}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: dispW,
                    height: dispH,
                    left: canvasLeft,
                    top: canvasTop,
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

            {/* ── Produktbeschreibung-Hinweis ──────────────────── */}
            {selectedProduct?.description && (
              <div className="flex items-start gap-2.5 p-3 rounded border border-amber-200/70 dark:border-amber-800/40 bg-amber-50/80 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p className="text-[12px] leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            )}

            <div className="lg:hidden" data-no-deselect>
              <MobileToolbar
                imageUploading={canvas.imageUploading}
                hasSelection={canvas.objectCount > 0}
                onAddText={() => {
                  canvas.addText();
                  setActiveTab("text");
                }}
                onUploadImage={() => canvas.fileInputRef.current?.click()}
                onDelete={canvas.deleteSelected}
                onDownload={canvas.downloadPNG}
              />
            </div>
          </div>

          {/* Right: Product + Save */}
          <aside
            className="w-full lg:w-60 xl:w-72 flex flex-col gap-4 relative z-10"
            data-no-deselect
          >
            <ProductPanel
              products={products}
              productsLoading={productsLoading}
              selectedProduct={selectedProduct}
              objectCount={canvas.objectCount}
              uploadState={canvas.uploadState}
              displayPrice={displayPrice}
              sideBEnabled={sideBEnabled}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                canvas.resetUploadState();
              }}
              onSave={handleSave}
              onResetUpload={canvas.resetUploadState}
              onAddToCart={handleAddToCart}
            />
            {IS_DEV && (
              <DevPanel
                canvasWidth={customWidth}
                fit={fitOverride}
                onCanvasWidthChange={setCustomWidth}
                onFitChange={(patch) =>
                  setFitOverride((prev) => ({ ...prev, ...patch }))
                }
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

      {/* ── Help Modal ──────────────────────────────────────────────── */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="relative w-full max-w-lg rounded bg-surface dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-700/60 shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            data-no-deselect
          >
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-3 right-3 text-muted hover:text-primary dark:hover:text-cream cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
            <h2 className="text-base font-semibold text-primary dark:text-cream mb-4">
              Bedienungsanleitung
            </h2>

            <div className="flex flex-col gap-4 text-[13px] text-stone dark:text-muted leading-relaxed">
              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Produkt wählen
                </h3>
                <p>
                  Wähle rechts im Panel das gewünschte Produkt aus. Der Canvas
                  passt sich automatisch an die Gravurfläche des Produkts an.
                </p>
              </section>

              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Text hinzufügen
                </h3>
                <p>
                  Klicke links auf den Tab{" "}
                  <strong className="text-primary dark:text-cream">Text</strong>{" "}
                  und dann auf <em>„Text hinzufügen"</em>. Der Text erscheint
                  mittig auf der Leinwand. Doppelklicke auf ihn, um ihn direkt
                  zu bearbeiten. Mit den Schriftart-Buttons kannst du die
                  Schrift wechseln.
                </p>
                <p className="mt-1">
                  Für{" "}
                  <strong className="text-primary dark:text-cream">
                    gebogenen Text
                  </strong>
                  : Klicke auf <em>„Gebogener Text"</em>, gib deinen Text ein,
                  stelle den Radius ein und füge ihn ein.
                </p>
              </section>

              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Formen hinzufügen
                </h3>
                <p>
                  Im Tab{" "}
                  <strong className="text-primary dark:text-cream">
                    Formen
                  </strong>{" "}
                  findest du vorgefertigte Symbole und Formen. Klicke auf ein
                  Symbol um es auf die Leinwand zu fügen.
                </p>
              </section>

              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Element bearbeiten
                </h3>
                <p>
                  Klicke auf ein Element auf der Leinwand, um es auszuwählen.
                  Die Toolbar oben zeigt dann alle verfügbaren Optionen:
                </p>
                <ul className="mt-1.5 flex flex-col gap-1 pl-3">
                  <li>
                    •{" "}
                    <strong className="text-primary dark:text-cream">
                      B / I / U
                    </strong>{" "}
                    — Fett, Kursiv, Unterstrichen (nur Text)
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-primary dark:text-cream">
                      Ausrichtung
                    </strong>{" "}
                    — Links / Mitte / Rechts (positioniert den Text auf der
                    Fläche)
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-primary dark:text-cream">
                      Kontur-Slider
                    </strong>{" "}
                    — Randstärke des Elements
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-primary dark:text-cream">
                      ↑ / ↓ Pfeile
                    </strong>{" "}
                    — Ebene nach vorne oder hinten
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-primary dark:text-cream">
                      Kopieren / Löschen
                    </strong>{" "}
                    — Element duplizieren oder entfernen
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Verschieben & Zoomen
                </h3>
                <p>
                  Nutze den{" "}
                  <strong className="text-primary dark:text-cream">Zoom</strong>{" "}
                  (+ / −) und den{" "}
                  <strong className="text-primary dark:text-cream">
                    Verschieben-Modus
                  </strong>{" "}
                  unterhalb der Leinwand, um genauer zu arbeiten. Mittlere
                  Maustaste gedrückt halten verschiebt ebenfalls die Ansicht.
                </p>
              </section>

              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Bild hochladen
                </h3>
                <p>
                  Im Tab{" "}
                  <strong className="text-primary dark:text-cream">Bild</strong>{" "}
                  kannst du eigene Bilder oder Logos hochladen. Diese werden auf
                  dem Canvas platziert und können skaliert und verschoben
                  werden.
                </p>
              </section>

              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Design speichern & bestellen
                </h3>
                <p>
                  Wenn du mit dem Design zufrieden bist, klicke rechts auf{" "}
                  <em>„Design speichern"</em>. Danach erscheint eine Vorschau
                  und du kannst das Produkt mit deinem Design in den Warenkorb
                  legen.
                </p>
                <p className="mt-1 text-amber-700 dark:text-amber-400">
                  Hinweis: Das Design wird exakt wie auf der Leinwand gelasert.
                  Farben werden nicht berücksichtigt — nur die Konturen und
                  Flächen zählen.
                </p>
              </section>

              <section>
                <h3 className="text-[11px] font-medium text-rust uppercase tracking-[0.08em] mb-1.5">
                  Tastenkürzel
                </h3>
                <ul className="flex flex-col gap-1 pl-3">
                  <li>
                    •{" "}
                    <strong className="text-primary dark:text-cream">
                      Entf / Backspace
                    </strong>{" "}
                    — Ausgewähltes Element löschen
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-primary dark:text-cream">
                      Klick auf leere Fläche
                    </strong>{" "}
                    — Auswahl aufheben
                  </li>
                </ul>
              </section>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-2.5 rounded bg-rust text-white text-sm font-medium hover:bg-rustMid transition-colors cursor-pointer"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
