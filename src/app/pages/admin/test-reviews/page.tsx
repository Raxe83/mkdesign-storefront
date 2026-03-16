import { TestReviewForm } from "@/app/components/test-review-form";
import { getProducts } from "@/app/services/shopify";

export default async function TestReviewsPage() {
  const products = await getProducts(50); // Hole bis zu 50 Produkte

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Test-Reviews erstellen</h1>
      <p className="mb-8 text-gray-600">
        Auf dieser Seite kannst du Test-Reviews für beliebige Produkte
        erstellen. Diese Reviews werden sofort als verifiziert markiert und auf
        den Produktseiten angezeigt.
      </p>

      <TestReviewForm products={products} />
    </div>
  );
}
