"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/app/components/ui/next/ui/sheet";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import CartItem from "@/app/components/CartItem";
import CartSummary from "./CartSummary";
import { useTranslation } from "react-i18next";

export interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { cart, isLoading } = useCart();
  const [t] = useTranslation();

  const items = cart?.lines.edges ?? [];
  const isEmpty = items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg font-semibold text-primary">
              {t("cart.header")}
              {!isEmpty && (
                <span className="ml-2 text-sm font-normal text-muted">
                  ({items.length})
                </span>
              )}
            </SheetTitle>
            <SheetClose className="p-1.5 rounded text-muted hover:text-primary transition-colors duration-200">
              <X size={18} />
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag size={40} className="text-zinc-300 dark:text-zinc-700 mb-3" />
              <p className="text-muted text-sm">{t("cart.empty")}</p>
            </div>
          ) : (
            <div>
              {items.map(({ node }) => (
                <CartItem key={node.id} item={node} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && !isLoading && (
          <div className="flex-shrink-0 border-t border-zinc-200/60 dark:border-zinc-800 px-6 py-4">
            <CartSummary />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
