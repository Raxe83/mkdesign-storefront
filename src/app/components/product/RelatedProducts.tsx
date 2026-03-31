'use client'

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/app/utils/formatPrice";
import type { Product } from "@/app/types/shopify";

interface Props {
  products: Product[];         // kategoriebezogene Empfehlungen (immer zuerst)
  randomProducts?: Product[];  // zusätzliche Random-Produkte
}

function RelatedProductCard({ product }: { product: Product }) {
  const variant  = product.variants.edges[0]?.node;
  const price    = variant?.price.amount    ?? product.priceRange.minVariantPrice.amount;
  const currency = variant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode;

  return (
    <Link
      href={`/pages/products/${product.handle}`}
      className="group flex flex-col gap-2 snap-start shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Kein Bild
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-primary dark:text-neutral-100 group-hover:text-rust transition-colors duration-150 leading-snug line-clamp-2">
        {product.title}
      </p>
      <p className="text-sm text-muted dark:text-neutral-400">
        {formatPrice(price, currency)}
      </p>
    </Link>
  );
}

export function RelatedProducts({ products, randomProducts = [] }: Props) {
  const all = [...products, ...randomProducts];
  if (all.length === 0) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // 2 Karten weit scrollen
    const cardWidth = el.scrollWidth / all.length;
    el.scrollBy({ left: dir === "right" ? cardWidth * 2 : -(cardWidth * 2), behavior: "smooth" });
  };

  const hasMore = all.length > 4;

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {all.map((p) => (
          <RelatedProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => scroll("left")}
            aria-label="Zurück blättern"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-primary dark:text-neutral-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Vorwärts blättern"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-primary dark:text-neutral-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
