import { ShoppingCart, CheckCircle2, Loader2, Check } from "lucide-react";
import type { BarrelColor } from "@/app/components/design/barrel";
import type { ZusatzproduktOption } from "@/app/types/shopify";
import type { PriceAmount } from "@/app/utils/calculateDisplayPrice";
import { formatPrice } from "@/app/utils/formatPrice";
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
  displayPrice: PriceAmount;
  zusatzprodukte: ZusatzproduktOption[];
  selectedAddons: ZusatzproduktOption[];
  onToggleAddon: (opt: ZusatzproduktOption) => void;
  devProps?: DevProps;
}

const COLORS: { id: BarrelColor; label: string; swatch: string }[] = [
  { id: "grau",    label: "Unlackiert", swatch: "#888886" },
  { id: "schwarz", label: "Schwarz",    swatch: "#242422" },
  { id: "silber",  label: "Silber",     swatch: "#c0c0be" },
  { id: "gold",    label: "Gold",       swatch: "#c8a020" },
];

/**
 * Rechts-Panel des Studios: Preis (oben, fixiert) und Save-CTA (unten, fixiert)
 * bleiben immer sichtbar. Dazwischen genau EIN scrollender Bereich (Finish,
 * Zusatzprodukte, Design Review) — bewusst kein verschachteltes Scrollen.
 */
export function EditorRightPanel({
  selectedColor, onColorChange, onSave, saving, displayPrice,
  zusatzprodukte, selectedAddons, onToggleAddon, devProps,
}: Props) {
  return (
    <aside
      className="flex flex-col w-[240px] xl:w-[260px] shrink-0"
      style={{ background: "#111318", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Fixierter Preis-Header */}
      <div
        className="shrink-0 px-4 py-3.5 flex flex-col gap-0.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[9px] font-semibold tracking-[0.14em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
          Preis
        </span>
        <span className="text-[24px] font-semibold leading-tight" style={{ color: "var(--color-cream)" }}>
          {formatPrice(displayPrice.amount, displayPrice.currencyCode)}
        </span>
      </div>

      {/* Einziger scrollender Bereich */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-5">
        {/* Finish / Lackierung */}
        <section className="flex flex-col gap-2">
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
        </section>

        {/* Zusatzprodukte */}
        {zusatzprodukte.length > 0 && (
          <section className="flex flex-col gap-1.5">
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              Zusatzprodukte
            </span>
            {zusatzprodukte.map((opt) => {
              const active = selectedAddons.some((a) => a.id === opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => onToggleAddon(opt)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded text-left cursor-pointer transition-all shrink-0"
                  style={{
                    background: active ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                    border: active ? "1px solid var(--color-rust)" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center"
                    style={{
                      background: active ? "var(--color-rust)" : "transparent",
                      borderColor: active ? "var(--color-rust)" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {active && <Check size={11} color="white" />}
                  </span>
                  <span
                    className="flex-1 min-w-0 text-[12px] font-medium truncate"
                    style={{ color: active ? "var(--color-cream)" : "rgba(255,255,255,0.65)" }}
                  >
                    {opt.title}
                  </span>
                  <span className="shrink-0 text-[11px] tabular-nums" style={{ color: "rgba(255,255,255,0.45)" }}>
                    +{formatPrice(opt.price.amount, opt.price.currencyCode)}
                  </span>
                </button>
              );
            })}
          </section>
        )}

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
      </div>

      {/* Fixierter Save-Footer */}
      <div className="shrink-0 p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
      </div>

      {/* Dev panel — only rendered when devProps is passed (IS_DEV) */}
      {devProps && (
        <div className="shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
