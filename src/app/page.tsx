import { getCollections, getFeaturedProducts } from "./services/shopify";
import { getAllReviewsCached } from "./services/judgeme";
import Hero from "./components/Hero";
import CollectionsList from "./components/CollectionsList";
import ProductsList from "./components/product/ProductsList";
import JoinUs from "./components/JoinUs";
import HeroHighlight from "./components/HeroHighlight";
import GiftFinder from "./components/Giftfinder";
import Firehighlight from "./components/Firehighlight";
import { Personalization } from "./components/Personalization";
import type { BarrelVariant } from "./components/PersonalizationVisual";
import { Reviews } from "./components/Reviews";

export const revalidate = 3600;

const BARREL_VARIANTS: BarrelVariant[] = ["full", "schale", "schaleXL", "stehtisch"];

export default async function HomePage() {
  const [featuredProducts, collections, reviewData] = await Promise.all([
    getFeaturedProducts(8, "de"),
    getCollections(6, "de"),
    getAllReviewsCached().catch(() => null),
  ]);

  const reviewStats = reviewData && reviewData.reviews.length > 0
    ? {
        total: reviewData.total,
        average:
          Math.round(
            (reviewData.reviews.reduce((s, r) => s + r.rating, 0) /
              reviewData.reviews.length) *
              10,
          ) / 10,
      }
    : null;

  const barrelVariant =
    BARREL_VARIANTS[Math.floor(Math.random() * BARREL_VARIANTS.length)];

  return (
    <div>
      <Hero
        title={"Jede Tonne ein Unikat"}
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
          {
            value: reviewStats ? `${reviewStats.average}★` : "4.9★",
            label: "Bewertung",
          },
          { value: "25+", label: "Kategorien" },
          { value: "100%", label: "Handarbeit" },
          {
            value: reviewStats ? `${reviewStats.total}+` : "500+",
            label: "Bewertungen",
          },
        ]}
      />
      <HeroHighlight reviewStats={reviewStats} />

      <CollectionsList collections={collections} />

      <ProductsList
        featuredProducts={featuredProducts}
        title="Beliebt bei Kunden"
      />

      <Firehighlight
        image={{
          src: require("./img/stehtisch_nice.jpeg").default,
          alt: "Feuertonne",
        }}
      />
      <GiftFinder />
      <Personalization
        image={{
          src: require("./img/feuertonne_blank.png").default,
          alt: "",
        }}
        cta={{
          label: "Design selbst gestalten",
          href: "/pages/design",
        }}
        variant={barrelVariant}
      />
      <Reviews reviewStats={reviewStats} />
      <JoinUs />
    </div>
  );
}
