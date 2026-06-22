import type { Metadata } from "next";
import { getCollections } from "../../services/shopify";
import { CategoryGrid } from "../../components/CollectionsList";
import PageHeader from "../../components/PageHeader";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kollektionen · M.K. Design",
  description: "Alle Produktkollektionen von M.K. Design – Feuertonnen, Nachtlichter, Schieferprodukte, Stehtische und mehr.",
};

export default async function CollectionsPage() {
  const collections = await getCollections(50, "de");

  return (
    <div className="pb-12">
      <PageHeader
        title="Kollektionen"
        eyebrow="Produktkollektionen"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Kollektionen" }]}
        count={collections.length}
        totalCount={collections.length}
        singularLabel="Kollektion"
        pluralLabel="Kollektionen"
        isLoading={false}
      />

      <CategoryGrid
        collections={collections}
        showHeader={false}
        columns={3}
        forceCardSize="normal"
      />
    </div>
  );
}
