"use client";

import { useEffect } from "react";
import { ShoppingBag, Truck, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { Loader } from "../Loader";
import CartPopupItem from "../cart/CartPopupItem";

const CartPopup = () => {
  const { cart, isLoading, showCartPopup, setShowCartPopup } = useCart();

  useEffect(() => {
    if (!showCartPopup) return;
    const onScroll = () => setShowCartPopup(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showCartPopup, setShowCartPopup]);

  if (!showCartPopup) return null;

  const isEmpty = !cart || cart.lines.edges.length === 0;

  if (isLoading && isEmpty) {
    return <Loader />;
  }


  const subtotal =
    !isEmpty && cart?.estimatedCost?.subtotalAmount?.amount
      ? Number.parseFloat(cart.estimatedCost.subtotalAmount.amount)
      : 0;

  const currencyCode =
    !isEmpty && cart?.estimatedCost?.totalAmount?.currencyCode
      ? cart.estimatedCost.totalAmount.currencyCode
      : "EUR";

  return (
    <>
      {/* Backdrop — closes popup on outside click */}
      <div
        className="fixed inset-0 z-[9990]"
        onClick={() => setShowCartPopup(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        className="fixed top-20 right-4 sm:right-8 w-[calc(100vw-2rem)] max-w-sm bg-cream dark:bg-zinc-900 border border-sand/50 dark:border-zinc-800 rounded-sm shadow-md z-[9998]"
      >

      {/* Header */}
      <div className="px-4 py-3 border-b border-sand/40 dark:border-zinc-800 flex items-center justify-between">
        <h3 className="font-display font-medium text-sm tracking-tight text-charcoal dark:text-primary">
          Warenkorb
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
          <p className="text-sm text-stone dark:text-muted">Dein Warenkorb ist leer</p>
        </div>
      ) : (
        <>
          {/* Items */}
          {(() => {
            const allEdges = cart?.lines?.edges ?? [];

            const linkedIds = new Set(
              allEdges
                .filter(({ node }) => node.attributes?.some((a) => a.key === "_linkedTo"))
                .map(({ node }) => node.id)
            );

            // Zusatzprodukt-Zeilen nach ihrem `_linkedTo`-Wert (= `_lineGroup`
            // der Hauptzeile) gruppieren. BEWUSST kein Fallback auf die
            // Varianten-ID mehr — das verklebte sonst neue, unverlinkte
            // Zeilen derselben Variante mit älteren Zusatzprodukt-Zeilen.
            const linkedByGroup = new Map<string, typeof allEdges[number]["node"][]>();
            allEdges.forEach(({ node }) => {
              const linkedTo = node.attributes?.find((a) => a.key === "_linkedTo")?.value;
              if (linkedTo) {
                linkedByGroup.set(linkedTo, [...(linkedByGroup.get(linkedTo) ?? []), node]);
              }
            });

            const mainEdges = allEdges.filter(({ node }) => !linkedIds.has(node.id));

            return (
              <div className="max-h-72 overflow-y-auto divide-y divide-sand/30 dark:divide-zinc-800">
                {mainEdges.map(({ node }) => {
                  const groupKey = node.attributes?.find((a) => a.key === "_lineGroup")?.value;
                  return (
                    <CartPopupItem
                      key={node.id}
                      node={node}
                      linkedItems={groupKey ? linkedByGroup.get(groupKey) ?? [] : []}
                    />
                  );
                })}
              </div>
            );
          })()}

          {/* Footer */}
          <div className="px-4 py-4 border-t border-sand/40 dark:border-zinc-800 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone dark:text-muted">Zwischensumme</span>
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
              <span>Versandkosten werden an der Kasse berechnet.</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {cart?.checkoutUrl && (
                <a
                  href={cart.checkoutUrl}
                  rel="noopener noreferrer"
                  className="block w-full bg-rust text-white text-center px-4 py-2.5 rounded-sm text-sm font-medium tracking-[0.03em] hover:bg-rust/90 transition-colors duration-200"
                >
                  Zur Kasse
                </a>
              )}
              <Link
                href="/pages/cart"
                onClick={() => setShowCartPopup(false)}
                className="block w-full text-center px-4 py-2 border border-sand/60 dark:border-zinc-700 rounded-sm text-sm font-medium text-stone dark:text-muted hover:border-rust hover:text-rust dark:hover:border-rust dark:hover:text-rust transition-colors duration-200"
              >
                Zum Einkaufswagen
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default CartPopup;
