import PageHeader from "../../components/PageHeader";
import { getAllReviewsCached } from "../../services/judgeme";
import { ReviewsClient } from "./ReviewsClient";

export default async function ReviewsPage() {
  let allReviews: Awaited<ReturnType<typeof getAllReviewsCached>>["reviews"] = [];
  let total = 0;

  try {
    const data = await getAllReviewsCached();
    allReviews = data.reviews;
    total = data.total;
  } catch {
    // Judge.me not configured or API error – show empty state
  }

  return (
    <div className="pb-16">
      <PageHeader
        title="Bewertungen"
        eyebrow="Kundenstimmen"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Bewertungen" }]}
        count={total}
        singularLabel="Bewertung"
        pluralLabel="Bewertungen"
      />

      {total === 0 ? (
        <p className="text-center py-20 text-muted text-sm">
          Noch keine Bewertungen vorhanden.
        </p>
      ) : (
        <ReviewsClient allReviews={allReviews} total={total} />
      )}
    </div>
  );
}
