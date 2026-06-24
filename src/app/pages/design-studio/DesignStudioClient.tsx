"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEditorProducts } from "@/app/components/design/hooks/useEditorProducts";
import type { ProductOption } from "@/app/components/design/types";
import { ProductPicker } from "./components/ProductPicker";
import StudioEditor from "./StudioEditor";

/**
 * Steuert den Studio-Ablauf:
 *   1. Produkte laden
 *   2. Produkt-Auswahl-Fenster (ProductPicker) anzeigen
 *   3. Nach Klick (oder `?product=`-Param) den Editor mit dem Produkt öffnen
 *
 * Der Editor wird erst mit einem konkreten Produkt gemountet, damit der Canvas
 * direkt mit dem korrekten Preset initialisiert wird.
 */
export default function DesignStudioClient() {
  const { products, productsLoading } = useEditorProducts();
  const searchParams = useSearchParams();
  const paramId = searchParams.get("product");

  const [chosen, setChosen] = useState<ProductOption | null>(null);

  // Direktstart: wenn ein gültiger `?product=`-Param vorliegt, Picker überspringen
  useEffect(() => {
    if (productsLoading || chosen || !paramId) return;
    const match = products.find((p) => p.id === paramId);
    if (match) setChosen(match);
  }, [productsLoading, chosen, paramId, products]);

  // Das Studio ist ein Vollbild-Overlay (fixed inset-0) — die normale Seite
  // (Header/Footer) bleibt im Dokumentfluss und erzeugt sonst eine sinnlose,
  // rein optische äußere Scrollbar. Body-Scroll für die Dauer sperren.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (productsLoading) {
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

  if (!chosen) {
    return <ProductPicker products={products} onSelect={setChosen} />;
  }

  return (
    <StudioEditor
      key={chosen.id}
      product={chosen}
      onBack={() => setChosen(null)}
    />
  );
}
