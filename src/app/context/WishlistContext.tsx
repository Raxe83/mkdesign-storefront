"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface WishlistItem {
  handle: string;
  title: string;
  imageUrl?: string;
  price: string;
  currencyCode: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  isInWishlist: (handle: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "mk_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWishlist(JSON.parse(stored));
    } catch {
      // Corrupt or missing — start fresh
    }
  }, []);

  const toggle = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.handle === item.handle);
      const next = exists
        ? prev.filter((i) => i.handle !== item.handle)
        : [...prev, item];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isInWishlist = (handle: string) => wishlist.some((i) => i.handle === handle);
  const count = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isInWishlist, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
