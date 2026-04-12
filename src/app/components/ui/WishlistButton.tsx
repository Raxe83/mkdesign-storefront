"use client";

import { Heart } from "lucide-react";
import { useWishlist, type WishlistItem } from "@/app/context/WishlistContext";
import { cn } from "@/app/utils/utils";

interface WishlistButtonProps {
  product: WishlistItem;
  className?: string;
  size?: number;
  /** Versteckt den Button via opacity wenn nicht gespeichert — sichtbar per group-hover */
  hideWhenUnsaved?: boolean;
}

export function WishlistButton({ product, className, size = 16, hideWhenUnsaved = false }: WishlistButtonProps) {
  const { toggle, isInWishlist } = useWishlist();
  const saved = isInWishlist(product.handle);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
      aria-label={saved ? "Von Merkliste entfernen" : "Zur Merkliste hinzufügen"}
      aria-pressed={saved}
      className={cn(
        "transition-all duration-150",
        saved ? "text-rust" : "text-muted hover:text-rust",
        hideWhenUnsaved && !saved && "opacity-0 group-hover:opacity-100",
        className,
      )}
    >
      <Heart
        size={size}
        fill={saved ? "currentColor" : "none"}
        strokeWidth={1.75}
        className="transition-transform duration-150 active:scale-90"
      />
    </button>
  );
}
