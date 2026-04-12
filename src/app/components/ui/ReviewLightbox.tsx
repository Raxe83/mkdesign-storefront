"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ZOOM_SCALE = 2.5;

export function ReviewLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [zoom, setZoom]       = useState(1);
  const [origin, setOrigin]   = useState("50% 50%");

  const resetZoom = () => { setZoom(1); setOrigin("50% 50%"); };

  const prev = useCallback(() => { resetZoom(); setCurrent((i) => (i - 1 + images.length) % images.length); }, [images.length]);
  const next = useCallback(() => { resetZoom(); setCurrent((i) => (i + 1) % images.length); }, [images.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (zoom > 1) resetZoom(); else onClose(); }
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next, zoom]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (zoom > 1) { resetZoom(); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    setZoom(ZOOM_SCALE);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bildvorschau"
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center overflow-hidden"
      onClick={() => { if (zoom > 1) resetZoom(); else onClose(); }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
        aria-label="Schließen"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/50 z-10 pointer-events-none">
          {current + 1} / {images.length}
        </span>
      )}

      {zoom === 1 && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/30 pointer-events-none select-none">
          Klicken zum Zoomen
        </span>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt={`Bild ${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl select-none"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: origin,
          transition: "transform 0.2s ease-out",
          cursor: zoom > 1 ? "zoom-out" : "zoom-in",
        }}
        onClick={handleImageClick}
        draggable={false}
      />

      {images.length > 1 && zoom === 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
            aria-label="Nächstes Bild"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
