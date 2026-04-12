"use client";

import { useEffect } from "react";
import { X, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/app/context/WishlistContext";
import { formatPrice } from "@/app/utils/formatPrice";
import { cn } from "@/app/utils/utils";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlist, toggle } = useWishlist();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[9997] bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Merkliste"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[9998] w-[90vw] max-w-[360px]",
          "bg-cream dark:bg-zinc-900 shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand/40 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <Heart size={15} className="text-rust" fill="currentColor" />
            <span className="text-sm font-medium text-charcoal dark:text-primary">Merkliste</span>
            {wishlist.length > 0 && (
              <span className="text-xs text-muted dark:text-neutral-400">({wishlist.length})</span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Merkliste schließen"
            className="p-1.5 rounded text-muted hover:text-primary transition-colors duration-150"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <Heart size={36} className="text-zinc-200 dark:text-zinc-700" />
              <p className="text-sm font-medium text-charcoal dark:text-primary">Noch nichts gespeichert</p>
              <p className="text-xs text-muted dark:text-neutral-400 leading-relaxed max-w-[220px]">
                Klicke auf das Herz-Symbol bei einem Produkt, um es hier zu speichern.
              </p>
              <Link
                href="/pages/products"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-rust hover:underline"
              >
                Produkte entdecken <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-sand/30 dark:divide-zinc-800">
              {wishlist.map((item) => (
                <li key={item.handle} className="flex gap-3 p-4 items-start">
                  <Link
                    href={`/pages/products/${item.handle}`}
                    onClick={onClose}
                    className="shrink-0 relative w-16 h-16 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700"
                  >
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/pages/products/${item.handle}`}
                      onClick={onClose}
                      className="text-sm font-medium text-charcoal dark:text-primary line-clamp-2 hover:text-rust transition-colors duration-150 leading-snug"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted dark:text-neutral-400 mt-0.5">
                      {formatPrice(item.price, item.currencyCode)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggle(item)}
                    aria-label="Aus Merkliste entfernen"
                    className="shrink-0 p-1.5 text-muted hover:text-rust transition-colors duration-150 rounded"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
