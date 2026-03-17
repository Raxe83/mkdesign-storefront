// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS SECTION
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { cn } from "../utils/utils";
import { Link } from "lucide-react";
import ComponentLayout from "./ComponentLayout";

export interface Review {
  id: string;
  author: string;
  location?: string;
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  product?: string;
}

export interface ReviewsProps {
  sectionLabel?: string;
  title?: string;
  totalCount?: number;
  averageRating?: number;
  reviews?: Review[];
  reviewsPageHref?: string;
  className?: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Nicole L.",
    location: "Hamburg",
    date: "März 2026",
    rating: 5,
    product: "Feuertonne mit Vereinslogo",
    text: "Super schöne Feuertonne für unseren Verein mit unserem Logo. Sehr schnelle Lieferung! Klasse Qualität! Eine tolle persönliche Beratung bei Fragen – wir sind absolut begeistert.",
  },
  {
    id: "2",
    author: "Thomas K.",
    location: "Bremen",
    date: "Februar 2026",
    rating: 5,
    product: "Zippo Original mit Gravur",
    text: "Die Zippos mit Gravur sind einfach der Hammer. Als Geschenk für meinen Vater – er war begeistert. Schnell, unkompliziert und top verarbeitet. Sehr gerne wieder!",
  },
  {
    id: "3",
    author: "Sandra M.",
    location: "Hannover",
    date: "Januar 2026",
    rating: 5,
    product: "Schieferuhr mit Motiv",
    text: "Absolut begeistert von der Qualität und dem Service. Die Schieferuhr mit unserem Hausmotiv ist ein echter Blickfang geworden. Genau so wie ich es mir vorgestellt habe.",
  },
  {
    id: "4",
    author: "Markus R.",
    location: "Lüneburg",
    date: "Dezember 2025",
    rating: 5,
    product: "Beheizbarer Stehtisch",
    text: "Der beheizbare Stehtisch ist der Mittelpunkt jeder Gartenrunde. Verarbeitung ist top, das Feuer zieht perfekt. Markus hat mir bei der Planung sehr geholfen – 5 Sterne!",
  },
  {
    id: "5",
    author: "Julia W.",
    location: "Lübeck",
    date: "November 2025",
    rating: 5,
    product: "Halskette mit Gravur",
    text: "Die Halskette ist wunderschön geworden! Genau nach meinen Wünschen graviert, schnelle Lieferung und super verpackt. Ein tolles Geschenk das von Herzen kommt.",
  },
  {
    id: "6",
    author: "Peter F.",
    location: "Schwerin",
    date: "Oktober 2025",
    rating: 5,
    product: "Feuerschale XL",
    text: "Wahnsinn was da für ein Flammenspiel entsteht. Die Feuerschale mit dem Hirsch-Motiv sieht tagsüber schon toll aus – aber nachts wenn das Feuer brennt ist sie unbeschreiblich.",
  },
];

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        size === "lg" ? "text-xl" : "text-sm",
      )}
      aria-label={`${rating} von 5 Sternen`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-gold" : "text-stone/30"}>
          ★
        </span>
      ))}
    </div>
  );
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6",
        "bg-white/5 border border-white/10 rounded-sm",
        "opacity-0 animate-gift-in",
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
    >
      <StarRating rating={review.rating} />

      {/* Review Text */}
      <blockquote className="text-white/70 text-sm leading-[1.8] italic flex-1">
        "{review.text}"
      </blockquote>

      {/* Footer */}
      <div className="border-t border-white/10 pt-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-white text-xs font-medium">{review.author}</p>
          {review.location && (
            <p className="text-white/40 text-xs">{review.location}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          {review.product && (
            <p className="text-rust-mid text-[0.65rem] font-medium tracking-wide uppercase leading-tight mb-0.5">
              {review.product}
            </p>
          )}
          <p className="text-white/30 text-[0.7rem]">{review.date}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function Reviews({
  sectionLabel = "Was Kunden sagen",
  title = "874 Bewertungen –<br/><em>fast alle 5 Sterne</em>",
  totalCount = 874,
  averageRating = 4.9,
  reviews = DUMMY_REVIEWS,
  reviewsPageHref = "/pages/bewertungen",
  className,
}: ReviewsProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <ComponentLayout
      className={cn("bg-charcoal py-16 px-6 lg:py-24 lg:px-[5vw]", className)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <span className="block mb-2 text-xs font-medium tracking-[0.15em] uppercase text-gold">
            {sectionLabel}
          </span>
          <h2
            className={cn(
              "font-display font-bold leading-[1.1] tracking-tight",
              "text-[clamp(1.75rem,3.5vw,2.6rem)] text-white",
              "[&_em]:italic [&_em]:text-rust-mid",
            )}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>

        {/* Gesamt-Rating Badge */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-sm px-6 py-4">
          <p className="font-display font-bold text-white text-3xl leading-none">
            {averageRating.toFixed(1)}
          </p>
          <StarRating rating={Math.round(averageRating)} size="lg" />
          <p className="text-white/40 text-xs mt-1">
            {totalCount.toLocaleString("de-DE")} Bewertungen
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleReviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        {hasMore && (
          <button
            onClick={() => setVisibleCount((c) => c + 3)}
            className={cn(
              "px-8 py-3 rounded-sm",
              "border border-white/20 text-white/70",
              "text-sm font-medium tracking-[0.04em] uppercase",
              "transition-all duration-200",
              "hover:border-white/50 hover:text-white",
            )}
          >
            Mehr Bewertungen laden
          </button>
        )}
        <Link
          href={reviewsPageHref}
          className={cn(
            "px-8 py-3 rounded-sm",
            "bg-rust text-white",
            "text-sm font-medium tracking-[0.04em] uppercase",
            "transition-colors duration-200 hover:bg-rust-mid",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
          )}
        >
          Alle {totalCount} Bewertungen ansehen
        </Link>
      </div>
    </ComponentLayout>
  );
}
