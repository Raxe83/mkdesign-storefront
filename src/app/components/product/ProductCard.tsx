"use client";

import type { Product } from "@/app/types/shopify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import Price from "@/app/components/ui/Price";
import Badge from "@/app/components/ui/Badge";
import Skeleton from "@/app/components/ui/Skeleton";
import AddToCartButton from "@/app/components/ui/AddToCartButton";
import ColorChooser from "./ColorChooser";

export interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}

const ProductCard = ({ product, isLoading = false }: ProductCardProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("Schwarz");
  const [t] = useTranslation();

  if (isLoading) {
    return <Skeleton.Card />;
  }

  const firstVariant = product.variants.edges[0]?.node;
  const available = firstVariant?.availableForSale ?? false;
  const price = product.priceRange.minVariantPrice.amount;
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;

  return (
    <div className="group border border-zinc-200/60 dark:border-zinc-800 rounded overflow-hidden bg-white dark:bg-zinc-900 flex flex-col transition-shadow duration-200 hover:shadow-md">
      <Link
        href={`/pages/products/${product.handle}`}
        prefetch={false}
        className="block relative"
      >
        {/* Badge */}
        {!available && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="soldout">{t("product.notAvailable")}</Badge>
          </div>
        )}

        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              width={600}
              height={450}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-muted">{t("common.noImg")}</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="p-4 pb-2">
          <h3 className="font-display font-medium text-primary leading-snug line-clamp-2">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Color chooser */}
      <div className="px-0 pt-1">
        <ColorChooser
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2 flex flex-row justify-between items-center gap-4 mt-auto">
        <Price amount={price} currencyCode={currencyCode} className="text-lg" />
        <AddToCartButton
          variantId={firstVariant?.id ?? ""}
          available={available}
          color={selectedColor}
          title={product.title}
          icon
        />
      </div>
    </div>
  );
};

export default ProductCard;
