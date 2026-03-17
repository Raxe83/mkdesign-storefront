"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  RotateCcw,
} from "lucide-react";
import type { Product } from "../../../types/shopify";
import { getProductByHandle } from "../../../services/shopify";
import { formatPrice } from "../../../utils/formatPrice";
import AddToCartButton from "../../../components/ui/AddToCartButton";
import { shipment } from "../../../types/products";
import ColorChooser from "../../../components/product/ColorChooser";
import i18n from "../../../i18n";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

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
      } catch {
        setError(t("product.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleThumbnailClick = (url: string, index: number) => {
    setMainImgLoaded(false);
    setSelectedImage(url);
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    if (!product) return;
    const images = product.images.edges.map((e) => e.node);
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setMainImgLoaded(false);
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex].url);
  };

  const handleNext = () => {
    if (!product) return;
    const images = product.images.edges.map((e) => e.node);
    const newIndex = (currentIndex + 1) % images.length;
    setMainImgLoaded(false);
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex].url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    else if (e.key === "ArrowRight") handleNext();
  };

  if (isLoading) return <Loader />;

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-2xl font-medium mb-3 text-primary">
          {error || "Produkt nicht gefunden"}
        </h1>
        <p className="mb-6 text-muted text-sm">{t("product.noProduct")}</p>
        <Link
          href="/pages/products"
          className="text-accent hover:underline text-sm font-medium"
        >
          {t("product.backToProducts")}
        </Link>
      </div>
    );
  }

  const images = product.images.edges.map((e) => e.node);
  const firstVariant = product.variants.edges[0]?.node;
  const price =
    firstVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const currencyCode =
    firstVariant?.price.currencyCode ||
    product.priceRange.minVariantPrice.currencyCode;
  const isAvailable = firstVariant?.availableForSale ?? false;

  return (
    <div className="py-8">
      {/* Back */}
      <Link
        href="/pages/products"
        className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors duration-200 mb-10 text-sm"
      >
        <ArrowLeft size={14} />
        {t("product.backToProducts")}
      </Link>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">

        {/* ── Image gallery ── */}
        <div
          className="flex flex-col gap-3 md:sticky md:top-8"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Bilder-Galerie"
        >
          {/* Main image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={
                  images[currentIndex]?.altText ||
                  `${product.title} – Bild ${currentIndex + 1}`
                }
                fill
                priority
                onLoad={() => setMainImgLoaded(true)}
                className={`object-cover transition-all duration-500 ease-out ${
                  mainImgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                }`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                Kein Bild
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  aria-label="Vorheriges Bild"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-zinc-800/90 p-2 shadow-sm text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors duration-200"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Nächstes Bild"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-zinc-800/90 p-2 shadow-sm text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors duration-200"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(image.url, index)}
                  aria-label={`${product.title} – Bild ${index + 1}`}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-all duration-200 ${
                    selectedImage === image.url
                      ? "border-accent"
                      : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} – ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="flex flex-col gap-6">

          {/* Vendor + title */}
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-primary leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Price */}
          <p className="text-2xl font-medium text-primary">
            {formatPrice(price, currencyCode)}
          </p>

          {/* Reviews summary */}
          <ProductReviews productId={product.id} short />

          <hr className="border-zinc-200/60 dark:border-zinc-800" />

          {/* Description */}
          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-muted leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: product.descriptionHtml || `<p>${product.description}</p>`,
            }}
          />

          {/* Color */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">
              {t("product.color")}
              {selectedColor ? ` — ${selectedColor}` : ""}
            </p>
            <ColorChooser
              setSelectedColor={setSelectedColor}
              selectedColor={selectedColor}
            />
          </div>

          {/* Quantity */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">
              {t("product.quantity")}
            </p>
            <div className="inline-flex items-center border border-zinc-200 dark:border-zinc-700 rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Menge verringern"
                className="p-2.5 text-muted hover:text-primary transition-colors duration-150 disabled:opacity-30"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium text-primary select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Menge erhöhen"
                className="p-2.5 text-muted hover:text-primary transition-colors duration-150"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          {isAvailable ? (
            <AddToCartButton
              variantId={firstVariant.id}
              available={isAvailable}
              title={product.title}
              color={selectedColor}
              quantity={quantity}
              icon
            />
          ) : (
            <p className="text-sm font-medium text-red-500">
              {t("product.notAvailable")}
            </p>
          )}

          {/* Shipping info */}
          <div className="space-y-2.5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2.5 text-sm text-muted">
              <Truck size={15} className="shrink-0" />
              <span>
                Standardversand: {shipment.standard.days} Werktage —{" "}
                {formatPrice(shipment.standard.price.toFixed(2), currencyCode)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted">
              <Truck size={15} className="shrink-0 text-accent" />
              <span>
                Expressversand: {shipment.premium.days} Werktage —{" "}
                {formatPrice(shipment.premium.price.toFixed(2), currencyCode)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted">
              <RotateCcw size={15} className="shrink-0" />
              <span>30 Tage kostenlose Rückgabe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full reviews section */}
      <div className="mt-20 pt-10 border-t border-zinc-200/60 dark:border-zinc-800">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
