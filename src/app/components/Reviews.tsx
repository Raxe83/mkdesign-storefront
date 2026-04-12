"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "../utils/utils";
import type { JudgemeReview } from "../services/judgeme";
import { ReviewLightbox } from "./ui/ReviewLightbox";
import { useCookieConsent } from "../hooks/useCookieConsent";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewsProps {
  sectionLabel?: string;
  title?: string;
  className?: string;
  reviewStats?: { total: number; average: number } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div
      className={cn("flex items-center gap-0.5", size === "lg" ? "text-xl" : "text-sm")}
      aria-label={`${rating} von 5 Sternen`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-gold" : "text-stone/30"}>★</span>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  index,
  onImageClick,
}: {
  review: JudgemeReview;
  index: number;
  onImageClick: (urls: string[], i: number) => void;
}) {
  const date = new Date(review.created_at).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
  const originalUrls = review.pictures.map((p) => p.urls.original);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 bg-white/5 border border-white/10 rounded-sm",
        "opacity-0 animate-gift-in",
        "snap-start flex-shrink-0 w-[82vw] sm:w-auto",
      )}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between gap-2">
        <StarRating rating={review.rating} />
        {(review.verified === "verified_buyer" || review.verified === "shopify_verified_buyer") && (
          <span className="text-[0.6rem] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800 rounded px-1.5 py-0.5">
            Verifiziert
          </span>
        )}
      </div>

      <blockquote className="text-white/70 text-sm leading-[1.8] italic flex-1">
        "{review.body}"
      </blockquote>

      {review.pictures.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.pictures.map((pic, i) => (
            <button
              key={i}
              onClick={() => onImageClick(originalUrls, i)}
              className="relative overflow-hidden rounded border border-white/10 hover:border-white/30 transition-all duration-150 hover:scale-[1.03] focus:outline-none"
              aria-label={`Bild ${i + 1} vergrößern`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pic.urls.small ?? pic.urls.medium ?? pic.urls.original}
                alt={`Bewertungsbild ${i + 1}`}
                className="w-16 h-16 object-cover block"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== pic.urls.original) img.src = pic.urls.original;
                }}
              />
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-white/10 pt-4 flex items-start justify-between gap-2">
        <p className="text-white text-xs font-medium">{review.reviewer.name}</p>
        <div className="text-right flex-shrink-0">
          {review.product_title && (
            <p className="text-rustMid text-[0.65rem] font-medium tracking-wide uppercase leading-tight mb-0.5">
              {review.product_title}
            </p>
          )}
          <p className="text-white/30 text-[0.7rem]">{date}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white/5 border border-white/10 rounded-sm animate-pulse snap-start flex-shrink-0 w-[82vw] sm:w-auto">
      <div className="h-4 w-24 bg-white/10 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/10 rounded" />
        <div className="h-3 w-4/5 bg-white/10 rounded" />
        <div className="h-3 w-3/5 bg-white/10 rounded" />
      </div>
      <div className="border-t border-white/10 pt-4 flex justify-between">
        <div className="h-3 w-20 bg-white/10 rounded" />
        <div className="h-3 w-16 bg-white/10 rounded" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const INITIAL = 3;
const LOAD_MORE = 3;
const MAX_CLICKS = 1; // after 1 click → show "Alle" link

export function Reviews({
  sectionLabel = "Was Kunden sagen",
  title = "Echte Bewertungen –<br/><em>von echten Kunden</em>",
  className,
  reviewStats,
}: ReviewsProps) {
  const consent = useCookieConsent();
  const [reviews, setReviews] = useState<JudgemeReview[]>([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL);
  const [clickCount, setClickCount] = useState(0);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    if (!consent.functional) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch("/api/judgeme/reviews?page=1&perPage=12");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list: JudgemeReview[] = data.reviews ?? [];
        // Shuffle so shown reviews are random each page load
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setReviews(shuffled);
        if (list.length > 0) {
          setAverage(list.reduce((s, r) => s + r.rating, 0) / list.length);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [consent.functional]);

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;
  const showAllLink = clickCount >= MAX_CLICKS || !hasMore;

  const displayTitle = reviewStats
    ? `${reviewStats.total.toLocaleString("de-DE")} Bewertungen –<br/><em>fast alle 5 Sterne</em>`
    : title;

  return (
    <div className={cn("w-full bg-charcoal", className)}>
      {lightbox && (
        <ReviewLightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-24">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
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
              dangerouslySetInnerHTML={{ __html: displayTitle }}
            />
          </div>

          {/* Rating box — hidden on mobile, shown sm+ */}
          {(reviewStats || (!loading && average > 0)) && (
            <div className="hidden sm:flex flex-shrink-0 flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-sm px-6 py-4">
              <p className="font-display font-bold text-white text-3xl leading-none">
                {(reviewStats ? reviewStats.average : average).toFixed(1)}
              </p>
              <StarRating rating={Math.round(reviewStats ? reviewStats.average : average)} size="lg" />
              <p className="text-white/40 text-xs mt-1">
                {reviewStats ? reviewStats.total.toLocaleString("de-DE") : reviews.length} Bewertungen
              </p>
            </div>
          )}
        </div>

        {/* ── Mobile: horizontal scroll ── */}
        <div className="sm:hidden -mx-6 px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          <div className="flex gap-3">
            {loading
              ? Array.from({ length: 1 }).map((_, i) => <ReviewCardSkeleton key={i} />)
              : !consent.functional
                ? <p className="text-white/40 text-sm py-10">Bewertungen benötigen funktionale Cookies.</p>
                : reviews.length === 0
                  ? <p className="text-white/40 text-sm py-10">Noch keine Bewertungen.</p>
                  : reviews.map((review, index) => (
                      <ReviewCard key={review.id} review={review} index={index} onImageClick={(urls, i) => setLightbox({ images: urls, index: i })} />
                    ))
            }
          </div>
        </div>

        {/* ── Desktop: paginated grid ── */}
        <div className="hidden sm:block">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
            </div>
          ) : !consent.functional ? (
            <p className="text-white/40 text-sm text-center py-12">
              Bewertungen benötigen funktionale Cookies.
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-12">Noch keine Bewertungen vorhanden.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} onImageClick={(urls, i) => setLightbox({ images: urls, index: i })} />
              ))}
            </div>
          )}

          {/* Desktop load-more / all-reviews */}
          {!loading && reviews.length > 0 && (
            <div className="flex justify-center mt-10">
              {!showAllLink ? (
                <button
                  onClick={() => {
                    setVisibleCount((c) => c + LOAD_MORE);
                    setClickCount((c) => c + 1);
                  }}
                  className="px-8 py-3 rounded-sm border border-white/20 text-white/70 text-sm font-medium tracking-[0.04em] uppercase transition-all duration-200 hover:border-white/50 hover:text-white"
                >
                  Mehr Bewertungen laden
                </button>
              ) : (
                <Link
                  href="/pages/reviews"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-sm border border-rust/40 bg-rust/10 text-white text-sm font-medium tracking-[0.04em] uppercase transition-all duration-200 hover:bg-rust hover:border-rust"
                >
                  Alle Bewertungen ansehen
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ── Always visible: "Alle ansehen" link (mobile + desktop) ── */}
        {!loading && reviews.length > 0 && (
          <div className="flex justify-center mt-6 sm:mt-4">
            <Link
              href="/pages/reviews"
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium tracking-wide uppercase transition-colors duration-200"
            >
              Alle {reviewStats ? `${reviewStats.total.toLocaleString("de-DE")} ` : ""}Bewertungen ansehen
              <ArrowRight size={12} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Reviews;
