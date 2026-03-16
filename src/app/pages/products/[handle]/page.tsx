"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import type { Product } from "../../../types/shopify";
import { getProductByHandle } from "../../../services/shopify";
import { formatPrice } from "../../../utils/formatPrice";
import AddToCartButton from "../../../components/ui/AddToCartButton";
import { availableColors, shipment } from "../../../types/products";
import ColorChooser from "../../../components/product/ColorChooser";
import i18n from "../../../i18n";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductReviews } from "@/app/components/product/product-reviews";
import { Loader } from "@/app/components/Loader";

const ProductDetailPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("Schwarz");
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [t] = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      const shopifyLocale = i18n.language;
      if (!handle) return;

      try {
        setIsLoading(true);
        setError(null);
        const productData = await getProductByHandle(handle, shopifyLocale);

        if (!productData) {
          setError(t("products.noProduct"));
          return;
        }

        setProduct(productData);
        const defaultImage =
          productData.featuredImage?.url ||
          productData.images.edges[0]?.node.url;
        setSelectedImage(defaultImage);
      } catch (err) {
        setError(t("product.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleThumbnailClick = (url: string, index: number) => {
    setSelectedImage(url);
    setCurrentIndex(index);
    setIsZoomed(false);
  };

  const handlePrevious = () => {
    if (!product) return;
    const images = product.images.edges.map((edge) => edge.node);
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex].url);
    setIsZoomed(false);
  };

  const handleNext = () => {
    if (!product) return;
    const images = product.images.edges.map((edge) => edge.node);
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex].url);
    setIsZoomed(false);
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    else if (e.key === "ArrowRight") handleNext();
    else if (e.key === "Escape" && isZoomed) setIsZoomed(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold mb-3 text-primary">
          {error || "Produkt nicht gefunden"}
        </h1>
        <p className="mb-6 text-muted">{t("product.noProduct")}</p>
        <Link
          href="/pages/products"
          className="text-accent hover:underline font-medium"
        >
          {t("product.backToProducts")}
        </Link>
      </div>
    );
  }

  const images = product.images.edges.map((edge) => edge.node);
  const firstVariant = product.variants.edges[0]?.node;
  const price =
    firstVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const currencyCode =
    firstVariant?.price.currencyCode ||
    product.priceRange.minVariantPrice.currencyCode;
  const isAvailable = firstVariant?.availableForSale || false;

  return (
    <div className="py-4">
      <Link
        href="/pages/products"
        className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors duration-200 mb-8 text-sm font-medium"
      >
        <ArrowLeft size={15} />
        {t("product.backToProducts")}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image gallery */}
        <div
          className="space-y-3"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Bilder-Galerie"
        >
          <div className="relative aspect-square overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
            <div
              className={`h-full w-full transition-transform duration-300 ease-in-out ${
                isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
              }`}
              onClick={toggleZoom}
            >
              <img
                src={selectedImage || "/placeholder.svg"}
                alt={
                  images[currentIndex]?.altText ||
                  `${product.title} - Bild ${currentIndex + 1}`
                }
                className="h-full w-full object-cover"
              />
            </div>

            {!isZoomed && (
              <button
                className="absolute bottom-3 right-3 rounded-full bg-white/90 dark:bg-zinc-800/90 p-1.5 text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-white dark:hover:bg-zinc-700 transition-colors duration-200"
                onClick={toggleZoom}
                aria-label="Bild vergrößern"
              >
                <ZoomIn size={16} />
              </button>
            )}

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-zinc-800/90 p-1.5 text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-white dark:hover:bg-zinc-700 transition-colors duration-200"
                  onClick={handlePrevious}
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-zinc-800/90 p-1.5 text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-white dark:hover:bg-zinc-700 transition-colors duration-200"
                  onClick={handleNext}
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square overflow-hidden rounded border-2 transition-all duration-200 ${
                    selectedImage === image.url
                      ? "border-accent ring-1 ring-accent/30"
                      : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                  onClick={() => handleThumbnailClick(image.url, index)}
                  aria-label={`${product.title} - Bild ${index + 1} auswählen`}
                  aria-current={selectedImage === image.url}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={
                      image.altText ||
                      `${product.title} - Thumbnail ${index + 1}`
                    }
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-display font-semibold text-primary leading-tight">
              {product.title}
            </h1>
            <p className="mt-3 text-2xl font-medium text-primary">
              {formatPrice(price, currencyCode)}
            </p>
          </div>

          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-muted leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                product.descriptionHtml || `<p>${product.description}</p>`,
            }}
          />

          <div className="py-4 border-y border-zinc-200/60 dark:border-zinc-800">
            <ProductReviews productId={product.id} short />
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium text-primary">
              {t("product.quantity")}
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Color chooser */}
          <div>
            <ColorChooser
              setSelectedColor={setSelectedColor}
              selectedColor={selectedColor}
            />
          </div>

          {/* Add to cart */}
          {isAvailable ? (
            <AddToCartButton
              variantId={firstVariant.id}
              available={isAvailable}
              title={product.title}
              color={selectedColor!}
              quantity={quantity}
              icon
            />
          ) : (
            <p className="text-red-500 text-sm font-medium">{t("product.notAvailable")}</p>
          )}
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-16 pt-8 border-t border-zinc-200/60 dark:border-zinc-800">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
