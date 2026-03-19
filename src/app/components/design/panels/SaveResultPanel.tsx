"use client";

import { useState } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { cn } from "@/app/utils/utils";
import type { DesignUploadResult } from "@/app/lib/designApi";
import type { CartButtonState } from "../types";

type Props = {
  result:      DesignUploadResult;
  variantId:   string | null;
  onAddToCart: () => Promise<void>;
  onReset:     () => void;
};

export function SaveResultPanel({ result, variantId, onAddToCart, onReset }: Props) {
  const [cartState, setCartState] = useState<CartButtonState>(variantId ? "idle" : "no-variant");

  const handleCart = async () => {
    setCartState("loading");
    try {
      await onAddToCart();
      setCartState("added");
    } catch {
      setCartState("error");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded bg-rustLight dark:bg-zinc-800 border border-rust/20">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rust flex-shrink-0">
          <Check size={10} className="text-white" />
        </span>
        <div>
          <p className="text-xs font-medium text-charcoal dark:text-cream leading-tight">Design gespeichert</p>
          <p className="text-[11px] text-stone dark:text-muted">Bereit für den Warenkorb</p>
        </div>
      </div>

      <div className="aspect-square rounded overflow-hidden border border-stone-200/60 dark:border-zinc-700/60 bg-stone-50 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={result.previewUrl} alt="Design-Vorschau" className="w-full h-full object-contain" />
      </div>

      {cartState === "added" ? (
        <div className="flex items-center justify-center gap-2 py-2.5 rounded bg-rustLight dark:bg-zinc-800 text-sm font-medium text-rust">
          <Check size={14} /> Im Warenkorb
        </div>
      ) : (
        <button
          onClick={handleCart}
          disabled={cartState === "loading" || cartState === "no-variant"}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded",
            "text-sm font-medium tracking-[0.04em] uppercase",
            "bg-rust text-white transition-colors duration-200",
            "hover:bg-rustMid disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {cartState === "loading"
            ? <><Loader2 size={14} className="animate-spin" /> Wird hinzugefügt…</>
            : <><ShoppingCart size={14} /> In den Warenkorb</>}
        </button>
      )}

      {cartState === "no-variant" && (
        <p className="text-[11px] text-muted text-center -mt-1">Kein Variant gesetzt.</p>
      )}
      {cartState === "error" && (
        <p className="text-xs text-red-500 text-center -mt-1">Fehler — bitte erneut versuchen.</p>
      )}

      <button
        onClick={onReset}
        className="text-xs text-muted hover:text-primary dark:hover:text-cream transition-colors duration-200 cursor-pointer text-center"
      >
        ← Weiter bearbeiten
      </button>
    </div>
  );
}
