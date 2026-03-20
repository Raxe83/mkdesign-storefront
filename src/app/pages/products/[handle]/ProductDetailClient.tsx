"use client";

import { useState } from "react";
import { ArrowLeft, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Product, Metaobject } from "../../../types/shopify";
import type { HeroCard } from "@/app/components/product/product-category";
import { formatPrice } from "../../../utils/formatPrice";
import AddToCartButton from "../../../components/ui/AddToCartButton";
import { shipment } from "../../../types/products";
import ColorChooser from "../../../components/product/ColorChooser";
import { ProductReviews } from "@/app/components/product/product-reviews";
import { ProductHeroCards } from "@/app/components/product/ProductHeroCards";
import { RelatedProducts } from "@/app/components/product/RelatedProducts";
import { ProductExtraContent } from "@/app/components/product/ProductExtraContent";
import ImageGallery from "./ImageGallery";

interface Props {
  product:          Product;
  heroCards:        HeroCard[];
  relatedProducts:  Product[];
  relatedLabel:     string;
  extraContent:     Metaobject[];
}

export default function ProductDetailClient({
  product, heroCards, relatedProducts, relatedLabel, extraContent,
}: Props) {
  const images       = product.images.edges.map((e) => e.node);
  const firstVariant = product.variants.edges[0]?.node;
  const price        = firstVariant?.price.amount    ?? product.priceRange.minVariantPrice.amount;
  const currencyCode = firstVariant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode;
  const isAvailable  = firstVariant?.availableForSale ?? false;
  const initialImage = product.featuredImage?.url ?? images[0]?.url ?? "";

  const [quantity,      setQuantity]      = useState(1);
  const [selectedColor, setSelectedColor] = useState("Schwarz");

  return (
    <div className="pb-8 -mt-8">

      {/* Back */}
      <Link href="/pages/products"
        className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors duration-200 mb-10 text-sm">
        <ArrowLeft size={14} />
        Zurück zu den Produkten
      </Link>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">

        <ImageGallery images={images} productTitle={product.title} initialImage={initialImage} />

        {/* Product info */}
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-primary dark:text-neutral-100 leading-tight">
            {product.title}
          </h1>

          <p className="text-2xl font-medium text-primary dark:text-neutral-100">
            {formatPrice(price, currencyCode)}
          </p>

          <ProductReviews productId={product.id} short />

          <hr className="border-zinc-200/60 dark:border-zinc-800" />

          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }}
          />

{/* PERSONALISIERUNG */}
          {/* <div>
            <p className="text-xs uppercase tracking-widest text-muted dark:text-neutral-400 mb-2">
              Farbe{selectedColor ? ` — ${selectedColor}` : ""}
            </p>
            <ColorChooser setSelectedColor={setSelectedColor} selectedColor={selectedColor} />
          </div> */}

          <div>
            <p className="text-xs uppercase tracking-widest text-muted dark:text-neutral-400 mb-2">Menge</p>
            <div className="inline-flex items-center border border-zinc-200 dark:border-zinc-700 rounded">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Menge verringern"
                disabled={quantity <= 1}
                className="p-2.5 text-muted hover:text-primary dark:hover:text-neutral-100 transition-colors duration-150 disabled:opacity-30">
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium text-primary dark:text-neutral-100 select-none">
                {quantity}
              </span>
              <button onClick={() => setQuantity((q) => q + 1)} aria-label="Menge erhöhen"
                className="p-2.5 text-muted hover:text-primary dark:hover:text-neutral-100 transition-colors duration-150">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {isAvailable ? (
            <AddToCartButton variantId={firstVariant.id} available={isAvailable}
              title={product.title} color={selectedColor} quantity={quantity} icon />
          ) : (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">Nicht verfügbar</p>
          )}

          <div className="space-y-2.5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2.5 text-sm text-muted dark:text-neutral-400">
              <Truck size={15} className="shrink-0" />
              <span>Standardversand: {shipment.standard.days} Werktage — {formatPrice(shipment.standard.price.toFixed(2), currencyCode)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted dark:text-neutral-400">
              <Truck size={15} className="shrink-0 text-accent" />
              <span>Expressversand: {shipment.premium.days} Werktage — {formatPrice(shipment.premium.price.toFixed(2), currencyCode)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted dark:text-neutral-400">
              <RotateCcw size={15} className="shrink-0" />
              <span>30 Tage kostenlose Rückgabe</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Extra Content ── */}
      {extraContent.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800">
          <ProductExtraContent metaobjects={extraContent} />
        </div>
      )}

      {/* ── Hero-Karten ── */}
      {/* <div className="mt-16">
        <ProductHeroCards product={product} cards={heroCards} />
      </div> */}

      {/* ── Ähnliche Produkte ── */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-medium text-primary dark:text-neutral-100 mb-5">
            {relatedLabel}
          </h2>
          <RelatedProducts products={relatedProducts} />
        </div>
      )}

      {/* ── Kundenbewertungen ── */}
      <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
