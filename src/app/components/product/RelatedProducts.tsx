import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/app/utils/formatPrice";
import type { Product } from "@/app/types/shopify";

interface Props {
  products: Product[];
}

function RelatedProductCard({ product }: { product: Product }) {
  const variant  = product.variants.edges[0]?.node;
  const price    = variant?.price.amount    ?? product.priceRange.minVariantPrice.amount;
  const currency = variant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode;

  return (
    <Link href={`/pages/products/${product.handle}`} className="group flex flex-col gap-2">
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
          <div className="flex h-full items-center justify-center text-xs text-muted">Kein Bild</div>
        )}
      </div>
      <p className="text-sm font-medium text-primary dark:text-neutral-100 group-hover:text-rust transition-colors duration-150 leading-snug line-clamp-2">
        {product.title}
      </p>
      <p className="text-sm text-muted dark:text-neutral-400">{formatPrice(price, currency)}</p>
    </Link>
  );
}

export function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <RelatedProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
