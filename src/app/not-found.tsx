import Link from "next/link";
import { getCollections } from "./services/shopify/collections";
import CategoryGrid from "./components/CollectionsList";
import NotFoundSearch from "./components/NotFoundSearch";

export default async function NotFoundPage() {
  let collections: Awaited<ReturnType<typeof getCollections>> = [];
  try {
    collections = await getCollections(9);
  } catch {
    // 404 page must not fail — show without collections if Shopify is unavailable
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16 flex flex-col items-center text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-rust mb-4">
          Seite nicht gefunden
        </p>
        <h1 className="text-6xl md:text-7xl font-display font-bold text-primary mb-4">
          404
        </h1>
        <p className="text-muted mb-8 max-w-sm">
          Diese Seite existiert leider nicht. Vielleicht hilft dir die Suche
          oder eine unserer Kategorien weiter.
        </p>

        {/* Search */}
        <div className="w-full mb-8">
          <NotFoundSearch />
        </div>

        <Link
          href="/"
          className="text-sm text-muted hover:text-primary underline underline-offset-4 transition-colors duration-200"
        >
          Zurück zur Startseite
        </Link>
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <CategoryGrid
          collections={collections}
          showHeader
          sectionLabel="Unsere Kategorien"
          title="Vielleicht findest du hier, was du suchst"
          description="Entdecke alle Produktkategorien von M.K. Design."
          columns={2}
          forceCardSize="tall"
        />
      )}
    </div>
  );
}
