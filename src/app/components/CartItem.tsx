"use client";

import type React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/app/types/shopify";
import Price from "@/app/components/ui/Price";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

export interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItem, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity < 1) {
      removeItem(item.id);
    } else {
      updateItem(item.id, newQuantity);
    }
  };

  const featuredImage = item.merchandise.product.featuredImage;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-zinc-200/60 dark:border-zinc-800">
      {/* Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || item.merchandise.product.title}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-muted">–</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-primary truncate">
              {item.merchandise.product.title}
            </h3>
            {item.merchandise.title !== "Default Title" && (
              <p className="text-xs text-muted mt-0.5">
                {item.merchandise.title}
              </p>
            )}
            {item.attributes.length > 0 && (() => {
              const visible = item.attributes.filter(
                (a) => !a.key.startsWith("_") && a.key !== "Design-Vorschau" && a.key !== "Design-Vorschau-B",
              );
              const isDesign = item.attributes.some((a) => a.key === "_design_json");
              return (
                <>
                  {isDesign && (
                    <p className="text-xs text-rust font-medium mt-0.5">Individuelles Design</p>
                  )}
                  {visible.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      {visible.map((attr) => (
                        <span key={attr.key} className="text-xs text-muted">
                          {attr.key}: {attr.value}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          <Price
            amount={item.merchandise.price.amount}
            currencyCode={item.merchandise.price.currencyCode}
            className="text-sm flex-shrink-0"
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          {/* Quantity controls */}
          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1.5 text-muted hover:text-primary transition-colors duration-200"
              aria-label="Menge verringern"
            >
              <Minus size={14} />
            </button>
            <span className="px-2 text-sm text-primary min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1.5 text-muted hover:text-primary transition-colors duration-200"
              aria-label="Menge erhöhen"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-muted hover:text-red-500 transition-colors duration-200 rounded"
            aria-label="Artikel entfernen"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
