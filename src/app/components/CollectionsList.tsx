import Image from "next/image";
import Link from "next/link";
import { cn } from "../utils/utils";
import { shopifyImageUrl } from "../utils/shopifyImage";
import { sanitizeInlineHtml } from "../utils/sanitizeHtml";

// ─── Shopify Types ─────────────────────────────────────────────────────────────
export interface ShopifyCollectionImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  image: ShopifyCollectionImage | null;
  productsCount?: number;
}

// ─── Layout Types ──────────────────────────────────────────────────────────────
/**
 * Steuert das Bento-Grid-Verhalten:
 * "featured-tall" → Nimmt 1 Spalte, aber 2 Reihen ein (z. B. Outdoor & Feuer)
 * "wide"          → Nimmt 2 Spalten ein (z. B. Nachtlichter & Beleuchtung)
 * "normal"        → Standard 1 Spalte, 1 Reihe
 */
export type CardSize = "featured-tall" | "wide" | "normal";

export interface CategoryCardConfig {
  handle: string;
  size?: CardSize;
  labelOverride?: string;
  tag?: string;
}

export interface CategoryGridProps {
  collections: ShopifyCollection[];
  layout?: CategoryCardConfig[];
  sectionLabel?: string;
  title?: string;
  description?: string;
  className?: string;
  showHeader?: boolean;
  maxItems?: number;
}

// ─── Default Layout Config für das exakte Screenshot-Design ───────────────────
const DEFAULT_LAYOUT: CategoryCardConfig[] = [
  { handle: "outdoor-und-feuer", size: "featured-tall", tag: "Bestseller" },
  { handle: "nachtlichter-und-beleuchtung", size: "wide" },
  { handle: "mannerwelt-bier", size: "normal", tag: "Neu" },
  { handle: "untersetzer-tischdeko", size: "normal" },
  { handle: "geschenke-und-anlaesse", size: "normal", tag: "Beliebt" },
  { handle: "wohnen-und-deko", size: "wide" },
];

// Map für die asymmetrischen Grid-Zellen (Auf Basis von standardmäßig 3 Spalten auf Desktop)
const sizeClasses: Record<CardSize, string> = {
  "featured-tall":
    "col-span-1 lg:col-span-1 lg:row-span-2 min-h-[400px] lg:min-h-[512px]",
  wide: "col-span-1 lg:col-span-2 min-h-[250px]",
  normal: "col-span-1 min-h-[250px]",
};

// ─── CategoryCard ──────────────────────────────────────────────────────────────
interface CategoryCardProps {
  collection: ShopifyCollection;
  config: CategoryCardConfig;
  index: number; // Für den numerischen Indikator (01, 02, etc.)
}

function CategoryCard({ collection, config, index }: CategoryCardProps) {
  const label = config.labelOverride ?? collection.title;
  const imageSrc = collection.image?.url;
  const imageAlt = collection.image?.altText ?? label;

  // Formatierung des Index zu "01", "02" etc.
  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/pages/products?collection=${collection.handle}`}
      className={cn(
        "group relative overflow-hidden rounded-md bg-zinc-900 block w-full",
        sizeClasses[config.size ?? "normal"],
      )}
    >
      {/* Bild */}
      {imageSrc ? (
        <Image
          src={shopifyImageUrl(imageSrc, 1200) ?? imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover brightness-[0.7] contrast-[1.05]",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-[1.03]",
          )}
          priority={index < 2}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900" />
      )}

      {/* Sanfter Schatten-Verlauf von unten nach oben für bessere Lesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />

      {/* Dynamisches Tag oben rechts (Bestseller, Neu, Beliebt) */}
      {config.tag && (
        <span className="absolute top-5 right-5 inline-block px-3 py-1 rounded-full bg-accent text-white text-[0.68rem] font-bold tracking-wider uppercase shadow-sm">
          {config.tag}
        </span>
      )}

      {/* Integrierter Schräger Pfeil unten rechts */}
      <div
        aria-hidden
        className={cn(
          "absolute bottom-5 right-5 w-10 h-10 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm",
          "flex items-center justify-center text-white",
          "transition-all duration-300 ease-in-out",
          "group-hover:bg-white group-hover:text-black group-hover:border-white",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </div>

      {/* Content-Bereich unten links */}
      <div className="absolute bottom-0 inset-x-0 p-6 pr-16 flex flex-col justify-end min-h-[50%]">
        <h3 className="font-serif font-semibold text-white leading-tight tracking-wide text-xl sm:text-2xl mb-1.5">
          {label}
        </h3>

        {(collection.descriptionHtml || collection.description) && (
          <p
            className="text-white/70 text-xs sm:text-sm line-clamp-2 mb-2 font-light max-w-md"
            dangerouslySetInnerHTML={{
              __html: sanitizeInlineHtml(
                collection.descriptionHtml || collection.description,
              ),
            }}
          />
        )}

        {collection.productsCount !== undefined && (
          <p className="text-white/40 text-xs tracking-wider uppercase font-medium">
            {collection.productsCount} Produkte
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── CategoryGrid ──────────────────────────────────────────────────────────────
export function CategoryGrid({
  collections,
  layout = DEFAULT_LAYOUT,
  sectionLabel = "Produktkollektionen",
  title = "Für jeden Anlass das <em>passende Stück</em>",
  description = "Von robusten Gartenartikeln bis zu feinem persönlichem Schmuck – entdeck alle Kollektionen.",
  className,
  showHeader = true,
  maxItems,
}: CategoryGridProps) {
  // Sortierungs- und Matching-Logik
  const collectionMap = new Map(collections.map((c) => [c.handle, c]));
  const orderedCards: Array<{
    collection: ShopifyCollection;
    config: CategoryCardConfig;
  }> = [];

  for (const config of layout) {
    const collection = collectionMap.get(config.handle);
    if (collection) {
      orderedCards.push({ collection, config });
      collectionMap.delete(config.handle);
    }
  }

  // Fallback für nicht-konfigurierte Kollektionen
  for (const collection of collectionMap.values()) {
    orderedCards.push({
      collection,
      config: { handle: collection.handle, size: "normal" },
    });
  }

  if (orderedCards.length === 0) return null;
  const visibleCards = maxItems
    ? orderedCards.slice(0, maxItems)
    : orderedCards;

  return (
    <section className={cn("w-full bg-cream", className)}>
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-12 sm:py-16">
        {/* Section Header */}
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
            <div className="max-w-xl">
              <span className="block mb-2 text-xs font-bold tracking-[0.2em] uppercase text-accent">
                {sectionLabel}
              </span>
              <h2
                className={cn(
                  "font-serif font-normal leading-[1.15] tracking-tight text-zinc-900 text-3xl sm:text-4xl lg:text-5xl",
                  "[&_em]:italic [&_em]:text-accent [&_em]:not-italic",
                )}
                dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(title) }}
              />
              {description && (
                <p className="mt-4 text-zinc-500 text-sm sm:text-base leading-relaxed max-w-md">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Das asymmetrische Bento-Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {visibleCards.map(({ collection, config }, index) => (
            <CategoryCard
              key={collection.id}
              collection={collection}
              config={config}
              index={index}
            />
          ))}
        </div>

        {/* Button zentriert darunter platziert (wunschgemäß wie im Codebeispiel) */}
        {maxItems && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/pages/kollektionen"
              className={cn(
                "inline-flex items-center gap-2",
                "text-sm font-medium text-charcoal dark:text-primary",
                "border border-sand/60 dark:border-zinc-700 rounded",
                "px-6 py-3",
                "hover:border-rust hover:text-rust dark:hover:border-rust dark:hover:text-rust",
                "transition-colors duration-200",
              )}
            >
              Alle Kollektionen ansehen
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoryGrid;
