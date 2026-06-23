"use client";

import { Loader2 } from "lucide-react";
import { useEditorProducts } from "@/app/components/design/hooks/useEditorProducts";
import StudioEditor from "./StudioEditor";

/**
 * Lädt die designbaren Produkte (respektiert `?product=`-Param) und mountet
 * den Editor erst, sobald ein Produkt mit echter Variant-ID bereitsteht —
 * so wird der Canvas direkt mit dem korrekten Preset initialisiert.
 */
export default function DesignStudioClient() {
  const { productsLoading, selectedProduct } = useEditorProducts();

  if (productsLoading || !selectedProduct) {
    return (
      <div
        className="dark fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3 font-body"
        style={{ background: "#0f1117" }}
      >
        <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-gold)" }} />
        <p className="text-[13px] text-white/45">Design Studio wird geladen …</p>
      </div>
    );
  }

  return <StudioEditor key={selectedProduct.id} product={selectedProduct} />;
}
