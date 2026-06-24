import type { ComponentType, RefObject } from "react";
import { Hand, Loader2, Download, Minus, Plus, RotateCcw } from "lucide-react";
import type { BarrelColor } from "@/app/components/design/barrel";
import type { useEditorZoomPan } from "@/app/components/design/hooks/useEditorZoomPan";
import type { useDesignCanvas } from "@/app/components/design/hooks/useDesignCanvas";
import { PropertiesPanel } from "@/app/components/design/panels/PropertiesPanel";

interface Props {
  wrapperRef: RefObject<HTMLDivElement | null>;
  canvasElRef: RefObject<HTMLCanvasElement | null>;
  svgH: number;
  dispW: number;
  dispH: number;
  dispScale: number;
  canvasTop: number;
  canvasLeft: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasReady: boolean;
  zoomPan: ReturnType<typeof useEditorZoomPan>;
  BarrelIllustration: ComponentType<{ showBackground?: boolean; showFloorShadow?: boolean; color?: BarrelColor }>;
  selectedColor: BarrelColor;
  canvas: ReturnType<typeof useDesignCanvas>;
}

export function EditorCanvas({
  wrapperRef, canvasElRef,
  svgH, dispW, dispH, dispScale, canvasTop, canvasLeft,
  canvasWidth, canvasHeight, canvasReady,
  zoomPan, BarrelIllustration, selectedColor, canvas,
}: Props) {
  return (
    <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Properties toolbar */}
      <div
        className="relative z-10 shrink-0 px-2 py-1.5"
        style={{ background: "#111318", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        data-no-deselect
      >
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
          onAddText={canvas.addText}
        />
      </div>

      {/* Canvas viewport */}
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden p-8 relative z-10">
        <div
          ref={wrapperRef}
          className="relative overflow-hidden"
          style={{ width: "100%", height: svgH }}
        >
          {zoomPan.midPanning && (
            <div className="absolute inset-0 flex items-center justify-center cursor-move pointer-events-none z-50">
              <div className="flex items-center gap-2 bg-black/60 text-white/90 text-xs px-3 py-1.5 rounded-sm backdrop-blur-sm select-none">
                <Hand size={13} /> Verschieben
              </div>
            </div>
          )}

          {/* Zoom/pan transform layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${zoomPan.cssTx}px, ${zoomPan.cssTy}px) scale(${zoomPan.cssZoom})`,
              transformOrigin: "0 0",
              cursor: zoomPan.panMode ? "grab" : "default",
            }}
          >
            {/* Barrel illustration */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <BarrelIllustration
                showBackground={false}
                showFloorShadow={false}
                color={selectedColor}
              />
            </div>

            {/* Design canvas overlay */}
            <div
              style={{
                position: "absolute",
                width: dispW,
                height: dispH,
                left: canvasLeft,
                top: canvasTop,
                zIndex: 1,
                outline: "1.5px dashed rgba(255,255,255,0.45)",
                pointerEvents: zoomPan.panMode ? "none" : "auto",
              }}
            >
              {!canvasReady && (
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
                  width: canvasWidth,
                  height: canvasHeight,
                  display: canvasReady ? "block" : "none",
                  position: "absolute",
                  inset: 0,
                }}
              >
                <canvas ref={canvasElRef} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Glow-up Canvas Controls ── */}
        {canvasReady && (
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center"
            data-no-deselect
          >
            <StudioControls
              cssZoom={zoomPan.cssZoom}
              panMode={zoomPan.panMode}
              onZoomIn={zoomPan.zoomIn}
              onZoomOut={zoomPan.zoomOut}
              onZoomReset={zoomPan.zoomReset}
              onTogglePan={() => zoomPan.setPanMode((v) => !v)}
              onDownload={canvas.downloadPNG}
            />
          </div>
        )}
      </div>
    </main>
  );
}

/* ── Styled controls pill ─────────────────────────────────────────────── */

interface ControlsProps {
  cssZoom: number;
  panMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onTogglePan: () => void;
  onDownload: () => void;
}

function StudioControls({ cssZoom, panMode, onZoomIn, onZoomOut, onZoomReset, onTogglePan, onDownload }: ControlsProps) {
  const pillStyle: React.CSSProperties = {
    background: "rgba(8, 10, 16, 0.82)",
    border: "1px solid rgba(255,255,255,0.09)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: 999,
    boxShadow: panMode
      ? "0 4px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 22px rgba(184,92,42,0.22)"
      : "0 4px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
    transition: "box-shadow 0.25s ease",
  };

  const divider = (
    <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
  );

  return (
    <div className="flex items-center px-1 gap-0" style={pillStyle}>
      {/* Pan toggle */}
      <CtrlBtn
        onClick={onTogglePan}
        title={panMode ? "Verschieben deaktivieren" : "Verschieben aktivieren"}
        active={panMode}
      >
        <Hand size={13} />
        <span className="text-[11px] font-medium">Verschieben</span>
      </CtrlBtn>

      {divider}

      {/* Zoom group */}
      <CtrlBtn onClick={onZoomOut} title="Rauszoomen"><Minus size={13} /></CtrlBtn>

      <button
        onClick={onZoomReset}
        title="Zoom zurücksetzen (100%)"
        className="flex items-center justify-center h-8 cursor-pointer transition-colors tabular-nums select-none"
        style={{
          minWidth: 44,
          fontSize: 11,
          fontWeight: 500,
          color: "rgba(255,255,255,0.5)",
          padding: "0 6px",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
      >
        {Math.round(cssZoom * 100)}%
      </button>

      <CtrlBtn onClick={onZoomIn} title="Reinzoomen"><Plus size={13} /></CtrlBtn>

      {divider}

      {/* Fit */}
      <CtrlBtn onClick={onZoomReset} title="Ansicht zurücksetzen">
        <RotateCcw size={12} />
      </CtrlBtn>

      {divider}

      {/* Download */}
      <CtrlBtn onClick={onDownload} title="Als PNG herunterladen">
        <Download size={13} />
        <span className="text-[11px] font-medium">PNG</span>
      </CtrlBtn>
    </div>
  );
}

function CtrlBtn({
  onClick, title, active = false, children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1.5 h-8 px-3 rounded-full cursor-pointer transition-all duration-150"
      style={{ color: active ? "var(--color-rust)" : "rgba(255,255,255,0.45)" }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.85)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "transparent";
        if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.45)";
      }}
    >
      {children}
    </button>
  );
}
