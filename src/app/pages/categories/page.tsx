"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { getProducts } from "../../services/shopify";
import type { Product } from "../../types/shopify";
import { Loader } from "../../components/Loader";

interface CategoryItem {
  type: string;
  count: number;
  image: string | null;
  imageAlt: string;
}

const CategoryCard = ({ item, onClick }: { item: CategoryItem; onClick: () => void }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800 aspect-[3/4] w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
    >
      {item.image ? (
        <>
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.05] ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
          />
          {/* dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-end justify-start p-4 bg-zinc-200 dark:bg-zinc-800">
          <div className="w-full h-full absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
      )}

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-display text-white text-base font-medium leading-tight line-clamp-2">
          {item.type}
        </p>
        <p className="text-white/70 text-xs mt-0.5 tabular-nums">
          {item.count} {item.count === 1 ? "Produkt" : "Produkte"}
        </p>
      </div>

      {/* Hover arrow */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

const CategoriesPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    getProducts(250)
      .then(setAllProducts)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo((): CategoryItem[] => {
    const map = new Map<string, { count: number; image: string | null; imageAlt: string }>();
    for (const p of allProducts) {
      const type = p.productType?.trim();
      if (!type) continue;
      if (!map.has(type)) {
        map.set(type, {
          count: 1,
          image: p.featuredImage?.url ?? null,
          imageAlt: p.featuredImage?.altText ?? type,
        });
      } else {
        map.get(type)!.count += 1;
      }
    }
    return Array.from(map.entries())
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.type.toLowerCase().includes(q));
  }, [categories, search]);

  if (isLoading) return <Loader />;

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-medium text-primary leading-tight tracking-tight">
          Kategorien
        </h1>
        {!isLoading && (
          <p className="mt-1.5 text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "Kategorie" : "Kategorien"}
            {filtered.length !== categories.length && ` von ${categories.length}`}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kategorie suchen…"
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-display text-lg text-primary mb-1">Keine Kategorien gefunden</p>
          <p className="text-sm text-muted mb-5">Versuche einen anderen Suchbegriff.</p>
          <button
            onClick={() => setSearch("")}
            className="text-sm text-accent hover:underline"
          >
            Suche zurücksetzen
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {filtered.map((item) => (
            <CategoryCard
              key={item.type}
              item={item}
              onClick={() =>
                router.push(
                  `/pages/products?productType=${encodeURIComponent(item.type)}`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
