import { getProducts, getProductsByCollection } from "../../services/shopify";
import ProductsGrid from "./ProductsGrid";

interface Props {
  searchParams: Promise<{ collection?: string; productType?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { collection, productType } = await searchParams;

  const [allProducts, collectionProducts] = await Promise.all([
    getProducts(undefined, "de"),
    collection
      ? getProductsByCollection(collection, undefined, "de")
      : Promise.resolve(null),
  ]);

  const collectionIds = collectionProducts
    ? collectionProducts.map((p) => p.id)
    : null;

  return (
    <ProductsGrid
      key={`${collection ?? "all"}-${productType ?? "any"}`}
      allProducts={allProducts}
      collectionIds={collectionIds}
      initialType={productType ?? null}
      collectionHandle={collection ?? null}
    />
  );
}
