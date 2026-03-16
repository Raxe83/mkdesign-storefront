"use client";

import type React from "react";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";

interface AddToCartButtonProps {
  variantId: string;
  available: boolean;
  title: string;
  color: string;
  icon?: boolean;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  variantId,
  available,
  title,
  color,
  icon,
  quantity = 1,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [ t ] = useTranslation();

  const handleAddToCart = async () => {
    if (!variantId) return;

    try {
      await addItem(variantId, quantity, [{ key: "Farbe", value: color }]);
    } catch (err) {
      console.error("Error adding to cart:", err);
      addToast("Fehler beim Hinzufügen zum Warenkorb", "error");
    } finally {
      setIsLoading(false);
    }
  };
 
  
  return (
    <button
      onClick={handleAddToCart}
      disabled={!available || isLoading}
      className="w-3/4 flex flex-row items-center justify-center bg-accent text-white hover:opacity-90 font-medium py-2.5 px-4 rounded transition-opacity duration-200 disabled:opacity-50"
    >
      {icon && <ShoppingCart size={18} className="mr-2" />}
      {!available
        ? t("product.notAvailableShort")
        : isLoading
        ? t("common.adding") + "..."
        : t("common.addToCart")}
    </button>
  );
};

export default AddToCartButton;
