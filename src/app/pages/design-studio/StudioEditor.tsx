"use client";

import { useState, useMemo, useCallback } from "react";
import { useCart } from "@/app/context/CartContext";
import { useDesignCanvas } from "@/app/components/design/hooks/useDesignCanvas";
import { useDesignSaveToCart } from "@/app/components/design/hooks/useDesignSaveToCart";
import { useEditorZoomPan } from "@/app/components/design/hooks/useEditorZoomPan";
import { getBarrelEntry, type BarrelColor } from "@/app/components/design/barrel";
import { getPresetForTitle } from "@/app/components/design/constants";
import type { ProductOption } from "@/app/components/design/types";
import type { FitState } from "@/app/components/design/panels/DevPanel";
import type { ZusatzproduktOption } from "@/app/types/shopify";
import { calculateDisplayPrice } from "@/app/utils/calculateDisplayPrice";
import { EditorTopBar } from "./components/EditorTopBar";
import { EditorIconRail } from "./components/EditorIconRail";
import { EditorLeftPanel } from "./components/EditorLeftPanel";
import { EditorCanvas } from "./components/EditorCanvas";
import { EditorRightPanel } from "./components/EditorRightPanel";
import { EditorStatusBar } from "./components/EditorStatusBar";
import { SaveStatusOverlay } from "./components/SaveStatusOverlay";

export type ActiveTool = "select" | "move" | "text" | "shapes" | "images" | "assets";
export { type BarrelColor };
export type { FitState };

const IS_DEV = process.env.NODE_ENV === "development";

/** Lesbare Lackierungs-Labels für das Warenkorb-Detail. */
const FINISH_LABELS: Record<BarrelColor, string> = {
  grau:    "Unlackiert",
  schwarz: "Schwarz",
  silber:  "Silber",
  gold:    "Gold",
};

/** Zusatzprodukte mit diesen Schlagworten gehören zur "Seite B"-Logik des alten
 *  Editors (zweite Design-Seite) — das Studio unterstützt aktuell nur eine Seite,
 *  daher werden sie aus der normalen Zusatzprodukte-Auswahl ausgeblendet. */
const SEITE_B_KEYWORDS = ["zweite seite", "seite b", "seite-b", "2. seite", "rückseite", "rueckseite", "beidseitig"];
function isSeiteBProduct(title: string): boolean {
  const lower = title.toLowerCase();
  return SEITE_B_KEYWORDS.some((kw) => lower.includes(kw));
}

interface Props {
  product: ProductOption;
  onBack: () => void;
}

export default function StudioEditor({ product, onBack }: Props) {
  const [activeTool, setActiveTool]       = useState<ActiveTool>("select");
  const [selectedColor, setSelectedColor] = useState<BarrelColor>("grau");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<ZusatzproduktOption[]>([]);
  const { itemCount: cartItemCount } = useCart();

  const canvasPreset = useMemo(() => getPresetForTitle(product.label), [product.label]);
  const { Component: BarrelIllustration, fit: defaultFit } = useMemo(
    () => getBarrelEntry(product.label),
    [product.label],
  );

  // Dev-only overrides (same pattern as DesignEditor)
  const [fitOverride, setFitOverride] = useState<FitState>(defaultFit);
  const [customWidth, setCustomWidth] = useState(canvasPreset.width);

  const activeFit = IS_DEV ? fitOverride : defaultFit;
  const overridePreset = useMemo(
    () => ({ ...canvasPreset, width: customWidth, height: activeFit.canvasH }),
    [canvasPreset, customWidth, activeFit.canvasH],
  );

  const canvas = useDesignCanvas(product, overridePreset);

  // Zusatzprodukte des Produkts — "Seite B"-Produkte ausgeblendet (Studio ist einseitig)
  const zusatzprodukte = useMemo(
    () => (product.zusatzoptionen?.zusatzprodukte ?? []).filter((p) => !isSeiteBProduct(p.title)),
    [product.zusatzoptionen],
  );

  const toggleAddon = useCallback((opt: ZusatzproduktOption) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === opt.id) ? prev.filter((a) => a.id !== opt.id) : [...prev, opt],
    );
  }, []);

  // Preis: Grundpreis + Summe der ausgewählten Zusatzprodukte
  const [baseAmount, baseCurrency] = product.price.split(" ");
  const displayPrice = useMemo(
    () => calculateDisplayPrice(baseAmount || "0", baseCurrency || "EUR", selectedAddons),
    [baseAmount, baseCurrency, selectedAddons],
  );

  // Save → Warenkorb (Ein-Klick)
  const { state: saveState, saveAndAddToCart, reset: resetSave } = useDesignSaveToCart(
    canvas,
    product,
    { finishLabel: FINISH_LABELS[selectedColor], selectedAddons },
  );
  const saving = saveState.status === "saving";

  // Barrel geometry with active fit
  const svgW     = canvas.wrapperWidth || canvas.canvasWidth;
  const svgH     = svgW * activeFit.svgAspect;
  const dispW    = activeFit.widthFrac * svgW;
  const dispH    = dispW * (canvas.canvasHeight / canvas.canvasWidth);
  const dispScale = dispW / canvas.canvasWidth;
  const canvasTop  = activeFit.topFrac * svgH;
  const canvasLeft = (svgW - dispW) / 2;

  const zoomPan = useEditorZoomPan(canvas.wrapperRef, svgW, svgH, product.id);

  function handleToolChange(tool: ActiveTool) {
    setActiveTool(tool);
    setLeftPanelOpen(true);
    zoomPan.setPanMode(tool === "move");
  }

  return (
    <div
      className="dark fixed inset-0 z-[9999] flex flex-col overflow-hidden font-body"
      style={{ background: "#0f1117" }}
    >
      <EditorTopBar
        productName={product.label}
        zoom={Math.round(zoomPan.cssZoom * 100)}
        onZoomIn={zoomPan.zoomIn}
        onZoomOut={zoomPan.zoomOut}
        onZoomReset={zoomPan.zoomReset}
        onUndo={canvas.undo}
        onRedo={canvas.redo}
        canUndo={canvas.canUndo}
        canRedo={canvas.canRedo}
        onSave={saveAndAddToCart}
        saving={saving}
        onBack={onBack}
        cartItemCount={cartItemCount}
      />

      <div className="flex flex-1 min-h-0">
        <EditorIconRail
          activeTool={activeTool}
          onToolChange={handleToolChange}
          layersOpen={leftPanelOpen}
          onToggleLayers={() => setLeftPanelOpen((v) => !v)}
        />

        {leftPanelOpen && (
          <EditorLeftPanel
            activeTool={activeTool}
            canvas={canvas}
            onClose={() => setLeftPanelOpen(false)}
          />
        )}

        <EditorCanvas
          wrapperRef={canvas.wrapperRef}
          canvasElRef={canvas.canvasElRef}
          svgH={svgH}
          dispW={dispW}
          dispH={dispH}
          dispScale={dispScale}
          canvasTop={canvasTop}
          canvasLeft={canvasLeft}
          canvasWidth={canvas.canvasWidth}
          canvasHeight={canvas.canvasHeight}
          canvasReady={canvas.canvasReady}
          zoomPan={zoomPan}
          BarrelIllustration={BarrelIllustration}
          selectedColor={selectedColor}
          canvas={canvas}
        />

        <EditorRightPanel
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          onSave={saveAndAddToCart}
          saving={saving}
          displayPrice={displayPrice}
          zusatzprodukte={zusatzprodukte}
          selectedAddons={selectedAddons}
          onToggleAddon={toggleAddon}
          devProps={IS_DEV ? {
            canvasWidth: customWidth,
            fit: fitOverride,
            onCanvasWidthChange: setCustomWidth,
            onFitChange: (patch) => setFitOverride((prev) => ({ ...prev, ...patch })),
          } : undefined}
        />
      </div>

      <EditorStatusBar />

      <input
        ref={canvas.fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={canvas.handleImageUpload}
      />

      {/* Save → Warenkorb Status (Upload/Erfolg/Fehler) */}
      <SaveStatusOverlay
        uploadStep={canvas.uploadState.status === "uploading" ? canvas.uploadState.step : null}
        state={saveState}
        productName={product.label}
        onClose={resetSave}
      />
    </div>
  );
}
