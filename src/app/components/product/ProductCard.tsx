"use client";

import type { Product } from "@/app/types/shopify";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import Price from "@/app/components/ui/Price";
import Skeleton from "@/app/components/ui/Skeleton";
import { shopifyImageUrl } from "@/app/utils/shopifyImage";
import { WishlistButton } from "@/app/components/ui/WishlistButton";

export interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
  priority?: boolean;
}

// ─── Inline cart button ───────────────────────────────────────────────────────

function CartButton({
  variantId,
  available,
  title,
}: {
  variantId: string;
  available: boolean;
  title: string;
}) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variantId || !available || state !== "idle") return;
    setState("loading");
    try {
      await addItem(variantId, 1, []);
      setState("done");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      addToast("Fehler beim Hinzufügen", "error");
      setState("idle");
    }
  };

  if (!available) return null;

  return (
    <button
      onClick={handle}
      aria-label={`${title} in den Warenkorb`}
      disabled={state === "loading"}
      className="h-10 w-full flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest rounded-sm border border-zinc-200 dark:border-zinc-700 text-muted hover:border-rust hover:text-rust transition-colors duration-200 disabled:opacity-40"
    >
      {state === "done" ? "Hinzugefügt" : "Kaufen"}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const ProductCard = ({ product, isLoading = false, priority = false }: ProductCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (isLoading) return <Skeleton.Card />;

  const firstVariant = product.variants.edges[0]?.node;
  const available    = firstVariant?.availableForSale ?? false;
  const price        = product.priceRange.minVariantPrice.amount;
  const currency     = product.priceRange.minVariantPrice.currencyCode;
  const hasMultipleVariants = product.variants.edges.length > 1;

  const wishlistItem = {
    handle: product.handle,
    title: product.title,
    imageUrl: product.featuredImage?.url,
    price,
    currencyCode: currency,
  };

  // Pick a tag badge: first meaningful tag or productType
  const badgeTag = product.tags?.find(
    (t) => !t.toLowerCase().includes("hidden") && t.length < 20,
  );
  const badge = badgeTag ?? product.productType ?? null;

  return (
    <div className="group flex flex-col rounded border border-zinc-200 dark:border-zinc-800 bg-background overflow-hidden dark:hover:border-zinc-700 transition-all duration-200">

      {/* ── Image ──────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <Link href={`/pages/products/${product.handle}`} prefetch={false} className="block w-full h-full">
          {product.featuredImage ? (
            <Image
              src={shopifyImageUrl(product.featuredImage.url, 800) ?? product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              priority={priority}
              onLoad={() => setImgLoaded(true)}
              className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag size={28} className="text-zinc-300 dark:text-zinc-600" />
            </div>
          )}
        </Link>

        {/* Badge top-left */}
        {badge && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium bg-white/85 dark:bg-zinc-800/85 text-muted rounded-sm backdrop-blur-sm pointer-events-none">
            {badge}
          </span>
        )}

        {/* Wishlist button — bottom right, only visible on hover (always visible when saved) */}
        <WishlistButton
          product={wishlistItem}
          size={15}
          hideWhenUnsaved
          className="absolute bottom-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/85 dark:bg-zinc-800/85 backdrop-blur-sm shadow-sm"
        />

        {/* Unavailable top-right */}
        {!available && (
          <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium bg-zinc-900/80 text-white dark:bg-zinc-100/90 dark:text-zinc-900 rounded-sm pointer-events-none">
            Vergriffen
          </span>
        )}

        {/* Multiple variants top-right (when available) */}
        {available && hasMultipleVariants && (
          <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 text-[10px] font-medium bg-white/85 dark:bg-zinc-800/85 text-muted rounded-sm backdrop-blur-sm pointer-events-none">
            {product.variants.edges.length} Var.
          </span>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 flex-1">

        {/* Category label */}
        {product.productType && (
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-accent">
            {product.productType}
          </p>
        )}

        {/* Title */}
        <Link href={`/pages/products/${product.handle}`} prefetch={false}>
          <h3 className="font-display font-medium text-primary text-base leading-snug line-clamp-2 hover:text-accent transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-muted leading-relaxed line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Price + actions */}
        <div className="flex flex-col gap-3 pt-3 mt-auto border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-baseline gap-1">
            {hasMultipleVariants && (
              <span className="text-[10px] text-muted shrink-0">ab</span>
            )}
            <Price
              amount={price}
              currencyCode={currency}
              className="text-sm font-medium text-primary tabular-nums"
            />
          </div>

          <div className={`grid gap-2 ${available ? "grid-cols-2" : "grid-cols-1"}`}>
            <CartButton
              variantId={firstVariant?.id ?? ""}
              available={available}
              title={product.title}
            />
            <Link
              href={`/pages/products/${product.handle}`}
              prefetch={false}
              className="h-10 w-full flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest border border-zinc-300 dark:border-zinc-600 text-primary rounded-sm hover:border-accent hover:text-accent transition-colors duration-200"
            >
              Ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
