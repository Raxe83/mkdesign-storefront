"use client";

import Image from "next/image";
import type { ZusatzproduktOption } from "@/app/types/shopify";
import { formatPrice } from "@/app/utils/formatPrice";

interface Props {
  options: ZusatzproduktOption[];
  selected: ZusatzproduktOption[];
  onToggle: (opt: ZusatzproduktOption, checked: boolean) => void;
}

export function ZusatzprodukteList({ options, selected, onToggle }: Props) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {options.map((opt) => {
        const checked = selected.some((v) => v.id === opt.id);
        return (
          <label
            key={opt.id}
            className={[
              "relative flex items-center gap-3 p-2.5 cursor-pointer rounded border transition-colors duration-150 w-full select-none",
              checked
                ? "border-primary bg-primary/5 dark:border-neutral-400 dark:bg-neutral-400/5"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900",
            ].join(" ")}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={(e) => onToggle(opt, e.target.checked)}
            />

            {/* Kleines Produktbild */}
            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {opt.featuredImage ? (
                <Image
                  src={opt.featuredImage.url}
                  alt={opt.featuredImage.altText ?? opt.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700" />
              )}
            </div>

            {/* Textbereich (Titel & Preis) */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-semibold text-primary dark:text-neutral-200 leading-tight line-clamp-1">
                {opt.title}
              </span>
              <span className="text-xs text-muted dark:text-neutral-400">
                {formatPrice(opt.price.amount, opt.price.currencyCode)}
              </span>
            </div>

            {/* Checkmark Badge (Rechtsbündig) */}
            <span
              className={[
                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
                checked
                  ? "bg-primary border-primary dark:bg-neutral-100 dark:border-neutral-100"
                  : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-500",
              ].join(" ")}
            >
              {checked && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
                  <path
                    d="M1 3.5L3.5 6L8 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="dark:stroke-neutral-900"
                  />
                </svg>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}