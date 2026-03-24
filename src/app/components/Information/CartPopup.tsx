"use client";

import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
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

  useEffect(() => {
    if (!showCartPopup) return;
    const onScroll = () => setShowCartPopup(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showCartPopup, setShowCartPopup]);

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
    <>
      {/* Backdrop — closes popup on outside click */}
      <div
        className="fixed inset-0 z-[9990]"
        onClick={() => setShowCartPopup(false)}
        aria-hidden="true"
      />

      <div className="fixed top-20 right-4 sm:right-8 w-[calc(100vw-2rem)] max-w-sm bg-cream dark:bg-zinc-900 border border-sand/50 dark:border-zinc-800 rounded-sm shadow-md z-[9998]">

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
                .filter(({ node }) => node.attributes?.some(a => a.key === "_linkedTo"))
                .map(({ node }) => node.id)
            );

            const linkedByVariantId = new Map<string, typeof allEdges[number]["node"][]>();
            allEdges.forEach(({ node }) => {
              const linkedTo = node.attributes?.find(a => a.key === "_linkedTo")?.value;
              if (linkedTo) {
                linkedByVariantId.set(linkedTo, [...(linkedByVariantId.get(linkedTo) ?? []), node]);
              }
            });

            const mainEdges = allEdges.filter(({ node }) => !linkedIds.has(node.id));

            return (
              <div className="max-h-72 overflow-y-auto divide-y divide-sand/30 dark:divide-zinc-800">
                {mainEdges.map(({ node }) => {
                  const linkedItems = linkedByVariantId.get(node.merchandise.id) ?? [];
                  const isCustomDesign = (node.attributes ?? []).some(a => a.key === "_design_json");
                  const previewUrl = (node.attributes ?? []).find(a => a.key === "Design-Vorschau")?.value;

                  const handleRemove = async () => {
                    await removeItem(node.id);
                    for (const child of linkedItems) await removeItem(child.id);
                  };

                  return (
                    <div key={node.id} className="px-4 py-3 flex items-start gap-3">
                      {/* Thumbnail */}
                      {isCustomDesign && previewUrl ? (
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-rust/30 bg-stone-50 dark:bg-zinc-800">
                          <img src={previewUrl} alt="Dein Design" className="h-full w-full object-contain p-0.5" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-sand/40 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                          {node.merchandise.product.featuredImage ? (
                            <img
                              src={node.merchandise.product.featuredImage.url}
                              alt={node.merchandise.product.featuredImage.altText || node.merchandise.product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[10px] text-muted">Kein Bild</span>
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
                        ) : (() => {
                          const visible = (node.attributes ?? []).filter(a => !a.key.startsWith("_"));
                          return visible.length > 0 ? (
                            <div className="text-xs text-stone dark:text-muted mt-0.5 space-y-0.5">
                              {visible.map((attr, i) => <div key={i}>{attr.key}: {attr.value}</div>)}
                            </div>
                          ) : null;
                        })()}

                        {/* Zusatzprodukte Sub-Items */}
                        {linkedItems.length > 0 && (
                          <div className="mt-1.5 pt-1.5 border-t border-sand/30 dark:border-zinc-800 space-y-1">
                            {linkedItems.map((child) => (
                              <div key={child.id} className="flex items-center gap-1.5">
                                {child.merchandise.product.featuredImage && (
                                  <img
                                    src={child.merchandise.product.featuredImage.url}
                                    alt={child.merchandise.product.featuredImage.altText ?? child.merchandise.product.title}
                                    className="w-5 h-5 rounded object-cover border border-sand/40 dark:border-zinc-700 shrink-0"
                                  />
                                )}
                                <span className="flex-1 text-[11px] text-stone dark:text-muted truncate">
                                  {child.merchandise.product.title}
                                </span>
                                <span className="text-[11px] text-muted tabular-nums shrink-0">
                                  +{formatPrice(child.merchandise.price?.amount ?? "0", child.merchandise.price?.currencyCode ?? "EUR")}
                                </span>
                                <button onClick={() => removeItem(child.id)} className="text-muted hover:text-rust transition-colors duration-150 shrink-0">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Mengenstepper */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center border border-sand/50 dark:border-zinc-700 rounded-sm overflow-hidden">
                            <button
                              onClick={async () => {
                                if (node.quantity <= 1) return;
                                const newQty = node.quantity - 1;
                                await updateItemQuantityFunction(node.id, newQty);
                                for (const child of linkedItems) await updateItemQuantityFunction(child.id, newQty);
                              }}
                              disabled={node.quantity <= 1}
                              className="h-6 w-6 flex items-center justify-center text-muted hover:text-primary transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Weniger"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="h-6 w-7 flex items-center justify-center text-xs font-medium text-primary tabular-nums border-x border-sand/50 dark:border-zinc-700 select-none">
                              {node.quantity}
                            </span>
                            <button
                              onClick={async () => {
                                const newQty = node.quantity + 1;
                                await updateItemQuantityFunction(node.id, newQty);
                                for (const child of linkedItems) await updateItemQuantityFunction(child.id, newQty);
                              }}
                              className="h-6 w-6 flex items-center justify-center text-muted hover:text-primary transition-colors duration-150"
                              aria-label="Mehr"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <button onClick={handleRemove} className="flex items-center gap-1 text-xs text-muted hover:text-rust transition-colors duration-150">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Preis */}
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium text-charcoal dark:text-primary tabular-nums">
                          {formatPrice(
                            (parseFloat(node.merchandise.price?.amount ?? "0") * node.quantity).toString(),
                            node.merchandise.price?.currencyCode ?? "EUR"
                          )}
                        </p>
                      </div>
                    </div>
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
