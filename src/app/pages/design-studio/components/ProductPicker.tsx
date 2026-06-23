"use client";

import { useMemo } from "react";
import { Palette } from "lucide-react";
import { getBarrelEntry } from "@/app/components/design/barrel";
import type { ProductOption } from "@/app/components/design/types";

interface Props {
  products: ProductOption[];
  onSelect: (product: ProductOption) => void;
}

/**
 * Auswahl-Fenster vor dem Editor: zeigt alle designbaren Produkte mit ihrer
 * SVG-Illustration als Vorschau. Klick öffnet das Produkt im Editor.
 */
export function ProductPicker({ products, onSelect }: Props) {
  return (
    <div
      className="dark fixed inset-0 z-[9999] flex flex-col overflow-hidden font-body"
      style={{ background: "#0f1117" }}
    >
      {/* Header */}
      <header className="shrink-0 flex flex-col items-center text-center gap-2 px-6 pt-12 pb-8">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          <Palette size={13} /> Design Studio
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-medium text-white/95">
          Wähle dein Produkt
        </h1>
        <p className="text-[13px] text-white/45 max-w-md">
          Klicke ein Produkt, um es mit deinem eigenen Motiv im Editor zu gestalten.
        </p>
      </header>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-12">
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelect} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-[13px] text-white/35 mt-10">
            Keine designbaren Produkte gefunden.
          </p>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onSelect }: { product: ProductOption; onSelect: Props["onSelect"] }) {
  const { Component: BarrelIllustration } = useMemo(
    () => getBarrelEntry(product.label),
    [product.label],
  );

  return (
    <button
      onClick={() => onSelect(product)}
      className="group flex flex-col rounded-xl overflow-hidden text-left cursor-pointer transition-all duration-200"
      style={{ background: "#161a21", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-rust)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* SVG-Vorschau */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden"
        style={{ background: "radial-gradient(circle at 50% 38%, #23211f 0%, #0c0a09 78%)" }}
      >
        <BarrelIllustration showBackground={false} showFloorShadow color="grau" />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-white/90 truncate">{product.label}</p>
          {product.price && (
            <p className="text-[11px] text-white/40 tabular-nums">{formatPrice(product.price)}</p>
          )}
        </div>
        <span
          className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "var(--color-rust)", color: "white" }}
        >
          Gestalten
        </span>
      </div>
    </button>
  );
}

/** "89.00 EUR" → "89,00 €" (leichtgewichtig, ohne Intl-Overhead). */
function formatPrice(raw: string): string {
  const [amount, currency] = raw.split(" ");
  const symbol = currency === "EUR" ? "€" : currency ?? "";
  const formatted = amount?.replace(".", ",") ?? raw;
  return symbol ? `${formatted} ${symbol}` : formatted;
}
