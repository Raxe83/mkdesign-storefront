"use client";

import { ChevronDown, Loader2, ShoppingCart } from "lucide-react";
import { cn } from "@/app/utils/utils";
import type { UploadState, DualDesignUploadResult } from "@/app/lib/designApi";
import type { ProductOption } from "../types";
import { UploadStep } from "./UploadStep";
import { SaveResultPanel } from "./SaveResultPanel";

type Props = {
  products:              ProductOption[];
  productsLoading:       boolean;
  selectedProduct:       ProductOption | null;
  objectCount:           number;
  uploadState:           UploadState;
  onSelectProduct:       (p: ProductOption) => void;
  onSave:                () => void;
  onResetUpload:         () => void;
  onAddToCart:           () => Promise<void>;
};

export function ProductPanel({
  products, productsLoading, selectedProduct,
  objectCount, uploadState,
  onSelectProduct, onSave, onResetUpload, onAddToCart,
}: Props) {
  const isUploading = uploadState.status === "uploading";
  const showResult  = uploadState.status === "success";
  const uploadLabel = uploadState.status === "uploading"
    ? ({ "preview-a": "Seite A Vorschau…", "json-a": "Seite A JSON…", "preview-b": "Seite B Vorschau…", "json-b": "Seite B JSON…" } as Record<string, string>)[uploadState.step] ?? "Lädt…"
    : "";

  return (
    <>
      {/* Product selector */}
      <div className="rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="p-3">
          <label className="block text-[10px] font-medium text-muted uppercase tracking-[0.1em] mb-1.5">
            Produkt wählen
          </label>
          <div className="relative">
            <select
              value={selectedProduct?.id ?? ""}
              disabled={productsLoading || products.length === 0}
              onChange={(e) => {
                const p = products.find((p) => p.id === e.target.value);
                if (p) onSelectProduct(p);
              }}
              className={cn(
                "w-full appearance-none cursor-pointer rounded border",
                "border-stone-200 dark:border-zinc-700",
                "bg-background dark:bg-zinc-950 text-primary dark:text-cream",
                "px-3 py-2 pr-8 text-sm transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-rust/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {productsLoading
                ? <option>Produkte werden geladen…</option>
                : products.length === 0
                  ? <option>Keine Produkte gefunden</option>
                  : products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}{p.price ? ` — ${p.price}` : ""}
                    </option>
                  ))}
            </select>
            {productsLoading
              ? <Loader2 size={13} className="animate-spin absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              : <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />}
          </div>
          {selectedProduct?.price && (
            <p className="text-xs text-stone dark:text-muted mt-1.5 text-right">ab {selectedProduct.price}</p>
          )}
        </div>
      </div>

      {/* Object count */}
      {objectCount > 0 && (
        <p className="hidden xl:block text-center text-[11px] text-muted">
          {objectCount} Element{objectCount !== 1 ? "e" : ""} auf Canvas
        </p>
      )}

      {/* Save section */}
      <div className="rounded border border-stone-200/60 dark:border-zinc-700/60 bg-surface dark:bg-zinc-900 shadow-sm p-4">
        {!showResult ? (
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.1em]">Design fertig?</p>

            {uploadState.status === "uploading" && (
              <div className="flex flex-col gap-1.5">
                <UploadStep label="Seite A — Vorschau" done={["json-a","preview-b","json-b"].includes(uploadState.step)} active={uploadState.step === "preview-a"} />
                <UploadStep label="Seite A — JSON"     done={["preview-b","json-b"].includes(uploadState.step)}          active={uploadState.step === "json-a"} />
                <UploadStep label="Seite B — Vorschau" done={uploadState.step === "json-b"}                               active={uploadState.step === "preview-b"} />
                <UploadStep label="Seite B — JSON"     done={false}                                                       active={uploadState.step === "json-b"} />
              </div>
            )}

            <button
              onClick={onSave}
              disabled={isUploading || objectCount === 0 || !selectedProduct}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded",
                "text-sm font-medium tracking-[0.04em] uppercase",
                "bg-rust text-white transition-colors duration-200",
                "hover:bg-rustMid disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              {isUploading
                ? <><Loader2 size={15} className="animate-spin" /> {uploadLabel}</>
                : <><ShoppingCart size={15} /> Design speichern</>}
            </button>

            {uploadState.status === "error" && (
              <p className="text-xs text-red-500 text-center">{uploadState.message}</p>
            )}
            {objectCount === 0 && !isUploading && (
              <p className="text-xs text-muted text-center">Füge zuerst ein Element hinzu.</p>
            )}
          </div>
        ) : (
          <SaveResultPanel
            result={(uploadState as { status: "success"; result: DualDesignUploadResult }).result}
            variantId={selectedProduct?.variantId ?? null}
            onAddToCart={onAddToCart}
            onReset={onResetUpload}
          />
        )}
      </div>
    </>
  );
}
