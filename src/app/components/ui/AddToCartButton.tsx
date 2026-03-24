"use client";

import type React from "react";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import type { ZusatzproduktOption } from "../../types/shopify";

interface AddToCartButtonProps {
  variantId: string;
  available: boolean;
  title: string;
  color?: string;
  icon?: boolean;
  quantity?: number;
  /** Zusätzliche Line-Item-Attribute (z.B. aus Metaobjekt-Feldern). Leere Werte werden ignoriert. */
  customAttributes?: { key: string; value: string }[];
  /** Ausgewählte Zusatzprodukte — werden als eigene Cart-Lines addiert */
  metaZusatzprodukte?: ZusatzproduktOption[];
  /** false → Button disabled + Hinweis, dass Pflichtfelder fehlen */
  formValid?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  variantId,
  available,
  title,
  color = "",
  icon,
  quantity = 1,
  customAttributes,
  metaZusatzprodukte,
  formValid = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = async () => {
    if (!variantId) return;

    try {
      const attributes: { key: string; value: string }[] = [];
      if (color) attributes.push({ key: "Farbe", value: color });
      if (customAttributes) {
        attributes.push(...customAttributes.filter((a) => a.value.trim() !== ""));
      }
      const additionalLines = metaZusatzprodukte?.map((v) => ({ variantId: v.defaultVariantId, quantity }));
      await addItem(
        variantId,
        quantity,
        attributes.length > 0 ? attributes : undefined,
        additionalLines?.length ? additionalLines : undefined,
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
      addToast("Fehler beim Hinzufügen zum Warenkorb", "error");
    } finally {
      setIsLoading(false);
    }
  };
 
  
  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handleAddToCart}
        disabled={!available || isLoading || !formValid}
        className="w-full flex flex-row items-center justify-center bg-accent text-white hover:opacity-90 font-medium py-2.5 px-4 rounded transition-opacity duration-200 disabled:opacity-50"
      >
        {icon && <ShoppingCart size={18} className="mr-2" />}
        {!available
          ? "Nicht verfügbar"
          : isLoading
          ? "Hinzufügen..."
          : "In den Warenkorb"}
      </button>
      {available && !formValid && (
        <p className="text-xs text-center text-muted dark:text-neutral-500">
          Bitte alle Felder ausfüllen
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;
