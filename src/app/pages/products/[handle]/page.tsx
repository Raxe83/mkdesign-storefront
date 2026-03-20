import { notFound } from "next/navigation";
import type { Product } from "../../../types/shopify";
import { getProductByHandle, getExtraInfoByType, getProducts } from "../../../services/shopify";
import { detectCategory, findMetaType, RELATED_CONFIG } from "@/app/components/product/product-category";
import { HERO_CARDS } from "@/app/components/product/hero-cards-data";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { handle } = await params;

  // ── 1. Produkt laden ──────────────────────────────────────────────────────
  const product = await getProductByHandle(handle, "de");
  if (!product) notFound();

  // ── 2. Kategorie & Metaobject-Typ ableiten ───────────────────────────────
  const category      = detectCategory(product);
  const relatedConfig = RELATED_CONFIG[category];
  const heroCards     = HERO_CARDS[category];

  // Tag-basierter Lookup — präziser als Kategorie-Fallback
  // Early return: null wenn kein Tag im Mapping passt → kein API-Call
  const metaType = findMetaType(product.tags ?? []);

  // ── 3. Sekundäre Daten parallel laden ────────────────────────────────────
  const [extraContent, rawRelated] = await Promise.all([
    metaType ? getExtraInfoByType(metaType) : Promise.resolve([]),
    getProducts(5, undefined, relatedConfig.tag),
  ]);

  const relatedProducts = rawRelated.filter((p: Product) => p.id !== product.id).slice(0, 4);

  // ── 4. Rendern ────────────────────────────────────────────────────────────
  return (
    <ProductDetailClient
      product={product}
      heroCards={heroCards}
      relatedProducts={relatedProducts}
      relatedLabel={relatedConfig.label}
      extraContent={extraContent}
    />
  );
}
