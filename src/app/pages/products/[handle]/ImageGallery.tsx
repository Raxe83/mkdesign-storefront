"use client";

import type React from "react";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { Image as ShopifyImage } from "../../../types/shopify";

interface Props {
  images: ShopifyImage[];
  productTitle: string;
  initialImage: string;
}

export default function ImageGallery({ images, productTitle, initialImage }: Props) {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [imgLoaded, setImgLoaded]         = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => {
    const next = (index + images.length) % images.length;
    setImgLoaded(false);
    setCurrentIndex(next);
    setSelectedImage(images[next].url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  goTo(currentIndex - 1);
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(currentIndex + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <div
      className="flex flex-col gap-3 md:sticky md:top-8"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Bilder-Galerie"
    >
      {/* Main image */}
      <div
        className="relative aspect-[3/4] overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={images[currentIndex]?.altText ?? `${productTitle} – Bild ${currentIndex + 1}`}
            fill priority
            onLoad={() => setImgLoaded(true)}
            className={`object-cover transition-all duration-500 ease-out ${imgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"}`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Kein Bild</div>
        )}

        {images.length > 1 && (
          <>
            <button onClick={() => goTo(currentIndex - 1)} aria-label="Vorheriges Bild"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-zinc-800/90 p-2 shadow-sm text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors duration-200">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => goTo(currentIndex + 1)} aria-label="Nächstes Bild"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-zinc-800/90 p-2 shadow-sm text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors duration-200">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`${productTitle} – Bild ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded border-2 transition-all duration-200 ${
                selectedImage === img.url ? "border-accent" : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}>
              <Image src={img.url} alt={img.altText ?? `${productTitle} – ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
