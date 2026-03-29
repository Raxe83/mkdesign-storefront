import { getCollections, getFeaturedProducts } from "./services/shopify";
import { getHomepageHero, getSectionText } from "./services/shopify/metaobjects";
import { getAllReviewsCached } from "./services/judgeme";
import Hero from "./components/Hero";
import CollectionsList from "./components/CollectionsList";
import ProductsList from "./components/product/ProductsList";
import JoinUs from "./components/JoinUs";
import HeroHighlight from "./components/HeroHighlight";
import GiftFinder from "./components/Giftfinder";
import Firehighlight from "./components/Firehighlight";
import PrintLaserHighlight from "./components/PrintLaserHighlight";
import { Personalization } from "./components/Personalization";
import type { BarrelVariant } from "./components/PersonalizationVisual";
import { Reviews } from "./components/Reviews";

export const revalidate = 3600;

const BARREL_VARIANTS: BarrelVariant[] = ["full", "noLegs", "stehtisch"];

export default async function HomePage() {
  const [featuredProducts, collections, reviewData, heroCms, fireCms, printCms] =
    await Promise.all([
      getFeaturedProducts(8, "de"),
      getCollections(6, "de"),
      getAllReviewsCached().catch(() => null),
      getHomepageHero().catch(() => null),
      getSectionText("fire-highlight").catch(() => null),
      getSectionText("print-highlight").catch(() => null),
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
        eyebrow={heroCms?.eyebrow ?? undefined}
        title={heroCms?.title ?? "Jede Tonne ein Unikat - Fallback"}
        description={
          heroCms?.description ??
          "Personalisierte Produkte in Handarbeit gefertigt – von Feuertonnen über Schmuck bis hin zu Schieferuhren. Direkt aus Bleckede zu Euch."
        }
        image={{
          src: heroCms?.imageUrl ?? require("./img/feuertonne_nice.jpeg").default,
          alt: heroCms?.imageAlt ?? "",
        }}
        ctas={[
          {
            label: heroCms?.ctaPrimaryLabel ?? "Produkte entdecken",
            href: heroCms?.ctaPrimaryHref ?? "/pages/products",
            variant: "primary",
          },
          {
            label: heroCms?.ctaSecondaryLabel ?? "Alle Kollektionen",
            href: heroCms?.ctaSecondaryHref ?? "/pages/categories",
            variant: "outline",
          },
        ]}
        stats={[
          {
            value: reviewStats ? `${reviewStats.average}★` : "4.9★",
            label: "Bewertung",
          },
          { value: heroCms?.statCollections ?? "25+", label: "Kollektionen" },
          { value: heroCms?.statCraftsmanship ?? "100%", label: "Handarbeit" },
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
        sectionLabel={fireCms?.sectionLabel ?? undefined}
        title={fireCms?.title ?? undefined}
        description={fireCms?.description ?? undefined}
        features={fireCms?.features.map((text) => ({ text })) ?? undefined}
        cta={
          fireCms?.ctaLabel && fireCms?.ctaHref
            ? { label: fireCms.ctaLabel, href: fireCms.ctaHref }
            : undefined
        }
        image={{
          src: fireCms?.imageUrl ?? require("./img/stehtisch_nice.jpeg").default,
          alt: fireCms?.imageAlt ?? "Feuertonne",
        }}
      />
      <PrintLaserHighlight
        sectionLabel={printCms?.sectionLabel ?? undefined}
        title={printCms?.title ?? undefined}
        description={printCms?.description ?? undefined}
        features={printCms?.features.map((text) => ({ text })) ?? undefined}
        cta={
          printCms?.ctaLabel && printCms?.ctaHref
            ? { label: printCms.ctaLabel, href: printCms.ctaHref }
            : undefined
        }
        image={{
          // TODO: Ersetze durch ein echtes 3D-Druck / Laser-Bild
          src: printCms?.imageUrl ?? require("./img/feuertonne_light.jpg").default,
          alt: printCms?.imageAlt ?? "3D-Druck und Laser-Gravur",
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
