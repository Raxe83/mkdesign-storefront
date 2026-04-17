"use client";

import Image from "next/image";
import type { ZusatzproduktOption } from "@/app/types/shopify";
import { formatPrice } from "@/app/utils/formatPrice";

interface Props {
  options: ZusatzproduktOption[];
  selected: ZusatzproduktOption[];
  onToggle: (opt: ZusatzproduktOption, checked: boolean) => void;
}

export function ZusatzprodukteGrid({ options, selected, onToggle }: Props) {
  if (options.length === 0) return null;

  const cols =
    options.length === 1 ? "grid-cols-1"
    : options.length === 2 ? "grid-cols-2"
    : "grid-cols-3";

  return (
    <div className={`grid ${cols} gap-2 w-full`}>
      {options.map((opt) => {
        const checked = selected.some((v) => v.id === opt.id);
        return (
          <label
            key={opt.id}
            className={[
              "relative flex flex-col cursor-pointer rounded border overflow-hidden transition-colors duration-150 w-full",
              checked
                ? "border-primary dark:border-neutral-400"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500",
            ].join(" ")}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={(e) => onToggle(opt, e.target.checked)}
            />

            {/* Bild */}
            <div className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-800">
              {opt.featuredImage ? (
                <Image
                  src={opt.featuredImage.url}
                  alt={opt.featuredImage.altText ?? opt.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700" />
              )}

              {/* Checkmark Badge */}
              <span
                className={[
                  "absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
                  checked
                    ? "bg-primary border-primary dark:bg-neutral-100 dark:border-neutral-100"
                    : "bg-white/80 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-500",
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
            </div>

            {/* Text */}
            <div
              className={[
                "flex flex-col gap-0.5 px-2.5 py-2 transition-colors duration-150",
                checked
                  ? "bg-zinc-50 dark:bg-zinc-800/60"
                  : "bg-white dark:bg-zinc-900",
              ].join(" ")}
            >
              <span className="text-xs font-medium text-primary dark:text-neutral-200 leading-snug line-clamp-2">
                {opt.title}
              </span>
              <span className="text-xs text-muted dark:text-neutral-400">
                {formatPrice(opt.price.amount, opt.price.currencyCode)}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );
}
