"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import type { CartItem } from "@/app/types/shopify";

interface CartPageItemProps {
  node: CartItem;
  linkedItems: CartItem[];
  index: number;
}

const CartPageItem = ({ node, linkedItems, index }: CartPageItemProps) => {
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
  };

  const baseAmount   = parseFloat(node.merchandise.price?.amount ?? "0") * localQty;
  const linkedAmount = linkedItems.reduce(
    (sum, child) => sum + parseFloat(child.merchandise.price?.amount ?? "0") * localQty,
    0,
  );
  const lineTotal    = (baseAmount + linkedAmount).toString();
  const isCustomDesign = node.attributes?.some((a) => a.key === "_design_json");
  const previewUrl  = node.attributes?.find((a) => a.key === "Design-Vorschau")?.value;
  const previewUrlB = node.attributes?.find((a) => a.key === "Design-Vorschau-B")?.value;
  const visibleAttrs = node.attributes?.filter((a) => !a.key.startsWith("_") && a.key !== "Design-Vorschau" && a.key !== "Design-Vorschau-B") ?? [];

  return (
    <div
      className="p-5 sm:p-6 flex items-start gap-4 opacity-0 animate-gift-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "forwards" }}
    >
      {/* Thumbnail */}
      {isCustomDesign && previewUrl ? (
        <div className="flex gap-1.5 shrink-0">
          <div className="relative h-20 w-20 rounded-sm border border-rust/30 overflow-hidden bg-charcoal">
            <Image src={previewUrl} alt="Seite A" fill className="object-contain p-1" />
          </div>
          {previewUrlB && (
            <div className="relative h-20 w-20 rounded-sm border border-rust/30 overflow-hidden bg-charcoal">
              <Image src={previewUrlB} alt="Seite B" fill className="object-contain p-1" />
            </div>
          )}
        </div>
      ) : (
        <Link
          href={`/pages/products/${node.merchandise.product.handle}`}
          className="relative h-20 w-20 shrink-0 rounded-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800 hover:opacity-80 transition-opacity duration-200"
        >
          {node.merchandise.product.featuredImage ? (
            <Image
              src={node.merchandise.product.featuredImage.url}
              alt={node.merchandise.product.featuredImage.altText || node.merchandise.product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag size={18} className="text-muted" />
            </div>
          )}
        </Link>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/pages/products/${node.merchandise.product.handle}`}>
          <h3 className="font-display font-medium text-primary text-sm leading-snug hover:text-accent transition-colors duration-150 line-clamp-2">
            {node.merchandise.product.title}
          </h3>
        </Link>

        {node.merchandise.title !== "Default Title" && (
          <p className="mt-0.5 text-xs text-muted">{node.merchandise.title}</p>
        )}

        {isCustomDesign && (
          <p className="mt-1 text-xs text-rust font-medium">Individuelles Design</p>
        )}
        {visibleAttrs.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {visibleAttrs.map((attr) => (
              <p key={attr.key} className="text-xs text-muted">{attr.key}: {attr.value}</p>
            ))}
          </div>
        )}

        {/* Linked sub-items */}
        {linkedItems.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-muted dark:text-neutral-500">Zusatzprodukte</p>
            {linkedItems.map((child) => {
              const isSideBItem = child.attributes?.some(a => a.key === "_seite_b_aufpreis");
              return (
              <div key={child.id} className="flex items-center gap-2">
                {!isSideBItem && child.merchandise.product.featuredImage && (
                  <Image
                    src={child.merchandise.product.featuredImage.url}
                    alt={child.merchandise.product.featuredImage.altText ?? child.merchandise.product.title}
                    width={24}
                    height={24}
                    className="rounded object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                  />
                )}
                <span className="flex-1 text-xs text-muted dark:text-neutral-400 truncate">
                  {isSideBItem ? "Seite B (beidseitig)" : child.merchandise.product.title}
                </span>
                <span className="text-xs text-muted tabular-nums shrink-0">
                  +{formatPrice(child.merchandise.price?.amount ?? "0", child.merchandise.price?.currencyCode ?? "EUR")}
                </span>
                {!isSideBItem && (
                  <button
                    onClick={() => removeItem(child.id)}
                    className="text-muted hover:text-rust transition-colors duration-150 shrink-0"
                    aria-label="Entfernen"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            );})}
          </div>
        )}

        {/* Quantity stepper */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-sm overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={localQty <= 1}
              className="h-7 w-7 flex items-center justify-center text-muted hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none"
              aria-label="Weniger"
            >−</button>
            <span className="h-7 w-8 flex items-center justify-center text-xs font-medium text-primary tabular-nums border-x border-zinc-200 dark:border-zinc-700 select-none">
              {localQty}
            </span>
            <button
              onClick={handleIncrease}
              className="h-7 w-7 flex items-center justify-center text-muted hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150 text-base leading-none"
              aria-label="Mehr"
            >+</button>
          </div>
          <button
            onClick={handleRemove}
            className="flex items-center gap-1 text-xs text-muted hover:text-rust transition-colors duration-150"
          >
            <Trash2 size={13} />
            Löschen
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-primary tabular-nums">
          {formatPrice(lineTotal, node.merchandise.price?.currencyCode ?? "EUR")}
        </p>
        <p className="text-[11px] text-muted mt-0.5 tabular-nums">
          {formatPrice(node.merchandise.price?.amount ?? "0", node.merchandise.price?.currencyCode ?? "EUR")} / Stk.
        </p>
      </div>
    </div>
  );
};

export default CartPageItem;
