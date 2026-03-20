"use client";

import { useEffect, useState } from "react";
import { Collection, Product } from "./types/shopify";
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
import Firehighlight from "./components/Firehighlight";
import { Personalization } from "./components/Personalization";
import { Reviews } from "./components/Reviews";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviewStats, setReviewStats] = useState<{ total: number; average: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [products, fetchedCollections] = await Promise.all([
          getFeaturedProducts(8, "de"),
          getCollections(6, "de"),
        ]);
        setFeaturedProducts(products);
        setCollections(fetchedCollections);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/judgeme/stats");
        if (res.ok) setReviewStats(await res.json());
      } catch {
        // silently keep null → fallback values shown
      }
    };

    fetchData();
    fetchStats();
  }, []);

  return (
    <div>
      <Hero
        title={"Jedes Stück ein Unikat"}
        description={
          "Personalisierte Produkte in Handarbeit gefertigt – von Feuertonnen über Schmuck bis hin zu Schieferuhren. Direkt aus Bleckede zu Euch."
        }
        image={{
          src: require("./img/feuertonne_nice.jpeg").default,
          alt: "",
        }}
        ctas={[
          {
            label: "Produkte entdecken",
            href: "/pages/products",
            variant: "primary",
          },
          {
            label: "Alle Kategorien",
            href: "/pages/categories",
            variant: "outline",
          },
        ]}
        stats={[
          { value: reviewStats ? `${reviewStats.average}★` : "4.9★", label: "Bewertung" },
          { value: "25+", label: "Kategorien" },
          { value: "100%", label: "Handarbeit" },
          { value: reviewStats ? `${reviewStats.total}+` : "874+", label: "Bewertungen" },
        ]}
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

      <Firehighlight
        image={{
          src: require("./img/stehtisch_nice.jpeg").default,
          alt: "Feuertonne",
        }}
      />
      <GiftFinder />
      <Personalization
        image={{
          src: require("./img/Ornate Fire Pits.png").default,
          alt: "",
        }}
        secondaryCta={{ label: "Design selbst gestalten", href: "/pages/design" }}
      />
      <Reviews reviewStats={reviewStats} />
      <JoinUs />
    </div>
  );
};

export default HomePage;
