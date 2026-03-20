import Image from "next/image";
import { cn } from "@/app/utils/utils";
import type { HeroCard } from "./product-category";
import type { Product } from "@/app/types/shopify";

interface Props {
  product: Product;
  cards: HeroCard[];
}

function HeroCardItem({
  card,
  product,
  reversed,
}: {
  card: HeroCard;
  product: Product;
  reversed: boolean;
}) {
  const images = product.images.edges.map((e) => e.node);
  const imgNode = images.length > 0 ? images[card.imageIndex % images.length] : null;

  return (
    <div className={cn("flex flex-col md:flex-row", reversed && "md:flex-row-reverse")}>

      {/* ── Image side ── */}
      <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[260px] overflow-hidden">
        {imgNode ? (
          <Image
            src={imgNode.url}
            alt={imgNode.altText ?? card.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700" />
        )}
      </div>

      {/* ── Text side ── */}
      <div
        className={cn(
          "w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 py-10 md:py-14",
          card.accentBg,
        )}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45 dark:text-white/60 mb-4">
          Produktdetail
        </p>
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-white leading-tight mb-4">
          {card.title}
        </h3>
        <p className="text-sm md:text-[0.95rem] text-white/70 dark:text-white/80 leading-relaxed max-w-[34ch]">
          {card.body}
        </p>
      </div>
    </div>
  );
}

export function ProductHeroCards({ product, cards }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-stone-200/50 dark:border-zinc-700/50 shadow-sm divide-y divide-stone-200/40 dark:divide-zinc-700/40">
      {cards.map((card, index) => (
        <HeroCardItem
          key={card.title}
          card={card}
          product={product}
          reversed={index % 2 !== 0}
        />
      ))}
    </div>
  );
}
