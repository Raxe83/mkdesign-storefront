"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Collection, Product } from "./types/shopify";
import i18n from "./i18n";
import { getCollections, getFeaturedProducts } from "./services/shopify";
import Hero from "./components/Hero";
import InfoCardSection from "./components/Information/InfoCardSection";
import CollectionsList, { ShopifyCollection } from "./components/CollectionsList";
import InfoSection from "./components/Information/InfoSection";
import ProductsList from "./components/product/ProductsList";
import JoinUs from "./components/JoinUs";
import { Loader } from "./components/Loader";
import { shopDetails } from "./global";
import HeroHighlight from "./components/HeroHighlight";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [t] = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const shopifyLocale = i18n.language;
      try {
        setIsLoading(true);
        setError(null);

        // Fetch featured products
        const products = await getFeaturedProducts(8, shopifyLocale);
        setFeaturedProducts(products);

        // Fetch collections
        const fetchedCollections = await getCollections(6, shopifyLocale);
        setCollections(fetchedCollections);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Fehler beim Laden der Daten. Bitte versuche es später erneut.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Hero
        title={"Jedes Stück ein Unikat"}
        description={
          "Personalisierte Produkte in Handarbeit gefertigt – von Feuertonnen über Schmuck bis hin zu Schieferuhren. Direkt aus Bleckede an Euch."
        }
        image={{
          src: require("./img/rsz_weed4.jpg").default,
          alt: "",
        }}
      />
      <HeroHighlight />
      <CollectionsList collections={collections}  />
      <ProductsList featuredProducts={featuredProducts} />
      <JoinUs />
    </div>
  );
};

export default HomePage;
