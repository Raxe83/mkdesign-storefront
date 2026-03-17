"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Collection, Product } from "./types/shopify";
import i18n from "./i18n";
import { getCollections, getFeaturedProducts } from "./services/shopify";
import Hero from "./components/Hero";
import InfoCardSection from "./components/Information/InfoCardSection";
import CollectionsList, {
  ShopifyCollection,
} from "./components/CollectionsList";
import InfoSection from "./components/Information/InfoSection";
import ProductsList from "./components/product/ProductsList";
import JoinUs from "./components/JoinUs";
import { shopDetails } from "./global";
import HeroHighlight from "./components/HeroHighlight";
import GiftFinder from "./components/Giftfinder ";
import Skeleton from "./components/ui/Skeleton";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [t] = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const shopifyLocale = i18n.language;
      try {
        setIsLoading(true);

        const products = await getFeaturedProducts(8, shopifyLocale);
        setFeaturedProducts(products);

        const fetchedCollections = await getCollections(6, shopifyLocale);
        setCollections(fetchedCollections);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Hero
        title={"Jedes Stück ein Unikat"}
        description={
          "Personalisierte Produkte in Handarbeit gefertigt – von Feuertonnen über Schmuck bis hin zu Schieferuhren. Direkt aus Bleckede an Euch."
        }
        image={{
          src: require("./img/Ornate Fire Pits.png").default,
          alt: "",
        }}
      />
      <HeroHighlight />

      {isLoading ? (
        <Skeleton.CollectionsGrid />
      ) : (
        <CollectionsList collections={collections} />
      )}

      {isLoading ? (
        <Skeleton.ProductsGrid />
      ) : (
        <ProductsList featuredProducts={featuredProducts} />
      )}

      <GiftFinder />
      <JoinUs />
    </div>
  );
};

export default HomePage;
