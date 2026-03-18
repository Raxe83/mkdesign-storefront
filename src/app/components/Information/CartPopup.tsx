"use client";

import { ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import { Loader } from "../Loader";
import { cn } from "../../utils/utils";

const CartPopup = () => {
  const {
    cart,
    isLoading,
    removeItem,
    updateItemQuantityFunction,
    showCartPopup,
    setShowCartPopup,
  } = useCart();
  const [t] = useTranslation();

  if (!showCartPopup) return null;

  if (isLoading) {
    return <Loader />;
  }

  const isEmpty = !cart || cart.lines.edges.length === 0;

  const subtotal =
    !isEmpty && cart?.estimatedCost?.subtotalAmount?.amount
      ? Number.parseFloat(cart.estimatedCost.subtotalAmount.amount)
      : 0;

  const currencyCode =
    !isEmpty && cart?.estimatedCost?.totalAmount?.currencyCode
      ? cart.estimatedCost.totalAmount.currencyCode
      : "EUR";

  return (
    <div className="absolute top-16 right-4 sm:right-8 mt-2 w-[calc(100vw-2rem)] max-w-sm bg-cream dark:bg-zinc-900 border border-sand/50 dark:border-zinc-800 rounded-sm shadow-md z-[9998]">

      {/* Header */}
      <div className="px-4 py-3 border-b border-sand/40 dark:border-zinc-800 flex items-center justify-between">
        <h3 className="font-display font-medium text-sm tracking-tight text-charcoal dark:text-primary">
          {t("cart.header")}
        </h3>
        <button
          onClick={() => setShowCartPopup(false)}
          className="p-1 -mr-1 text-muted hover:text-primary transition-colors duration-150"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isEmpty ? (
        <div className="px-4 py-8 text-center">
          <ShoppingBag className="h-8 w-8 mx-auto text-sand mb-3" />
          <p className="text-sm text-stone dark:text-muted">{t("cart.empty")}</p>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="max-h-64 overflow-y-auto divide-y divide-sand/30 dark:divide-zinc-800">
            {cart?.lines?.edges?.map(({ node }) => (
              <div key={node.id} className="px-4 py-3 flex items-start gap-3">
                {/* Thumbnail */}
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-sand/40 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                  {node.merchandise.product.featuredImage ? (
                    <img
                      src={node.merchandise.product.featuredImage.url || "/placeholder.svg"}
                      alt={node.merchandise.product.featuredImage.altText || node.merchandise.product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[10px] text-muted">{t("common.noImg")}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal dark:text-primary leading-snug line-clamp-1">
                    {node.merchandise.product.title}
                  </p>
                  <p className="text-xs text-stone dark:text-muted mt-0.5">
                    {t("cart.amoun")}: {node.quantity}
                  </p>
                  {(node.attributes ?? []).length > 0 && (
                    <div className="text-xs text-stone dark:text-muted mt-0.5 space-y-0.5">
                      {(node.attributes ?? []).map((attribute, idx) => (
                        <div key={idx}>
                          {attribute.key}: {attribute.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price + delete */}
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-charcoal dark:text-primary tabular-nums">
                    {formatPrice(
                      (Number.parseFloat(node.merchandise.price?.amount ?? "0") * node.quantity).toString(),
                      node.merchandise.price?.currencyCode ?? "EUR"
                    )}
                  </p>
                  <button
                    className="mt-1.5 flex items-center gap-1 text-xs text-muted hover:text-rust transition-colors duration-150"
                    onClick={() => removeItem(node.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>{t("common.delete")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-sand/40 dark:border-zinc-800 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone dark:text-muted">{t("cart.subtotal")}</span>
              <span className="text-sm font-medium text-charcoal dark:text-primary tabular-nums">
                {formatPrice(
                  cart?.estimatedCost?.subtotalAmount?.amount || "0",
                  cart?.estimatedCost?.subtotalAmount?.currencyCode || "EUR"
                )}
              </span>
            </div>

            {/* Shipping note */}
            <div className="flex items-center gap-1.5 text-xs text-stone dark:text-muted">
              <Truck className="h-3.5 w-3.5 shrink-0" />
              <span>{t("cart.shippingCost")}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {cart?.checkoutUrl && (
                <a
                  href={cart.checkoutUrl}
                  rel="noopener noreferrer"
                  className="block w-full bg-rust text-white text-center px-4 py-2.5 rounded-sm text-sm font-medium tracking-[0.03em] hover:bg-rust/90 transition-colors duration-200"
                >
                  {t("cart.checkout")}
                </a>
              )}
              <button
                className="block w-full text-center px-4 py-2 border border-sand/60 dark:border-zinc-700 rounded-sm text-sm font-medium text-stone dark:text-muted hover:border-rust hover:text-rust dark:hover:border-rust dark:hover:text-rust transition-colors duration-200"
                onClick={() => setShowCartPopup(false)}
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPopup;
