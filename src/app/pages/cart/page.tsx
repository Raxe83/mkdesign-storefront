"use client";

import {
  ArrowLeft,
  Package,
  Shield,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CartItemSkeleton() {
  return (
    <div className="p-5 sm:p-6 flex items-start gap-4 animate-pulse">
      <div className="h-20 w-20 shrink-0 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-7 w-24 rounded bg-zinc-100 dark:bg-zinc-800 mt-3" />
      </div>
      <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0" />
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const CartPage = () => {
  const { cart, isLoading, removeItem, updateItemQuantityFunction } = useCart();
  const [t] = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isEmpty = !cart || cart.lines.edges.length === 0;
  const itemCount =
    cart?.lines.edges.reduce((s, { node }) => s + node.quantity, 0) ?? 0;

  if (!mounted)
    return (
      <div className="pb-16">
        <PageHeader
          title={t("cart.header")}
          eyebrow="Deine Auswahl"
          breadcrumbs={[
            { label: "Start", href: "/" },
            { label: t("cart.header") },
          ]}
          singularLabel="Artikel"
          pluralLabel="Artikel"
          isLoading
        />
      </div>
    );

  return (
    <div className="pb-16">
      <PageHeader
        title={t("cart.header")}
        eyebrow="Deine Auswahl"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: t("cart.header") },
        ]}
        count={isLoading ? undefined : itemCount}
        totalCount={isLoading ? undefined : itemCount}
        singularLabel="Artikel"
        pluralLabel="Artikel"
        isLoading={isLoading}
      />

      {/* ── Empty state ──────────────────────────────────────────── */}
      {!isLoading && isEmpty && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-sand/30 dark:bg-zinc-800 flex items-center justify-center">
            <ShoppingBag size={32} className="text-muted" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-xl text-primary mb-2">
              {t("cart.empty")}
            </h2>
            <p className="text-sm text-muted">{t("cart.addProducts")}</p>
          </div>
          <Link
            href="/pages/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rust text-white text-sm font-medium rounded-sm hover:bg-rust/90 transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            {t("product.discoverProducts")}
          </Link>
        </div>
      )}

      {/* ── Cart layout ──────────────────────────────────────────── */}
      {(isLoading || !isEmpty) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ── Items column ─────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="rounded-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-background">
              {/* List header */}
              <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.08em]">
                  {t("cart.articles")}
                </h2>
                {!isLoading && (
                  <span className="text-xs text-muted tabular-nums">
                    {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
                  </span>
                )}
              </div>

              {/* Items */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {isLoading
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <CartItemSkeleton key={i} />
                    ))
                  : cart?.lines?.edges?.map(({ node }, index) => {
                      const lineTotal = (
                        parseFloat(node.merchandise.price?.amount ?? "0") *
                        node.quantity
                      ).toString();

                      return (
                        <div
                          key={node.id}
                          className="p-5 sm:p-6 flex items-start gap-4 opacity-0 animate-gift-in"
                          style={{
                            animationDelay: `${index * 60}ms`,
                            animationFillMode: "forwards",
                          }}
                        >
                          {/* Thumbnail */}
                          <Link
                            href={`/pages/products/${node.merchandise.product.handle}`}
                            className="h-20 w-20 shrink-0 rounded-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800 hover:opacity-80 transition-opacity duration-200"
                          >
                            {node.merchandise.product.featuredImage ? (
                              <img
                                src={node.merchandise.product.featuredImage.url}
                                alt={
                                  node.merchandise.product.featuredImage
                                    .altText || node.merchandise.product.title
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingBag size={18} className="text-muted" />
                              </div>
                            )}
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/pages/products/${node.merchandise.product.handle}`}
                            >
                              <h3 className="font-display font-medium text-primary text-sm leading-snug hover:text-accent transition-colors duration-150 line-clamp-2">
                                {node.merchandise.product.title}
                              </h3>
                            </Link>

                            {node.merchandise.title !== "Default Title" && (
                              <p className="mt-0.5 text-xs text-muted">
                                {node.merchandise.title}
                              </p>
                            )}

                            {(node.attributes ?? []).length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {(node.attributes ?? []).map((attr) => (
                                  <p
                                    key={attr.key}
                                    className="text-xs text-muted"
                                  >
                                    {attr.key}: {attr.value}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Quantity stepper */}
                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-sm overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateItemQuantityFunction(
                                      node.id,
                                      node.quantity - 1,
                                    )
                                  }
                                  disabled={node.quantity <= 1}
                                  className="h-7 w-7 flex items-center justify-center text-muted hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none"
                                  aria-label="Weniger"
                                >
                                  −
                                </button>
                                <span className="h-7 w-8 flex items-center justify-center text-xs font-medium text-primary tabular-nums border-x border-zinc-200 dark:border-zinc-700 select-none">
                                  {node.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateItemQuantityFunction(
                                      node.id,
                                      node.quantity + 1,
                                    )
                                  }
                                  className="h-7 w-7 flex items-center justify-center text-muted hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150 text-base leading-none"
                                  aria-label="Mehr"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(node.id)}
                                className="flex items-center gap-1 text-xs text-muted hover:text-rust transition-colors duration-150"
                              >
                                <Trash2 size={13} />
                                {t("common.delete")}
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-medium text-primary tabular-nums">
                              {formatPrice(
                                lineTotal,
                                node.merchandise.price?.currencyCode ?? "EUR",
                              )}
                            </p>
                            <p className="text-[11px] text-muted mt-0.5 tabular-nums">
                              {formatPrice(
                                node.merchandise.price?.amount ?? "0",
                                node.merchandise.price?.currencyCode ?? "EUR",
                              )}{" "}
                              / Stk.
                            </p>
                          </div>
                        </div>
                      );
                    })}
              </div>

              {/* Footer */}
              {!isLoading && (
                <div className="px-5 sm:px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <Link
                    href="/pages/products"
                    className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors duration-150"
                  >
                    <ArrowLeft size={13} />
                    Weiter einkaufen
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Summary column ───────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {/* Charcoal header — the highlight */}
              <div className="bg-charcoal px-6 py-5 relative overflow-hidden">
                {/* subtle rust glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-rust/10 via-transparent to-transparent pointer-events-none" />
                <h2 className="font-display font-semibold text-white text-base tracking-tight relative">
                  {t("cart.summary")}
                </h2>
                {!isLoading && (
                  <p className="text-white/45 text-xs mt-0.5 relative">
                    {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"} im
                    Warenkorb
                  </p>
                )}
                {/* Rust accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-rust via-rust/30 to-transparent" />
              </div>

              <div className="bg-background px-5 sm:px-6 py-5 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    {t("cart.subtotal")}
                  </span>
                  {isLoading ? (
                    <div className="h-4 w-20 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                  ) : (
                    <span className="text-sm font-medium text-primary tabular-nums">
                      {cart?.estimatedCost?.subtotalAmount
                        ? formatPrice(
                            cart.estimatedCost.subtotalAmount.amount,
                            cart.estimatedCost.subtotalAmount.currencyCode,
                          )
                        : "0,00 €"}
                    </span>
                  )}
                </div>

                {/* Shipping */}
                <div className="flex items-start gap-2 text-xs text-muted">
                  <Truck size={14} className="shrink-0 mt-0.5" />
                  <span>{t("cart.shippingCost")}</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {t("cart.total")}
                  </span>
                  {isLoading ? (
                    <div className="h-5 w-24 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                  ) : (
                    <span className="text-base font-semibold text-primary tabular-nums">
                      {cart?.estimatedCost?.subtotalAmount
                        ? formatPrice(
                            cart.estimatedCost.subtotalAmount.amount,
                            cart.estimatedCost.subtotalAmount.currencyCode,
                          )
                        : "0,00 €"}
                    </span>
                  )}
                </div>

                {/* Checkout CTA */}
                {cart?.checkoutUrl && (
                  <a
                    href={cart.checkoutUrl}
                    rel="noopener noreferrer"
                    className="block w-full bg-rust text-white text-center px-4 py-3 rounded-sm text-sm font-semibold tracking-[0.03em] hover:bg-rust/90 active:scale-[0.98] transition-all duration-200 mt-2"
                  >
                    {t("cart.checkout")}
                  </a>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Shield size={13} className="shrink-0 text-accent" />
                    Sichere Zahlung
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Truck size={13} className="shrink-0 text-accent" />
                    Versandinfos
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted col-span-2">
                    <Package size={13} className="shrink-0 text-accent" />
                    Handgefertigt & direkt versendet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
