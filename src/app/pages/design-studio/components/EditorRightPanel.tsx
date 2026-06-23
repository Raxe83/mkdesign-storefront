import { ShoppingCart, CheckCircle2, Loader2 } from "lucide-react";
import type { BarrelColor } from "@/app/components/design/barrel";
import { DevPanel } from "@/app/components/design/panels/DevPanel";
import type { FitState } from "@/app/components/design/panels/DevPanel";

interface DevProps {
  canvasWidth: number;
  fit: FitState;
  onCanvasWidthChange: (v: number) => void;
  onFitChange: (patch: Partial<FitState>) => void;
}

interface Props {
  selectedColor: BarrelColor;
  onColorChange: (c: BarrelColor) => void;
  onSave: () => void;
  saving: boolean;
  devProps?: DevProps;
}

const COLORS: { id: BarrelColor; label: string; swatch: string }[] = [
  { id: "grau",    label: "Unlackiert", swatch: "#888886" },
  { id: "schwarz", label: "Schwarz",    swatch: "#242422" },
  { id: "silber",  label: "Silber",     swatch: "#c0c0be" },
  { id: "gold",    label: "Gold",       swatch: "#c8a020" },
];

export function EditorRightPanel({ selectedColor, onColorChange, onSave, saving, devProps }: Props) {
  return (
    <aside
      className="flex flex-col w-[240px] xl:w-[260px] shrink-0"
      style={{ background: "#111318", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Header */}
      <div
        className="shrink-0 px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[11px] font-medium tracking-[0.05em] uppercase" style={{ color: "var(--color-cream)" }}>
          Design
        </span>
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        <DesignTab selectedColor={selectedColor} onColorChange={onColorChange} onSave={onSave} saving={saving} />
      </div>

      {/* Dev panel — only rendered when devProps is passed (IS_DEV) */}
      {devProps && (
        <div
          className="shrink-0 p-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <DevPanel
            canvasWidth={devProps.canvasWidth}
            fit={devProps.fit}
            onCanvasWidthChange={devProps.onCanvasWidthChange}
            onFitChange={devProps.onFitChange}
          />
        </div>
      )}
    </aside>
  );
}

function DesignTab({ selectedColor, onColorChange, onSave, saving }: Pick<Props, "selectedColor" | "onColorChange" | "onSave" | "saving">) {
  return (
    <>
      {/* Configuration */}
      <section>
        <h3 className="text-[13px] font-semibold text-white/80 mb-3">Configuration</h3>

        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-semibold tracking-[0.14em] uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}>
            Finish / Lackierung
          </span>

          <div className="grid grid-cols-2 gap-1.5">
            {COLORS.map((c) => {
              const active = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onColorChange(c.id)}
                  className="flex items-center gap-1.5 px-2 py-2 rounded text-[11px] font-medium cursor-pointer transition-all"
                  style={{
                    background: active ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                    border: active ? "1px solid var(--color-rust)" : "1px solid rgba(255,255,255,0.08)",
                    color: active ? "var(--color-cream)" : "rgba(255,255,255,0.45)",
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border"
                    style={{
                      background: c.swatch,
                      borderColor: active ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
                    }}
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Design Review */}
      <section
        className="rounded-lg p-3 flex flex-col gap-2"
        style={{ background: "rgba(200,154,60,0.1)", border: "1px solid rgba(200,154,60,0.25)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--color-gold)" }} />
          <span className="text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--color-gold)" }}>
            Design Review
          </span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-gold)" }} />
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Ready for production export. All assets are linked.
          </p>
        </div>
      </section>

      {/* Save → Warenkorb CTA */}
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: "var(--color-rust)", color: "white" }}
        onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "var(--color-rust-mid)"; }}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--color-rust)")}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
        {saving ? "Speichert…" : "Speichern & in den Warenkorb"}
      </button>

      {/* Properties */}
      <section className="flex flex-col gap-2">
        <span className="text-[9px] font-semibold tracking-[0.14em] uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}>
          Eigenschaften
        </span>
        <div className="grid grid-cols-2 gap-2">
          {[["Breite", "60 cm"], ["Höhe", "60 cm"], ["Format", "SVG"], ["DPI", "300"]].map(([l, v]) => (
            <div key={l} className="flex flex-col gap-0.5 p-2 rounded cursor-default select-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</span>
              <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{v}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
