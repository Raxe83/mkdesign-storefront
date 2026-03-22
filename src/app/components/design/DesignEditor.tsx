"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Circle,
  Diamond,
  Download,
  Hand,
  Hexagon,
  Loader2,
  Minus,
  Monitor,
  Square,
  Star,
  Triangle,
  Type,
} from "lucide-react";
import { cn } from "@/app/utils/utils";
import { useCart } from "@/app/context/CartContext";
import { getProducts } from "@/app/services/shopify";
import PageHeader from "@/app/components/PageHeader";
import { getPresetForTitle } from "./constants";
import {
  BarrelFull,
  BarrelNoLegs,
  BarrelSchale,
  BarrelSchaleXL,
  BarrelStehtisch,
} from "@/app/components/illustrations/FireBarrels";
import type { ComponentType } from "react";
import { useDesignCanvas } from "./hooks/useDesignCanvas";
import type { ProductOption, SidebarTab } from "./types";
import { ImagePanel } from "./panels/ImagePanel";
import { MobileToolbar } from "./panels/MobileToolbar";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ProductPanel } from "./panels/ProductPanel";
import { ShapesPanel } from "./panels/ShapesPanel";
import { TextPanel } from "./panels/TextPanel";
import { DevPanel } from "./panels/DevPanel";
import type { FitState } from "./panels/DevPanel";

const IS_DEV = process.env.NODE_ENV === "development";

interface BarrelFit {
  /** Canvas display width as fraction of SVG display width. */
  widthFrac: number;
  /** SVG display height / SVG display width (viewBox aspect ratio). */
  svgAspect: number;
  /** Canvas top edge as fraction of SVG display height (where to place the engraving zone). */
  topFrac: number;
  /** Native Fabric.js canvas height in pixels. */
  canvasH: number;
}

interface BarrelEntry {
  keywords: string[];
  Component: ComponentType<{
    showBackground?: boolean;
    showFloorShadow?: boolean;
  }>;
  fit: BarrelFit;
}

// Barrel geometry reference (viewBox 0 0 300 400):
//   Body path x: 58–242 at ring zone → bodyWidth ≈ 184/300 = 0.61
//   Top rim lid bottom: y ≈ 74  →  topFrac = 74/400 + gap ≈ 0.24
//
// DEV: Adjust widthFrac / topFrac to align canvas with the engraving zone of each variant.
const BARREL_ENTRIES: BarrelEntry[] = [
  {
    keywords: ["stehtisch", "tisch", "table", "platte"],
    Component: BarrelStehtisch,
    fit: {
      widthFrac: 0.53,
      svgAspect: 410 / 300,
      topFrac: 0.20,
      canvasH: 1240,
    },
  },
  {
    keywords: ["schale xl", "xl schale"],
    Component: BarrelSchaleXL,
    fit: { widthFrac: 0.53, svgAspect: 262 / 300, topFrac: 0.13, canvasH: 560 },
  },
  {
    keywords: ["schale", "feuerschale", "bowl"],
    Component: BarrelSchale,
    fit: { widthFrac: 0.38, svgAspect: 120 / 300, topFrac: 0.19, canvasH: 250 },
  },
];

const BARREL_DEFAULT: BarrelEntry = {
  keywords: [],
  Component: BarrelNoLegs,
  fit: { widthFrac: 0.53, svgAspect: 410 / 300, topFrac: 0.24, canvasH: 1150 },
};

function getBarrelEntry(title: string): BarrelEntry {
  const lower = title.toLowerCase();
  for (const entry of BARREL_ENTRIES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry;
  }
  return BARREL_DEFAULT;
}

export default function DesignEditor() {
  const { addItem } = useCart();

  /* ── Products ─────────────────────────────────────────────────── */
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      try {
        const raw = await getProducts(50, undefined, "CustomDesign");
        const mapped: ProductOption[] = raw.map((p) => {
          const variant = p.variants.edges[0]?.node ?? null;
          return {
            id: p.id,
            label: p.title,
            backgroundUrl: p.featuredImage?.url ?? null,
            variantId: variant?.id ?? null,
            price: variant
              ? `${parseFloat(variant.price.amount).toFixed(2)} ${variant.price.currencyCode}`
              : "",
            canvasPresetId: getPresetForTitle(p.title).id,
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

  /* ── Canvas preset (derived from selected product) ────────────── */
  const canvasPreset = useMemo(
    () => getPresetForTitle(selectedProduct?.label ?? ""),
    [selectedProduct],
  );

  /* ── Barrel entry + fit state (must be before canvas hook) ───────── */
  const { Component: BarrelIllustration, fit: defaultFit } = getBarrelEntry(
    selectedProduct?.label ?? "",
  );
  const [fitOverride, setFitOverride] = useState<FitState>(defaultFit);
  useEffect(() => {
    setFitOverride(defaultFit);
  }, [selectedProduct?.id]);
  const fit = IS_DEV ? fitOverride : defaultFit;

  /* ── Custom canvas width; height comes from fit.canvasH ───────── */
  const [customWidth, setCustomWidth] = useState(canvasPreset.width);
  useEffect(() => {
    setCustomWidth(canvasPreset.width);
  }, [canvasPreset.id]);

  const overridePreset = useMemo(
    () => ({ ...canvasPreset, width: customWidth, height: fit.canvasH }),
    [canvasPreset, customWidth, fit.canvasH],
  );

  /* ── Canvas hook ──────────────────────────────────────────────── */
  const canvas = useDesignCanvas(selectedProduct, overridePreset);

  /* ── Sidebar UI state ─────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<SidebarTab>("shapes");
  const [shapeCat, setShapeCat] = useState("Alle");
  const [shapePage, setShapePage] = useState(0);

  /* ── Cart action ──────────────────────────────────────────────── */
  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct?.variantId || canvas.uploadState.status !== "success")
      return;
    const { result } = canvas.uploadState as Extract<
      typeof canvas.uploadState,
      { status: "success" }
    >;
    await addItem(selectedProduct.variantId, 1, [
      { key: "Design-Vorschau", value: result.previewUrl },
      { key: "_design_id", value: result.designId },
      { key: "_design_json", value: result.jsonUrl },
    ]);
  }, [addItem, selectedProduct?.variantId, canvas.uploadState]);

  /* ── Mobile shape actions ─────────────────────────────────────── */
  const mobileShapes = [
    {
      icon: <Square size={16} />,
      label: "Rect",
      action: () => canvas.addShapeFromCatalog({ k: "rect", w: 140, h: 90 }),
    },
    {
      icon: <Circle size={16} />,
      label: "Kreis",
      action: () => canvas.addShapeFromCatalog({ k: "circle", r: 55 }),
    },
    {
      icon: <Triangle size={16} />,
      label: "Dreieck",
      action: () =>
        canvas.addShapeFromCatalog({ k: "triangle", w: 130, h: 110 }),
    },
    {
      icon: <Minus size={16} />,
      label: "Linie",
      action: () => canvas.addShapeFromCatalog({ k: "line" }),
    },
    {
      icon: <Star size={16} />,
      label: "Stern",
      action: () =>
        canvas.addShapeFromCatalog({
          k: "poly",
          pts: [
            { x: 0, y: -62 },
            { x: 14, y: -22 },
            { x: 59, y: -19 },
            { x: 23, y: 9 },
            { x: 36, y: 54 },
            { x: 0, y: 31 },
            { x: -36, y: 54 },
            { x: -23, y: 9 },
            { x: -59, y: -19 },
            { x: -14, y: -22 },
          ],
        }),
    },
    {
      icon: <Hexagon size={16} />,
      label: "Sechseck",
      action: () =>
        canvas.addShapeFromCatalog({
          k: "poly",
          pts: [
            { x: 60, y: 0 },
            { x: 30, y: 52 },
            { x: -30, y: 52 },
            { x: -60, y: 0 },
            { x: -30, y: -52 },
            { x: 30, y: -52 },
          ],
        }),
    },
    {
      icon: <Diamond size={16} />,
      label: "Raute",
      action: () =>
        canvas.addShapeFromCatalog({
          k: "poly",
          pts: [
            { x: 0, y: -68 },
            { x: 54, y: 0 },
            { x: 0, y: 68 },
            { x: -54, y: 0 },
          ],
        }),
    },
    {
      icon: <Type size={16} />,
      label: "Text",
      action: () => {
        canvas.addText();
        setActiveTab("text");
      },
    },
  ];

  /* ── Tab labels ───────────────────────────────────────────────── */
  const TAB_LABELS: Record<SidebarTab, string> = {
    shapes: "Formen",
    text: "Text",
    image: "Bild",
  };

  /* ── Barrel layout geometry ───────────────────────────────────── */
  const svgW = canvas.wrapperWidth || canvas.canvasWidth;
  const svgH = svgW * fit.svgAspect;
  const dispW = fit.widthFrac * svgW;
  const dispH = dispW * (canvas.canvasHeight / canvas.canvasWidth);
  const dispScale = dispW / canvas.canvasWidth;
  const canvasTop = fit.topFrac * svgH;
  const canvasLeft = (svgW - dispW) / 2;

  /* ── CSS zoom/pan state (SVG + canvas transform together) ──────── */
  const [cssZoom, setCssZoom] = useState(1);
  const [cssTx, setCssTx] = useState(0);
  const [cssTy, setCssTy] = useState(0);
  const [panMode, setPanMode] = useState(false);
  // Refs so event handlers always read fresh values (no stale closures)
  const cssZoomRef = useRef(1);
  const cssTxRef = useRef(0);
  const cssTyRef = useRef(0);
  const panModeRef = useRef(false);
  cssZoomRef.current = cssZoom;
  cssTxRef.current = cssTx;
  cssTyRef.current = cssTy;
  panModeRef.current = panMode;

  // Reset zoom + pan mode when product changes
  useEffect(() => {
    setCssZoom(1);
    setCssTx(0);
    setCssTy(0);
    setPanMode(false);
  }, [selectedProduct?.id]);

  // Wheel → zoom to cursor (non-passive so preventDefault works)
  useEffect(() => {
    const wrapper = canvas.wrapperRef.current;
    if (!wrapper) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = wrapper.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const zoom = cssZoomRef.current;
      const focalX = (px - cssTxRef.current) / zoom;
      const focalY = (py - cssTyRef.current) / zoom;
      const factor = 0.999 ** e.deltaY;
      const nz = Math.max(0.25, Math.min(8, zoom * factor));
      const nx = px - focalX * nz;
      const ny = py - focalY * nz;
      cssZoomRef.current = nz;
      cssTxRef.current = nx;
      cssTyRef.current = ny;
      setCssZoom(nz);
      setCssTx(nx);
      setCssTy(ny);
    };
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [canvas.wrapperRef]);

  // Middle-mouse pan indicator state
  const [midPanning, setMidPanning] = useState(false);

  // Alt + drag OR panMode drag OR middle-mouse drag → pan
  useEffect(() => {
    const wrapper = canvas.wrapperRef.current;
    if (!wrapper) return;
    let panning = false,
      lx = 0,
      ly = 0;
    const onDown = (e: MouseEvent) => {
      const isMid = e.button === 1;
      if (!e.altKey && !panModeRef.current && !isMid) return;
      if (isMid) e.preventDefault(); // suppress browser autoscroll cursor
      panning = true;
      lx = e.clientX;
      ly = e.clientY;
      wrapper.style.cursor = "grabbing";
      if (isMid) setMidPanning(true);
      e.preventDefault();
      e.stopPropagation();
    };
    const onMove = (e: MouseEvent) => {
      if (!panning) return;
      const nx = cssTxRef.current + e.clientX - lx;
      const ny = cssTyRef.current + e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      cssTxRef.current = nx;
      cssTyRef.current = ny;
      setCssTx(nx);
      setCssTy(ny);
    };
    const onUp = (e: MouseEvent) => {
      if (!panning) return;
      panning = false;
      if (e.button === 1) setMidPanning(false);
      wrapper.style.cursor = panModeRef.current ? "grab" : "";
    };
    wrapper.addEventListener("mousedown", onDown, { capture: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      wrapper.removeEventListener("mousedown", onDown, { capture: true });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [canvas.wrapperRef]);

  return (
    <div className="pb-24">
      <PageHeader
        title="Gestalte dein Unikat"
        eyebrow="Design Editor"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Design Editor" },
        ]}
      />

      {/* ══ Mobile — Editor nicht verfügbar ══ */}
      <div className="md:hidden flex flex-col items-center justify-center py-20 text-center gap-5">
        <div className="w-16 h-16 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Monitor size={28} className="text-muted" />
        </div>
        <div>
          <p className="text-sm font-medium text-primary mb-1">
            Editor nur auf Desktop verfügbar
          </p>
          <p className="text-xs text-muted max-w-xs">
            Der Design-Editor benötigt einen größeren Bildschirm. Bitte öffne
            diese Seite auf einem Tablet oder Computer.
          </p>
        </div>
      </div>

      {/* ══ Desktop-Editor ══ */}
      <div className="hidden md:block">
        {/* ── Properties bar ── */}
        <div className="mt-4">
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

        <div className="flex flex-col xl:flex-row gap-6 items-start mt-4">
          {/* ══ Left: Tool panel (desktop only) ══ */}
          <div className="hidden xl:flex flex-col gap-4 w-56 shrink-0 relative z-10">
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
                    isTextSelected={canvas.isTextSelected}
                    fontFamily={canvas.fontFamily}
                    fontSize={canvas.fontSize}
                    onAddText={() => {
                      canvas.addText();
                      setActiveTab("text");
                    }}
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
            {/* Outer wrapper: clips overflow, drives wrapperWidth via ResizeObserver */}
            <div
              ref={canvas.wrapperRef}
              className="w-full relative overflow-hidden rounded-sm bg-cream"
              style={{ height: svgH }}
            >
              {/* Middle-mouse pan indicator */}
              {midPanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <div className="flex items-center gap-2 bg-black/60 text-white/90 text-xs px-3 py-1.5 rounded-sm backdrop-blur-sm select-none">
                    <Hand size={13} />
                    Verschieben
                  </div>
                </div>
              )}
              {/* ── Single CSS-transform container: SVG + canvas move together ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translate(${cssTx}px, ${cssTy}px) scale(${cssZoom})`,
                  transformOrigin: "0 0",
                  cursor: panMode ? "grab" : "default",
                }}
              >
                {/* Barrel illustration fills this container */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >
                  <BarrelIllustration
                    showBackground={false}
                    showFloorShadow={false}
                  />
                </div>

                {/* Canvas area: positioned at barrel body, dashed outline scales with SVG */}
                <div
                  style={{
                    position: "absolute",
                    width: dispW,
                    height: dispH,
                    left: canvasLeft,
                    top: canvasTop,
                    zIndex: 1,
                    outline: "1.5px dashed rgba(255,255,255,0.45)",
                    // In pan mode the canvas should not capture mouse events so dragging works everywhere
                    pointerEvents: panMode ? "none" : "auto",
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
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* Zoom controls */}
                {/* Pan-mode toggle */}
                <button
                  onClick={() => setPanMode((v) => !v)}
                  title={
                    panMode
                      ? "Verschieben deaktivieren"
                      : "Verschieben aktivieren"
                  }
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[11px] font-medium transition-colors duration-200 cursor-pointer",
                    panMode
                      ? "border-rust bg-rustLight/40 text-rust dark:bg-rustLight/10"
                      : "border-stone-200/80 dark:border-zinc-700 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800",
                  )}
                >
                  <Hand size={13} />
                  Verschieben
                </button>

                {/* Zoom controls */}
                <div className="flex items-center rounded border border-stone-200/80 dark:border-zinc-700 overflow-hidden">
                  <button
                    onClick={() => {
                      const nz = Math.max(0.25, cssZoom / 1.25);
                      const cx = svgW / 2,
                        cy = svgH / 2;
                      const fx = (cx - cssTx) / cssZoom,
                        fy = (cy - cssTy) / cssZoom;
                      setCssZoom(nz);
                      setCssTx(cx - fx * nz);
                      setCssTy(cy - fy * nz);
                    }}
                    title="Rauszoomen"
                    className="px-2.5 py-1.5 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-sm leading-none transition-colors duration-200 cursor-pointer"
                  >
                    −
                  </button>
                  <button
                    onClick={() => {
                      setCssZoom(1);
                      setCssTx(0);
                      setCssTy(0);
                    }}
                    title="Zoom zurücksetzen"
                    className="px-2 py-1.5 text-[11px] font-medium text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 border-x border-stone-200/80 dark:border-zinc-700 tabular-nums w-11 text-center transition-colors duration-200 cursor-pointer"
                  >
                    {Math.round(cssZoom * 100)}%
                  </button>
                  <button
                    onClick={() => {
                      const nz = Math.min(8, cssZoom * 1.25);
                      const cx = svgW / 2,
                        cy = svgH / 2;
                      const fx = (cx - cssTx) / cssZoom,
                        fy = (cy - cssTy) / cssZoom;
                      setCssZoom(nz);
                      setCssTx(cx - fx * nz);
                      setCssTy(cy - fy * nz);
                    }}
                    title="Reinzoomen"
                    className="px-2.5 py-1.5 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-sm leading-none transition-colors duration-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={canvas.downloadPNG}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-200/80 dark:border-zinc-700 text-stone dark:text-muted hover:text-primary dark:hover:text-cream hover:bg-stone-50 dark:hover:bg-zinc-800 text-[11px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer shrink-0"
                >
                  <Download size={12} /> PNG herunterladen
                </button>
              </div>
            )}

            {/* Mobile toolbar (md..xl only — above xl the left panel takes over) */}
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
          <aside className="w-full xl:w-72 flex flex-col gap-4 relative z-10">
            <ProductPanel
              products={products}
              productsLoading={productsLoading}
              selectedProduct={selectedProduct}
              objectCount={canvas.objectCount}
              uploadState={canvas.uploadState}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                canvas.resetUploadState();
              }}
              onSave={canvas.saveDesign}
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

        {/* Hidden file input */}
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
