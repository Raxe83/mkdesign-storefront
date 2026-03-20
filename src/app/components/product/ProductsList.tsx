"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/app/types/shopify";
import Link from "next/link";
import { cn } from "@/app/utils/utils";

// ─── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface ProductsListProps {
  featuredProducts: Product[];
  sectionLabel?: string;
  title?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const PER_PAGE = 4;
const MAX_PRODUCTS = 8;

const ProductsList = ({
  featuredProducts,
  sectionLabel = "Produkte",
  title,
}: ProductsListProps) => {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const products = featuredProducts.slice(0, MAX_PRODUCTS);
  if (products.length === 0) return null;

  const totalPages = Math.ceil(products.length / PER_PAGE);
  const visibleProducts = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const goTo = (next: number) => {
    setDir(next > page ? 1 : -1);
    setPage(next);
  };

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="w-full">
    <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-8 sm:py-12 lg:py-16">
      {/* ── Section header ── */}
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div className="max-w-lg">
          <span className="block mb-2 text-xs font-medium tracking-[0.15em] uppercase text-accent">
            {sectionLabel}
          </span>
          <h2 className="font-display font-bold leading-[1.15] tracking-tight text-[clamp(1.75rem,3.5vw,2.6rem)] text-charcoal dark:text-primary">
            {title ?? "Produkte"}
          </h2>
        </div>

        <Link
          href="/pages/products"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-3 transition-all duration-200"
        >
          Alle anzeigen
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── Desktop: paginated grid ── */}
      <div className="hidden md:block relative">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {visibleProducts.map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows – only if more than one page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Seite ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === page
                      ? "w-6 bg-accent"
                      : "w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                  )}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(page - 1)}
                disabled={!canPrev}
                aria-label="Vorherige Produkte"
                className={cn(
                  "h-8 w-8 rounded-full border flex items-center justify-center",
                  "transition-all duration-200",
                  canPrev
                    ? "border-zinc-300 dark:border-zinc-700 text-primary hover:border-accent hover:text-accent"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                )}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => goTo(page + 1)}
                disabled={!canNext}
                aria-label="Nächste Produkte"
                className={cn(
                  "h-9 w-9 rounded-full border flex items-center justify-center",
                  "transition-all duration-200",
                  canNext
                    ? "border-zinc-300 dark:border-zinc-700 text-primary hover:border-accent hover:text-accent"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                )}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile: horizontal scroll ── */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="snap-start flex-shrink-0 w-[72vw] max-w-[280px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Mobile "show all" link */}
        <Link
          href="/pages/products"
          className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-accent"
        >
          Alle anzeigen
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
    </div>
  );
};

export default ProductsList;
