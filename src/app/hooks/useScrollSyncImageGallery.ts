import { useEffect, useRef, useCallback } from "react";

/**
 * Synchronizes image gallery index with scroll position.
 * Changes image when the right column (info section) scrolls past the viewport.
 */
export function useScrollSyncImageGallery(
  containerRef: React.RefObject<HTMLDivElement | null>,
  totalImages: number,
  onIndexChange: (index: number) => void,
) {
  const lastIndexRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    // Get the right column (info section) bounds
    const infoSection = containerRef.current.querySelector(
      "[data-product-info]",
    ) as HTMLElement | null;
    if (!infoSection) return;

    const rect = infoSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate what fraction of the info section is visible
    // 0 = fully visible at top, 1 = fully scrolled past
    const distancePastViewport = Math.max(0, -rect.top);
    const sectionHeight = infoSection.offsetHeight;
    const scrollProgress = Math.min(
      1,
      distancePastViewport / (sectionHeight - viewportHeight),
    );

    // Map scroll progress to image index
    // e.g., with 4 images: 0-25% → image 0, 25%-50% → image 1, etc.
    const newIndex = Math.min(
      totalImages - 1,
      Math.floor(scrollProgress * totalImages),
    );

    if (newIndex !== lastIndexRef.current) {
      lastIndexRef.current = newIndex;
      onIndexChange(newIndex);
    }
  }, [containerRef, totalImages, onIndexChange]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
}
