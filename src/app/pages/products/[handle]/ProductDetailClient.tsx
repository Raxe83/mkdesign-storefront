"use client";

import { useState, useMemo } from "react";
import { parseProductDescription } from "@/app/utils/parseProductDescription";
import { sanitizeRichHtml } from "@/app/utils/sanitizeHtml";
import { TechnicalSpecsModal } from "@/app/components/product/TechnicalSpecsModal";
import { ArrowLeft, Minus, Plus, Truck, RotateCcw, Palette } from "lucide-react";
import Link from "next/link";
import type { Product, CmsShippingOption } from "../../../types/shopify";
import type { HeroCard } from "@/app/components/product/product-category";
import { formatPrice } from "../../../utils/formatPrice";
import { calculateDisplayPrice } from "../../../utils/calculateDisplayPrice";
import AddToCartButton from "../../../components/ui/AddToCartButton";
import { ProductExtras, type ProductExtrasValues } from "@/app/components/product/ProductExtras";
import { ProductReviews } from "@/app/components/product/product-reviews";
import { ProductHeroCards } from "@/app/components/product/ProductHeroCards";
import { RelatedProducts } from "@/app/components/product/RelatedProducts";
import { Personalization } from "@/app/components/Personalization";
import type { BarrelVariant } from "@/app/components/PersonalizationVisual";
import ImageGallery from "./ImageGallery";
import Button from "@/app/components/ui/Button";
import { ShareButtons } from "@/app/components/product/ShareButtons";
import { WishlistButton } from "@/app/components/ui/WishlistButton";

/** Maps product tags + title to the matching barrel illustration variant. */
function variantFromProduct(tags: string[], title: string): BarrelVariant {
  // Combine tags and title into one searchable string (lowercase, kebab normalised)
  const haystack = [...tags, title]
    .map((s) => s.toLowerCase().replace(/-/g, " "))
    .join(" ");

  // Order matters: check more specific terms first
  if (haystack.includes("schale xl") || haystack.includes("xl schale"))
    return "schaleXL";
  if (
    haystack.includes("schale") ||
    haystack.includes("feuerschale") ||
    haystack.includes("bowl")
  )
    return "schale";
  if (
    haystack.includes("stehtisch") ||
    haystack.includes("tisch") ||
    haystack.includes("table") ||
    haystack.includes("platte")
  )
    return "stehtisch";
  if (haystack.includes("feuertonne") || haystack.includes("no leg"))
    return "noLegs";
  return "full";
}

const FALLBACK_STANDARD: CmsShippingOption = { zone: "Deutschland", method: "Standard", days: "2–4 Werktage", price: "5,90 €", freeFrom: "250,00 €", isStandard: true, isExpress: false, sortOrder: 0 };

interface Props {
  product: Product;
  heroCards: HeroCard[];
  relatedProducts: Product[];
  randomProducts?: Product[];
  relatedLabel: string;
  shippingOptions?: CmsShippingOption[] | null;
  technicalSpecsSlot?: React.ReactNode;
  extraContentSlot?: React.ReactNode;
  faqSlot?: React.ReactNode;
}

export default function ProductDetailClient({
  product,
  heroCards,
  relatedProducts,
  randomProducts,
  relatedLabel,
  shippingOptions,
  technicalSpecsSlot,
  extraContentSlot,
  faqSlot,
}: Props) {
  const standardShipping = shippingOptions?.find((o) => o.isStandard) ?? FALLBACK_STANDARD;
  const barrelVariant = variantFromProduct(product.tags, product.title);
  const images = (product.images?.edges ?? []).map((e) => e.node);
  const firstVariant = product.variants.edges[0]?.node;
  const price =
    firstVariant?.price.amount ?? product.priceRange.minVariantPrice.amount;
  const currencyCode =
    firstVariant?.price.currencyCode ??
    product.priceRange.minVariantPrice.currencyCode;
  const isAvailable = firstVariant?.availableForSale ?? false;
  const initialImage = product.featuredImage?.url ?? images[0]?.url ?? "";

  const [quantity, setQuantity] = useState(1);
  const [extrasValues, setExtrasValues] = useState<ProductExtrasValues>({
    textfelder: [],
    zusatzprodukte: [],
    optionen: [],
    entscheid: "",
    farbe: "",
  });

  const displayPrice = useMemo(
    () => calculateDisplayPrice(price, currencyCode, extrasValues.zusatzprodukte),
    [extrasValues.zusatzprodukte, price, currencyCode],
  );

  const { mainHtml, specs } = useMemo(
    () => parseProductDescription(product.descriptionHtml || `<p>${product.description}</p>`),
    [product.descriptionHtml, product.description]
  );

  const extrasValid = useMemo(() => {
    const cfg = product.zusatzoptionen;
    if (!cfg) return true;
    const textsOk     = cfg.textfelder.every((_, i) => extrasValues.textfelder[i]?.trim());
    const optionenOk  = cfg.optionen.length === 0 || extrasValues.optionen.length > 0;
    const entscheidOk = cfg.entscheide.length === 0 || extrasValues.entscheid.trim() !== "";
    return textsOk && optionenOk && entscheidOk;
  }, [product.zusatzoptionen, extrasValues]);

  return (
    <div className="pb-8 -mt-8">
      {/* Back */}
      <Link
        href="/pages/products"
        className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors duration-200 mb-10 text-sm"
      >
        <ArrowLeft size={14} />
        Zurück zu den Produkten
      </Link>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
        <ImageGallery
          images={images}
          productTitle={product.title}
          initialImage={initialImage}
        />

        {/* Product info */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-primary dark:text-neutral-100 leading-tight flex-1">
              {product.title}
            </h1>
            <WishlistButton
              product={{
                handle: product.handle,
                title: product.title,
                imageUrl: product.featuredImage?.url,
                price,
                currencyCode,
              }}
              size={22}
              className="mt-1 shrink-0 p-1.5"
            />
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="text-[10px] font-mono bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded px-2 py-1.5 space-y-0.5">
              <p><span className="font-bold">productType:</span> {product.productType || "—"}</p>
              <p><span className="font-bold">tags:</span> {product.tags?.join(", ") || "—"}</p>
              <p><span className="font-bold">Profil:</span> {shippingOptions == null ? "❌ kein Match" : "✅ " + (shippingOptions[0]?.method ?? "")}</p>
            </div>
          )}

          <p className="text-2xl font-medium text-primary dark:text-neutral-100">
            {formatPrice(displayPrice.amount, displayPrice.currencyCode)}
          </p>

          <ProductReviews
            productId={product.id}
            productHandle={product.handle}
            short
          />

          <hr className="border-zinc-200/60 dark:border-zinc-800" />

          {mainHtml && (
            <div
              className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(mainHtml) }}
            />
          )}

          {/* ── Dynamische Zusatzoptionen (aus Shopify Metaobjekt) ── */}
          {product.zusatzoptionen && (
            <ProductExtras
              config={product.zusatzoptionen}
              onChange={setExtrasValues}
            />
          )}

          <div>
            <p className="text-xs uppercase tracking-widest text-muted dark:text-neutral-400 mb-2">
              Menge
            </p>
            <div className="inline-flex items-center border border-zinc-200 dark:border-zinc-700 rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Menge verringern"
                disabled={quantity <= 1}
                className="p-2.5 text-muted hover:text-primary dark:hover:text-neutral-100 transition-colors duration-150 disabled:opacity-30"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium text-primary dark:text-neutral-100 select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Menge erhöhen"
                className="p-2.5 text-muted hover:text-primary dark:hover:text-neutral-100 transition-colors duration-150"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {isAvailable ? (
            <AddToCartButton
              variantId={firstVariant.id}
              available={isAvailable}
              title={product.title}
              color={extrasValues.farbe}
              quantity={quantity}
              formValid={extrasValid}
              metaZusatzprodukte={extrasValues.zusatzprodukte}
              customAttributes={[
                ...(product.zusatzoptionen?.textfelder ?? [])
                  .map((label, i) => ({ key: label, value: extrasValues.textfelder[i] ?? "" }))
                  .filter((a) => a.value.trim() !== ""),
                ...(extrasValues.zusatzprodukte.length > 0
                  ? [{ key: "_zusatzprodukte", value: extrasValues.zusatzprodukte.map((v) => v.title).join(", ") }]
                  : []),
                ...(extrasValues.optionen.length > 0
                  ? [{ key: "Optionen", value: extrasValues.optionen.join(", ") }]
                  : []),
                ...(extrasValues.entscheid
                  ? [{ key: "Auswahl", value: extrasValues.entscheid }]
                  : []),
              ]}
              icon
            />
          ) : (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              Nicht verfügbar
            </p>
          )}
          <Button variant={"outline"}>
            <Link href={`/pages/design?product=${encodeURIComponent(product.id)}`} className="flex flow-row items-center">
              <Palette size={15} className="shrink-0" />
              <span className="ml-2">Eigenes Design</span>
            </Link>
          </Button>

          <div className="space-y-2.5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
            {shippingOptions === null ? (
              <div className="flex items-center gap-2.5 text-sm text-muted dark:text-neutral-400">
                <Truck size={15} className="shrink-0" />
                <span>Versand wird im Checkout berechnet</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-sm text-muted dark:text-neutral-400">
                <Truck size={15} className="shrink-0" />
                <span>
                  {standardShipping.method}: {standardShipping.days} — {standardShipping.price}
                  {standardShipping.freeFrom && (
                    <span className="ml-1 text-xs opacity-70">(ab {standardShipping.freeFrom} kostenlos)</span>
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-sm text-muted dark:text-neutral-400">
              <RotateCcw size={15} className="shrink-0" />
              <span>30 Tage kostenlose Rückgabe</span>
            </div>
          </div>

          <ShareButtons title={product.title} imageUrl={product.featuredImage?.url} />
        </div>
      </div>

      {/* ── Technische Details (CMS-Metaobject, Fallback: geparste Beschreibung) ── */}
      {technicalSpecsSlot ?? (specs.length > 0 && <TechnicalSpecsModal specs={specs} />)}

      {/* ── Extra Content (RSC-Slot mit Suspense-Skeleton aus page.tsx) ── */}
      {extraContentSlot}

      {/* ── FAQ (RSC-Slot mit Suspense-Skeleton aus page.tsx) ── */}
      {faqSlot}

      {/* ── Hero-Karten ── */}
      {/* <div className="mt-16">
        <ProductHeroCards product={product} cards={heroCards} />
      </div> */}

      {/* ── Design Editor CTA ── */}
      <div className="mt-16 -mx-6 md:-mx-10 lg:-mx-16">
        <Personalization
          sectionLabel="Design Editor"
          title="Motiv selbst<br/><em>gestalten</em>"
          description="Nutzt unseren kostenlosen Design Editor, um Euer eigenes Motiv direkt am Bildschirm zu erstellen — Text, Formen oder eigene Bilder."
          steps={[
            {
              step: 1,
              title: "Produkt auswählen",
              description: "Wählt das passende Produkt direkt im Editor aus.",
            },
            {
              step: 2,
              title: "Motiv erstellen",
              description:
                "Text, Formen oder eigene Bilder – alles per Drag & Drop.",
            },
            {
              step: 3,
              title: "Design speichern & bestellen",
              description:
                "Design speichern, in den Warenkorb legen und fertig.",
            },
          ]}
          cta={{ label: "Zum Design Editor", href: "/pages/design" }}
          image={{ src: "", alt: "" }}
          pullQuote={"„Dein Unikat, dein Design\u201C"}
          disableBackground
          variant={barrelVariant}
        />
      </div>

      {/* ── Ähnliche Produkte ── */}
      {(relatedProducts.length > 0 || (randomProducts?.length ?? 0) > 0) && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-medium text-primary dark:text-neutral-100 mb-5">
            {relatedLabel}
          </h2>
          <RelatedProducts products={relatedProducts} randomProducts={randomProducts} />
        </div>
      )}

      {/* ── Kundenbewertungen ── */}
      <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800">
        <ProductReviews productId={product.id} productHandle={product.handle} />
      </div>
    </div>
  );
}
