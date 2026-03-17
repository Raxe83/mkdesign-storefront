"use client";

import type { Product } from "@/app/types/shopify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import Price from "@/app/components/ui/Price";
import Skeleton from "@/app/components/ui/Skeleton";
import AddToCartButton from "@/app/components/ui/AddToCartButton";
import { ShoppingBag } from "lucide-react";

export interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}

const ProductCard = ({ product, isLoading = false }: ProductCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [t] = useTranslation();

  if (isLoading) return <Skeleton.Card />;

  const firstVariant = product.variants.edges[0]?.node;
  const available = firstVariant?.availableForSale ?? false;
  const price = product.priceRange.minVariantPrice.amount;
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;
  const variantCount = product.variants.edges.length;
  const hasMultipleVariants = variantCount > 1;

  return (
    <div className="group flex flex-col">
      {/* ── Image ── */}
      <div className="relative overflow-hidden rounded aspect-[4/5] bg-zinc-100 dark:bg-zinc-800">
        <Link
          href={`/pages/products/${product.handle}`}
          prefetch={false}
          className="block w-full h-full"
        >
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
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

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
        </Link>

        {/* Badges top-left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {!available && (
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium bg-zinc-900/80 text-white dark:bg-zinc-100/90 dark:text-zinc-900 rounded-sm">
              {t("product.notAvailableShort")}
            </span>
          )}
          {product.productType && (
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium bg-white/85 dark:bg-zinc-800/85 text-muted rounded-sm backdrop-blur-sm">
              {product.productType}
            </span>
          )}
        </div>

        {/* Variant count badge top-right */}
        {hasMultipleVariants && (
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span className="px-2 py-0.5 text-[10px] font-medium bg-white/85 dark:bg-zinc-800/85 text-muted rounded-sm backdrop-blur-sm">
              {variantCount} Var.
            </span>
          </div>
        )}

        {/* Add-to-cart — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <AddToCartButton
            variantId={firstVariant?.id ?? ""}
            available={available}
            title={product.title}
          />
        </div>
      </div>

      {/* ── Info ── */}
      <div className="pt-2.5 px-0.5 flex items-baseline justify-between gap-2">
        <Link
          href={`/pages/products/${product.handle}`}
          prefetch={false}
          className="min-w-0"
        >
          <h3 className="font-display font-medium text-primary text-sm leading-snug line-clamp-1 hover:text-accent transition-colors duration-200">
            {product.title}
          </h3>
        </Link>
        <Price
          amount={price}
          currencyCode={currencyCode}
          className="text-sm shrink-0 text-muted tabular-nums"
        />
      </div>
    </div>
  );
};

export default ProductCard;
