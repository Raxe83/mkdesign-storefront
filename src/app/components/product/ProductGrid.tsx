"use client";

import type React from "react";
import type { Product } from "@/app/types/shopify";
import ProductCard from "./ProductCard";
import Skeleton from "@/app/components/ui/Skeleton";
import Link from "next/link";

export interface ProductGridProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  isLoading = false,
  skeletonCount = 6,
}) => {

  if (isLoading) {
    return (
      <div>
        {title && (
          <Skeleton className="h-8 w-48 mb-6" />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">Keine Produkte gefunden.</p>
        <Link
          href="/"
          className="text-sm text-accent hover:underline font-medium"
        >
          Zurück zu den Produkten
        </Link>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="font-display text-2xl font-semibold text-primary mb-6">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
