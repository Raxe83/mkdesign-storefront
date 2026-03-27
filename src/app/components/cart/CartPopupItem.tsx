"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import type { CartItem } from "@/app/types/shopify";

interface CartPopupItemProps {
  node: CartItem;
  linkedItems: CartItem[];
}

const CartPopupItem = ({ node, linkedItems }: CartPopupItemProps) => {
  const { updateItemQuantityFunction, removeItem } = useCart();
  const [localQty, setLocalQty] = useState(node.quantity);

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
    for (const child of linkedItems) removeItem(child.id);
  };

  const isCustomDesign = node.attributes?.some((a) => a.key === "_design_json");
  const previewUrl = node.attributes?.find((a) => a.key === "Design-Vorschau")?.value;
  const visibleAttrs = node.attributes?.filter((a) => !a.key.startsWith("_")) ?? [];

  return (
    <div className="px-4 py-3 flex items-start gap-3">
      {/* Thumbnail */}
      {isCustomDesign && previewUrl ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-rust/30 bg-charcoal">
          <Image src={previewUrl} alt="Dein Design" fill className="object-contain p-0.5" />
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

        {isCustomDesign ? (
          <p className="text-xs text-rust font-medium mt-0.5">Individuelles Design</p>
        ) : visibleAttrs.length > 0 ? (
          <div className="text-xs text-stone dark:text-muted mt-0.5 space-y-0.5">
            {visibleAttrs.map((attr, i) => (
              <div key={i}>{attr.key}: {attr.value}</div>
            ))}
          </div>
        ) : null}

        {/* Linked sub-items */}
        {linkedItems.length > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-sand/30 dark:border-zinc-800 space-y-1">
            {linkedItems.map((child) => (
              <div key={child.id} className="flex items-center gap-1.5">
                {child.merchandise.product.featuredImage && (
                  <Image
                    src={child.merchandise.product.featuredImage.url}
                    alt={child.merchandise.product.featuredImage.altText ?? child.merchandise.product.title}
                    width={20}
                    height={20}
                    className="rounded object-cover border border-sand/40 dark:border-zinc-700 shrink-0"
                  />
                )}
                <span className="flex-1 text-[11px] text-stone dark:text-muted truncate">
                  {child.merchandise.product.title}
                </span>
                <span className="text-[11px] text-muted tabular-nums shrink-0">
                  +{formatPrice(child.merchandise.price?.amount ?? "0", child.merchandise.price?.currencyCode ?? "EUR")}
                </span>
                <button
                  onClick={() => removeItem(child.id)}
                  className="text-muted hover:text-rust transition-colors duration-150 shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
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
            (parseFloat(node.merchandise.price?.amount ?? "0") * localQty).toString(),
            node.merchandise.price?.currencyCode ?? "EUR"
          )}
        </p>
      </div>
    </div>
  );
};

export default CartPopupItem;
