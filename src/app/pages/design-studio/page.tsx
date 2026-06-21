"use client";

import { useState, useMemo } from "react";
import { useDesignCanvas } from "@/app/components/design/hooks/useDesignCanvas";
import { useEditorZoomPan } from "@/app/components/design/hooks/useEditorZoomPan";
import { getBarrelEntry, type BarrelColor } from "@/app/components/design/barrel";
import { getPresetForTitle } from "@/app/components/design/constants";
import type { ProductOption } from "@/app/components/design/types";
import type { FitState } from "@/app/components/design/panels/DevPanel";
import { EditorTopBar } from "./components/EditorTopBar";
import { EditorIconRail } from "./components/EditorIconRail";
import { EditorLeftPanel } from "./components/EditorLeftPanel";
import { EditorCanvas } from "./components/EditorCanvas";
import { EditorRightPanel } from "./components/EditorRightPanel";
import { EditorStatusBar } from "./components/EditorStatusBar";

export type ActiveTool = "select" | "move" | "text" | "shapes" | "images" | "assets";
export type RightTab = "design" | "styles" | "assets";
export { type BarrelColor };
export type { FitState };

const IS_DEV = process.env.NODE_ENV === "development";

const DEMO_PRODUCT: ProductOption = {
  id: "demo-feuertonne",
  label: "Feuertonne",
  description: "",
  backgroundUrl: null,
  variantId: null,
  price: "89.00 EUR",
  canvasPresetId: "square-500",
  sideBZusatzprodukt: null,
  farben: ["schwarz", "silber", "gold"],
  zusatzoptionen: null,
  category: null,
};

export default function DesignStudioPage() {
  const [activeTool, setActiveTool]     = useState<ActiveTool>("select");
  const [selectedColor, setSelectedColor] = useState<BarrelColor>("grau");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightTab, setRightTab]         = useState<RightTab>("design");

  const canvasPreset = useMemo(() => getPresetForTitle(DEMO_PRODUCT.label), []);
  const { Component: BarrelIllustration, fit: defaultFit } = useMemo(
    () => getBarrelEntry(DEMO_PRODUCT.label),
    [],
  );

  // Dev-only overrides (same pattern as DesignEditor)
  const [fitOverride, setFitOverride] = useState<FitState>(defaultFit);
  const [customWidth, setCustomWidth] = useState(canvasPreset.width);

  const activeFit = IS_DEV ? fitOverride : defaultFit;
  const overridePreset = useMemo(
    () => ({ ...canvasPreset, width: customWidth, height: activeFit.canvasH }),
    [canvasPreset, customWidth, activeFit.canvasH],
  );

  const canvas = useDesignCanvas(DEMO_PRODUCT, overridePreset);

  // Barrel geometry with active fit
  const svgW     = canvas.wrapperWidth || canvas.canvasWidth;
  const svgH     = svgW * activeFit.svgAspect;
  const dispW    = activeFit.widthFrac * svgW;
  const dispH    = dispW * (canvas.canvasHeight / canvas.canvasWidth);
  const dispScale = dispW / canvas.canvasWidth;
  const canvasTop  = activeFit.topFrac * svgH;
  const canvasLeft = (svgW - dispW) / 2;

  const zoomPan = useEditorZoomPan(canvas.wrapperRef, svgW, svgH, DEMO_PRODUCT.id);

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
        productName={DEMO_PRODUCT.label}
        zoom={Math.round(zoomPan.cssZoom * 100)}
        onZoomIn={zoomPan.zoomIn}
        onZoomOut={zoomPan.zoomOut}
        onZoomReset={zoomPan.zoomReset}
        onUndo={canvas.undo}
        onRedo={canvas.redo}
        canUndo={canvas.canUndo}
        canRedo={canvas.canRedo}
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
          tab={rightTab}
          onTabChange={setRightTab}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
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
    </div>
  );
}
