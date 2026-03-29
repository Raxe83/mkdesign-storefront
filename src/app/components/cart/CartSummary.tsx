"use client";

import { Truck } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import Price from "@/app/components/ui/Price";
const CartSummary = () => {
  const { cart } = useCart();

  if (!cart) return null;

  const subtotal = cart.estimatedCost.subtotalAmount;
  const total = cart.estimatedCost.totalAmount;

  return (
    <div className="space-y-3">
      {/* Subtotal row */}
      <div className="flex justify-between text-sm">
        <span className="text-muted">Zwischensumme</span>
        <Price amount={subtotal.amount} currencyCode={subtotal.currencyCode} />
      </div>

      {/* Shipping notice */}
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <Truck size={13} />
        <span>Versandkosten werden im Checkout berechnet.</span>
      </div>

      <div className="border-t border-zinc-200/60 dark:border-zinc-800 pt-3 flex justify-between text-sm font-medium">
        <span className="text-primary">Gesamtsumme</span>
        <Price
          amount={total.amount}
          currencyCode={total.currencyCode}
          className="text-base"
        />
      </div>

      {/* Checkout button */}
      {cart.checkoutUrl && (
        <a
          href={cart.checkoutUrl}
          rel="noopener noreferrer"
          className="mt-1 block w-full bg-accent text-white text-center px-4 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity duration-200"
        >
          Zur Kasse
        </a>
      )}

      {/* Trusted payment hint */}
      <p className="text-center text-xs text-muted pt-1">
        Sicherer Checkout · SSL-verschlüsselt
      </p>
    </div>
  );
};

export default CartSummary;
