"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Product } from "../../types/shopify";
import { getProducts, getProductsByCollection } from "../../services/shopify";
import ProductCard from "../../components/product/ProductCard";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import { Loader } from "../../components/Loader";

const ProductsPageContent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionHandle, setCollectionHandle] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [t] = useTranslation();

  useEffect(() => {
    setCollectionHandle(searchParams.get("collection"));
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      const shopifyLocale = i18n.language;
      try {
        setIsLoading(true);
        setError(null);

        let fetchedProducts: Product[];

        if (collectionHandle) {
          fetchedProducts = await getProductsByCollection(collectionHandle);
        } else {
          fetchedProducts = await getProducts(20, shopifyLocale);
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(t("product.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [collectionHandle]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          {t("common.backToHome")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {collectionHandle
          ? `${t("common.collection")}: ${collectionHandle}`
          : t("product.allProducts")}
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-gray-500">{t("product.noProducts")}</p>
          {collectionHandle && (
            <Link
              href="/pages/products"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              {t("product.allProducts")}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ProductsPageContent />
  </Suspense>
);

export default ProductsPage;
