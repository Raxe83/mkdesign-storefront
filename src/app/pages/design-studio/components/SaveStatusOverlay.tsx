"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle, ShoppingCart, X } from "lucide-react";
import type { SaveToCartStatus } from "@/app/components/design/hooks/useDesignSaveToCart";

const STEP_LABELS: Record<string, string> = {
  "preview-a": "Vorschau wird erstellt …",
  "json-a":    "Design wird gespeichert …",
  "preview-b": "Rückseite wird erstellt …",
  "json-b":    "Rückseite wird gespeichert …",
};

interface Props {
  /** Aktueller Upload-Schritt (aus canvas.uploadState) oder null. */
  uploadStep: string | null;
  state: SaveToCartStatus;
  productName: string;
  onClose: () => void;
}

export function SaveStatusOverlay({ uploadStep, state, productName, onClose }: Props) {
  if (state.status === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(8,9,13,0.78)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-xl p-6 flex flex-col items-center text-center gap-4"
        style={{ background: "#161a21", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Close (nur wenn nicht mitten im Speichern) */}
        {state.status !== "saving" && (
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="absolute top-3 right-3 p-1 rounded text-white/40 hover:text-white/80 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        {/* ── Speichern / Upload läuft ───────────────────────────── */}
        {state.status === "saving" && (
          <>
            <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-gold)" }} />
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-white/90">Design wird gespeichert</p>
              <p className="text-[12px] text-white/45">
                {uploadStep ? STEP_LABELS[uploadStep] ?? "Wird verarbeitet …" : "Wird zum Warenkorb hinzugefügt …"}
              </p>
            </div>
          </>
        )}

        {/* ── Erfolg ──────────────────────────────────────────────── */}
        {state.status === "success" && (
          <>
            <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-white/10 bg-[#0f1117]">
              <Image src={state.previewUrl} alt="Dein Design" fill className="object-contain p-1.5" />
              <span
                className="absolute -bottom-px -right-px flex items-center justify-center h-7 w-7 rounded-tl-lg"
                style={{ background: "var(--color-gold)" }}
              >
                <CheckCircle2 size={16} style={{ color: "#0f1117" }} />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold text-white/95">Im Warenkorb!</p>
              <p className="text-[12px] text-white/50 leading-relaxed">
                Dein Design für <span className="text-white/75">{productName}</span> wurde gespeichert
                und liegt mit allen Details im Warenkorb.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-1">
              <Link
                href="/pages/cart"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
                style={{ background: "var(--color-gold)", color: "#0f1117" }}
              >
                <ShoppingCart size={15} /> Zum Warenkorb
              </Link>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-[13px] font-medium text-white/60 hover:text-white/90 transition-colors cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Weiter gestalten
              </button>
            </div>
          </>
        )}

        {/* ── Fehler ──────────────────────────────────────────────── */}
        {state.status === "error" && (
          <>
            <AlertCircle size={32} style={{ color: "#e0654f" }} />
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-white/90">Etwas ist schiefgelaufen</p>
              <p className="text-[12px] text-white/50 leading-relaxed">{state.message}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
              style={{ background: "var(--color-rust)", color: "white" }}
            >
              Erneut versuchen
            </button>
          </>
        )}
      </div>
    </div>
  );
}
