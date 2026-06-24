"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, X, ZoomIn } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import { ReviewLightbox } from "@/app/components/ui/ReviewLightbox";
import type { CartItem } from "@/app/types/shopify";

interface CartPopupItemProps {
  node: CartItem;
  linkedItems: CartItem[];
}

const CartPopupItem = ({ node, linkedItems }: CartPopupItemProps) => {
  const { updateItemQuantityFunction, removeItem } = useCart();
  const [localQty, setLocalQty] = useState(node.quantity);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync from API response — no-op if local state already matches
  useEffect(() => {
    setLocalQty(node.quantity);
  }, [node.quantity]);

  const handleIncrease = () => {
    const newQty = localQty + 1;
    setLocalQty(newQty);
    updateItemQuantityFunction(node.id, newQty);
    for (const child of linkedItems) updateItemQuantityFunction(child.id, newQty);
  };

  const handleDecrease = () => {
    if (localQty <= 1) return;
    const newQty = localQty - 1;
    setLocalQty(newQty);
    updateItemQuantityFunction(node.id, newQty);
    for (const child of linkedItems) updateItemQuantityFunction(child.id, newQty);
  };

  const handleRemove = () => {
    removeItem(node.id);
  };

  const isCustomDesign = node.attributes?.some((a) => a.key === "_design_json");
  const previewUrl  = node.attributes?.find((a) => a.key === "Design-Vorschau")?.value;
  const previewUrlB = node.attributes?.find((a) => a.key === "Design-Vorschau-B")?.value;
  const visibleAttrs = node.attributes?.filter((a) => !a.key.startsWith("_") && a.key !== "Design-Vorschau" && a.key !== "Design-Vorschau-B") ?? [];
  const designImages = [previewUrl, previewUrlB].filter((u): u is string => Boolean(u));

  return (
    <div className="px-4 py-3 flex items-start gap-3">
      {lightboxIndex !== null && (
        <ReviewLightbox
          images={designImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Thumbnail */}
      {isCustomDesign && previewUrl ? (
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            aria-label="Design ansehen"
            className="group relative h-12 w-12 overflow-hidden rounded-sm border border-rust/30 bg-charcoal cursor-zoom-in"
          >
            <Image src={previewUrl} alt="Seite A" fill className="object-contain p-0.5" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-150">
              <ZoomIn size={13} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            </span>
          </button>
          {previewUrlB && (
            <button
              type="button"
              onClick={() => setLightboxIndex(1)}
              aria-label="Design Seite B ansehen"
              className="group relative h-12 w-12 overflow-hidden rounded-sm border border-rust/30 bg-charcoal cursor-zoom-in"
            >
              <Image src={previewUrlB} alt="Seite B" fill className="object-contain p-0.5" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-150">
                <ZoomIn size={13} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-sand/40 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          {node.merchandise.product.featuredImage ? (
            <Image
              src={node.merchandise.product.featuredImage.url}
              alt={node.merchandise.product.featuredImage.altText || node.merchandise.product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-[10px] text-muted">–</span>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal dark:text-primary leading-snug line-clamp-1">
          {node.merchandise.product.title}
        </p>

        {isCustomDesign && (
          <p className="text-xs text-rust font-medium mt-0.5">Individuelles Design</p>
        )}
        {visibleAttrs.length > 0 && (
          <div className="text-xs text-stone dark:text-muted mt-0.5 space-y-0.5">
            {visibleAttrs.map((attr, i) => (
              <div key={i}>{attr.key}: {attr.value}</div>
            ))}
          </div>
        )}

        {/* Linked sub-items */}
        {linkedItems.length > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-sand/30 dark:border-zinc-800 space-y-1">
            {linkedItems.map((child) => {
              const isSideBItem = child.attributes?.some(a => a.key === "_seite_b_aufpreis");
              return (
              <div key={child.id} className="flex items-center gap-1.5">
                {!isSideBItem && child.merchandise.product.featuredImage && (
                  <Image
                    src={child.merchandise.product.featuredImage.url}
                    alt={child.merchandise.product.featuredImage.altText ?? child.merchandise.product.title}
                    width={20}
                    height={20}
                    className="rounded object-cover border border-sand/40 dark:border-zinc-700 shrink-0"
                  />
                )}
                <span className="flex-1 text-[11px] text-stone dark:text-muted truncate">
                  {isSideBItem ? "Seite B" : child.merchandise.product.title}
                </span>
                <span className="text-[11px] text-muted tabular-nums shrink-0">
                  +{formatPrice(child.merchandise.price?.amount ?? "0", child.merchandise.price?.currencyCode ?? "EUR")}
                </span>
                {!isSideBItem && (
                  <button
                    onClick={() => removeItem(child.id)}
                    aria-label="Artikel entfernen"
                    className="text-muted hover:text-rust transition-colors duration-150 shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              );
            })}
          </div>
        )}

        {/* Quantity stepper */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center border border-sand/50 dark:border-zinc-700 rounded-sm overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={localQty <= 1}
              className="h-6 w-6 flex items-center justify-center text-muted hover:text-primary transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Weniger"
            >
              <Minus size={10} />
            </button>
            <span className="h-6 w-7 flex items-center justify-center text-xs font-medium text-primary tabular-nums border-x border-sand/50 dark:border-zinc-700 select-none">
              {localQty}
            </span>
            <button
              onClick={handleIncrease}
              className="h-6 w-6 flex items-center justify-center text-muted hover:text-primary transition-colors duration-150"
              aria-label="Mehr"
            >
              <Plus size={10} />
            </button>
          </div>
          <button
            onClick={handleRemove}
            className="flex items-center gap-1 text-xs text-muted hover:text-rust transition-colors duration-150"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-charcoal dark:text-primary tabular-nums">
          {formatPrice(
            (
              parseFloat(node.merchandise.price?.amount ?? "0") * localQty +
              linkedItems.reduce((s, c) => s + parseFloat(c.merchandise.price?.amount ?? "0") * localQty, 0)
            ).toString(),
            node.merchandise.price?.currencyCode ?? "EUR"
          )}
        </p>
      </div>
    </div>
  );
};

export default CartPopupItem;
