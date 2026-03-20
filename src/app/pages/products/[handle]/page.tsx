import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Product } from "../../../types/shopify";
import { getProductByHandle, getExtraInfoByType, getProducts } from "../../../services/shopify";
import { detectCategory, findMetaType, RELATED_CONFIG, type ProductCategory } from "@/app/components/product/product-category";
import { HERO_CARDS } from "@/app/components/product/hero-cards-data";
import { ProductExtraContent } from "@/app/components/product/ProductExtraContent";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ handle: string }>;
}

// ─── Streaming-Sektion für Metaobject-Inhalte ─────────────────────────────────

async function ExtraContentSection({ metaType }: { metaType: ProductCategory | null }) {
  const metaobjects = metaType ? await getExtraInfoByType(metaType) : [];
  if (metaobjects.length === 0) return null;
  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800">
      <ProductExtraContent metaobjects={metaobjects} />
    </div>
  );
}

function ExtraContentSkeleton() {
  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800">
      <div className="flex flex-col overflow-hidden rounded border border-stone-200/50 dark:border-zinc-700/50">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-200/40 dark:divide-zinc-700/40">
            <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[300px] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center px-8 md:px-14 py-10 md:py-14 bg-zinc-100 dark:bg-zinc-900 animate-pulse">
              <div className="h-3 w-16 rounded bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-7 w-3/4 rounded bg-zinc-300 dark:bg-zinc-700" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-3 w-5/6 rounded bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-3 w-4/6 rounded bg-zinc-300 dark:bg-zinc-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({ params }: Props) {
  const { handle } = await params;

  // ── 1. Produkt laden ──────────────────────────────────────────────────────
  const product = await getProductByHandle(handle, "de");
  if (!product) notFound();

  // ── 2. Kategorie & Metaobject-Typ ableiten ───────────────────────────────
  const category      = detectCategory(product);
  const relatedConfig = RELATED_CONFIG[category];
  const heroCards     = HERO_CARDS[category];
  const metaType      = findMetaType(product.tags ?? []);

  // ── 3. Related-Produkte laden (extra_info streamt separat) ────────────────
  const rawRelated = await getProducts(5, undefined, relatedConfig.tag);
  const relatedProducts = rawRelated.filter((p: Product) => p.id !== product.id).slice(0, 4);

  // ── 4. Rendern ────────────────────────────────────────────────────────────
  return (
    <ProductDetailClient
      product={product}
      heroCards={heroCards}
      relatedProducts={relatedProducts}
      relatedLabel={relatedConfig.label}
      extraContentSlot={
        <Suspense fallback={<ExtraContentSkeleton />}>
          {/* @ts-ignore */}
          <ExtraContentSection metaType={metaType} />
        </Suspense>
      }
    />
  );
}
