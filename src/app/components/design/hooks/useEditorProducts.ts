"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDesignProducts } from "@/app/services/shopify/products";
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
        const raw = await getDesignProducts();
        const mapped: ProductOption[] = raw.map((p) => {
          const variant = p.variants.edges[0]?.node ?? null;
          const firstZusatz = p.zusatzoptionen?.zusatzprodukte[0] ?? null;
          return {
            id: p.id,
            label: p.title,
            description: (p as { description?: string }).description ?? "",
            backgroundUrl: p.featuredImage?.url ?? null,
            variantId: variant?.id ?? null,
            price: variant
              ? `${parseFloat(variant.price.amount).toFixed(2)} ${variant.price.currencyCode}`
              : "",
            canvasPresetId: getPresetForTitle(p.title).id,
            farben: p.zusatzoptionen?.farben ?? [],
            sideBZusatzprodukt: firstZusatz
              ? {
                  variantId: firstZusatz.defaultVariantId,
                  price: `${parseFloat(firstZusatz.price.amount).toFixed(2)} ${firstZusatz.price.currencyCode}`,
                }
              : null,
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
