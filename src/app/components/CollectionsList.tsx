import Image from "next/image";
import Link from "next/link";
import { cn } from "../utils/utils";

// ─── Shopify Types ─────────────────────────────────────────────────────────────
// Spiegelt die Storefront API Collection-Felder wider.
// Falls du bereits ein Collection-Interface in lib/shopify/types.ts hast,
// ersetze dieses durch einen Import davon.

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
  image: ShopifyCollectionImage | null;
  /** Produkt-Anzahl – aus products.edges.length oder einem Metafield */
  productsCount?: number;
}

// ─── Layout Types ──────────────────────────────────────────────────────────────

/**
 * Steuert die visuelle Gewichtung einer Card im asymmetrischen Grid.
 * "wide"  → 2 Spalten breit (featured)
 * "tall"  → 2 Reihen hoch  (featured, nur erste Card)
 * "normal"→ 1×1
 */
export type CardSize = "wide" | "tall" | "normal";

export interface CategoryCardConfig {
  /** Shopify Collection handle */
  handle: string;
  size?: CardSize;
  /** Überschreibt den Shopify Collection title */
  labelOverride?: string;
  /** Kleines Tag über dem Titel (z.B. "Bestseller", "Neu") */
  tag?: string;
}

export interface CategoryGridProps {
  collections: ShopifyCollection[];
  /**
   * Optionale Reihenfolge + Größen-Konfiguration.
   * Nicht konfigurierte Collections werden als "normal" am Ende angehängt.
   */
  layout?: CategoryCardConfig[];
  sectionLabel?: string;
  title?: string;
  description?: string;
  className?: string;
}

// ─── Default Layout Config ─────────────────────────────────────────────────────
// Entspricht dem MK-Design Redesign-Grid.

const DEFAULT_LAYOUT: CategoryCardConfig[] = [
  { handle: "feuertonne", size: "wide", tag: "Bestseller" },
  { handle: "gravit-uhren", size: "wide" },
  { handle: "schlusselanhanger", size: "wide", tag: "Neu" },
  { handle: "schiefer-untersetzer", size: "wide" },
  { handle: "beheizbarer-stehtisch", size: "wide" },
  { handle: "zippo-original", size: "wide" },
  { handle: "nachtlicht", size: "wide" },
  { handle: "3-d-druck-produkte", size: "wide", tag: "Nachhaltig" },
  { handle: "gartenartikel", size: "wide" },
];

// ─── Grid Cell Tailwind Classes ────────────────────────────────────────────────

const sizeClasses: Record<CardSize, string> = {
  wide: "col-span-1 sm:col-span-2",
  tall: "row-span-2",
  normal: "col-span-1",
};

// ─── CategoryCard ──────────────────────────────────────────────────────────────

interface CategoryCardProps {
  collection: ShopifyCollection;
  config: CategoryCardConfig;
}

function CategoryCard({ collection, config }: CategoryCardProps) {
  const label = config.labelOverride ?? collection.title;
  const imageSrc = collection.image?.url;
  const imageAlt = collection.image?.altText ?? label;

  return (
    <Link
      href={`/pages/products?collection=${collection.handle}`}
      className={cn(
        "group relative overflow-hidden rounded-sm bg-graphite",
        "block min-h-[240px]",
        sizeClasses[config.size ?? "normal"],
      )}
    >
      {/* Bild */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover brightness-75 saturate-[0.85]",
            "transition-transform duration-500 ease-out",
            "group-hover:scale-[1.04]",
          )}
        />
      ) : (
        // Fallback wenn kein Bild vorhanden
        <div className="absolute inset-0 bg-graphite" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent pointer-events-none" />

      {/* Pfeil oben rechts – erscheint bei Hover */}
      <div
        aria-hidden
        className={cn(
          "absolute top-3 right-3",
          "w-8 h-8 rounded-full border border-white/40",
          "flex items-center justify-center",
          "text-white text-sm",
          "opacity-0 translate-y-1",
          "transition-all duration-300",
          "group-hover:opacity-100 group-hover:translate-y-0",
        )}
      >
        →
      </div>

      {/* Text unten */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
        {config.tag && (
          <span className="inline-block mb-2 px-2.5 py-0.5 rounded-sm bg-rust/85 text-white text-[0.65rem] font-medium tracking-[0.1em] uppercase">
            {config.tag}
          </span>
        )}

        <p className="font-display font-bold text-white leading-snug tracking-tight text-[1.1rem] sm:text-[1.25rem]">
          {label}
        </p>

        {collection.productsCount !== undefined && (
          <p className="mt-0.5 text-white/55 text-xs">
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
  sectionLabel = "Produktkategorien",
  title = "Für jeden Anlass das <em>passende Stück</em>",
  description = "Von robusten Gartenartikeln bis zu feinem persönlichem Schmuck – entdeckt alle Kategorien.",
  className,
}: CategoryGridProps) {
  // Collections nach Layout-Reihenfolge sortieren
  const collectionMap = new Map(collections.map((c) => [c.handle, c]));

  const orderedCards: Array<{
    collection: ShopifyCollection;
    config: CategoryCardConfig;
  }> = [];

  // 1. Konfigurierte Collections in definierter Reihenfolge
  for (const config of layout) {
    const collection = collectionMap.get(config.handle);
    if (collection) {
      orderedCards.push({ collection, config });
      collectionMap.delete(config.handle);
    }
  }

  // 2. Übrige Collections (nicht in layout config) am Ende als "normal" anhängen
  for (const collection of collectionMap.values()) {
    orderedCards.push({
      collection,
      config: { handle: collection.handle, size: "wide" },
    });
  }

  if (orderedCards.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
    <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-8 sm:py-12 lg:py-16">
      {/* Section Header */}
      <div className="max-w-lg mb-10">
        <span className="block mb-2 text-xs font-medium tracking-[0.15em] uppercase text-rust">
          {sectionLabel}
        </span>
        <h2
          className={cn(
            "font-display font-bold leading-[1.15] tracking-tight",
            "text-[clamp(1.75rem,3.5vw,2.6rem)] text-charcoal",
            "[&_em]:italic [&_em]:text-accent",
          )}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {description && (
          <p className="mt-3 text-stone text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Asymmetrisches Grid */}
      <div
        className={cn(
          "grid gap-3",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          // Feste Zeilenhöhen für das asymmetrische Layout
          "auto-rows-[240px]",
        )}
      >
        {orderedCards.map(({ collection, config }) => (
          <CategoryCard
            key={collection.id}
            collection={collection}
            config={config}
          />
        ))}
      </div>
    </div>
    </div>
  );
}

export default CategoryGrid;
