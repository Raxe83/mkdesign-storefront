"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/app/services/shopify";
import { getPresetForTitle } from "../constants";
import type { ProductOption } from "../types";

export function useEditorProducts() {
  const [products, setProducts]             = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        const raw = await getProducts(50, undefined, "CustomDesign");
        const mapped: ProductOption[] = raw.map((p) => {
          const variant = p.variants.edges[0]?.node ?? null;
          return {
            id: p.id,
            label: p.title,
            backgroundUrl: p.featuredImage?.url ?? null,
            variantId: variant?.id ?? null,
            price: variant
              ? `${parseFloat(variant.price.amount).toFixed(2)} ${variant.price.currencyCode}`
              : "",
            canvasPresetId: getPresetForTitle(p.title).id,
          };
        });
        setProducts(mapped);
        const targetId = searchParams.get("product");
        const preselected = targetId ? mapped.find((p) => p.id === targetId) ?? null : null;
        setSelectedProduct(preselected ?? mapped[0] ?? null);
      } catch {
        // silently fail — products list stays empty
      } finally {
        setProductsLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { products, productsLoading, selectedProduct, setSelectedProduct };
}
