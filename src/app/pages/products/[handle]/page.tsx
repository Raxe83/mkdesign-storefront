import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Product } from "../../../types/shopify";
import { getProductByHandle, getExtraInfoByType, getFaqByType, getTechnicalSpecsByType, getProducts } from "../../../services/shopify";
import { getShippingOptions } from "../../../services/shopify/shipping";
import { detectCategory, findMetaType, RELATED_CONFIG, type ProductCategory } from "@/app/components/product/product-category";
import { HERO_CARDS } from "@/app/components/product/hero-cards-data";
import { ProductExtraContent } from "@/app/components/product/ProductExtraContent";
import { ProductFaq } from "@/app/components/product/ProductFaq";
import { TechnicalSpecs } from "@/app/components/product/TechnicalSpecs";
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

// ─── Streaming-Sektion für Technische Details ────────────────────────────────

async function TechnicalSpecsSection({ metaType }: { metaType: ProductCategory | null }) {
  const specs = metaType ? await getTechnicalSpecsByType(metaType) : [];
  if (specs.length === 0) return null;
  return <TechnicalSpecs specs={specs} />;
}

function TechnicalSpecsSkeleton() {
  return (
    <div className="mt-12 pt-10 border-t border-zinc-200/60 dark:border-zinc-800 animate-pulse">
      <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800 mb-5" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-200/60 dark:bg-zinc-800 rounded overflow-hidden border border-zinc-200/60 dark:border-zinc-800">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1.5 px-5 py-4 bg-white dark:bg-zinc-950">
            <div className="h-2 w-16 rounded bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 w-24 rounded bg-zinc-300 dark:bg-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Streaming-Sektion für FAQ ────────────────────────────────────────────────

async function FaqSection({ metaType }: { metaType: ProductCategory | null }) {
  const metaobjects = metaType ? await getFaqByType(metaType) : [];
  if (metaobjects.length === 0) return null;
  return <ProductFaq metaobjects={metaobjects} />;
}

function FaqSkeleton() {
  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800 animate-pulse">
      <div className="h-5 w-36 rounded bg-zinc-200 dark:bg-zinc-800 mb-6" />
      <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
        {[0, 1, 2].map((i) => (
          <div key={i} className="py-4 flex items-center justify-between gap-4">
            <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: `${60 + i * 10}%` }} />
            <div className="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle, "de");
  if (!product) return {};

  const image = product.featuredImage;

  return {
    title: product.title,
    description: product.description || undefined,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      ...(image && {
        images: [{ url: image.url, alt: image.altText ?? product.title }],
      }),
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

  // ── 3. Related-Produkte & Versanddaten laden ──────────────────────────────
  const [rawRelated, allProducts] = await Promise.all([
    getProducts(5, undefined, relatedConfig.tag),
    getProducts(20),
  ]);
  const shippingOptions = getShippingOptions(product.tags ?? [], product.productType ?? "");
  const relatedProducts = rawRelated.filter((p: Product) => p.id !== product.id).slice(0, 4);

  // ── 4. Random-Füller: alle Produkte minus aktuelles + bereits verwandte ──
  const relatedIds = new Set([product.id, ...relatedProducts.map((p: Product) => p.id)]);
  const randomProducts = shuffleArray(
    allProducts.filter((p: Product) => !relatedIds.has(p.id))
  ).slice(0, 8);

  // ── 5. Rendern ────────────────────────────────────────────────────────────
  return (
    <ProductDetailClient
      product={product}
      heroCards={heroCards}
      relatedProducts={relatedProducts}
      randomProducts={randomProducts}
      relatedLabel={relatedConfig.label}
      shippingOptions={shippingOptions}
      technicalSpecsSlot={
        <Suspense fallback={<TechnicalSpecsSkeleton />}>
          <TechnicalSpecsSection metaType={metaType} />
        </Suspense>
      }
      extraContentSlot={
        <Suspense fallback={<ExtraContentSkeleton />}>
          <ExtraContentSection metaType={metaType} />
        </Suspense>
      }
      faqSlot={
        <Suspense fallback={<FaqSkeleton />}>
          <FaqSection metaType={metaType} />
        </Suspense>
      }
    />
  );
}
