"use client";

import { useState, useMemo } from "react";
import { cn } from "@/app/utils/utils";
import type { JudgemeReview } from "@/app/services/judgeme";
import { ReviewLightbox } from "@/app/components/ui/ReviewLightbox";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{ fontSize: size }}
          className={i < rating ? "text-gold" : "text-zinc-300 dark:text-zinc-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  onImageClick,
}: {
  review: JudgemeReview;
  onImageClick: (urls: string[], i: number) => void;
}) {
  const date = new Date(review.created_at).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const originalUrls = review.pictures.map((p) => p.urls.original);

  return (
    <div className="flex flex-col gap-3 p-5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-primary">{review.reviewer.name}</p>
          <p className="text-xs text-muted mt-0.5">{date}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Stars rating={review.rating} />
          {(review.verified === "verified_buyer" ||
            review.verified === "shopify_verified_buyer") && (
            <span className="text-[0.6rem] font-medium text-emerald-600 dark:text-emerald-400">
              Verifizierter Kauf
            </span>
          )}
        </div>
      </div>

      {review.title && (
        <p className="text-sm font-medium text-primary">{review.title}</p>
      )}

      <p className="text-sm text-muted leading-relaxed flex-1">{review.body}</p>

      {review.pictures.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {review.pictures.map((pic, i) => (
            <button
              key={i}
              onClick={() => onImageClick(originalUrls, i)}
              className="relative overflow-hidden rounded border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-150 hover:scale-[1.02] focus:outline-none"
              aria-label={`Bild ${i + 1} vergrößern`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pic.urls.large ?? pic.urls.medium ?? pic.urls.original}
                alt={`Bewertungsbild ${i + 1}`}
                className="w-20 h-20 object-cover block"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== pic.urls.original) img.src = pic.urls.original;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {review.product_title && (
        <p className="text-xs text-muted border-t border-zinc-100 dark:border-zinc-800 pt-3">
          Produkt:{" "}
          <span className="text-primary font-medium">{review.product_title}</span>
        </p>
      )}
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

type SortKey = "newest" | "oldest" | "highest" | "lowest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Neueste zuerst" },
  { value: "oldest", label: "Älteste zuerst" },
  { value: "highest", label: "Beste zuerst" },
  { value: "lowest", label: "Schlechteste zuerst" },
];

interface FilterBarProps {
  total: number;
  filteredCount: number;
  starFilter: number | null;
  setStarFilter: (s: number | null) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  distribution: Record<number, number>;
}

function FilterBar({
  total,
  filteredCount,
  starFilter,
  setStarFilter,
  verifiedOnly,
  setVerifiedOnly,
  sort,
  setSort,
  distribution,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
      {/* Top row: count + sort */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted">
          {filteredCount === total ? (
            <><span className="font-medium text-primary">{total}</span> Bewertungen</>
          ) : (
            <><span className="font-medium text-primary">{filteredCount}</span> von {total} Bewertungen</>
          )}
        </p>
        <div className="flex items-center gap-3">
          {/* Verified toggle */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={cn(
              "text-xs px-3 py-1.5 rounded border transition-colors duration-150",
              verifiedOnly
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                : "border-zinc-200 dark:border-zinc-700 text-muted hover:border-zinc-300",
            )}
          >
            ✓ Verifiziert
          </button>

          {/* Sort select */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-transparent text-primary px-2 py-1.5 outline-none focus:border-accent cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Star filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStarFilter(null)}
          className={cn(
            "text-xs px-3 py-1.5 rounded border transition-colors duration-150",
            starFilter === null
              ? "bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900 font-medium"
              : "border-zinc-200 dark:border-zinc-700 text-muted hover:border-zinc-400",
          )}
        >
          Alle
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setStarFilter(starFilter === star ? null : star)}
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors duration-150",
              starFilter === star
                ? "bg-gold/10 border-gold text-primary font-medium"
                : "border-zinc-200 dark:border-zinc-700 text-muted hover:border-zinc-400",
            )}
          >
            <span className="text-gold">{"★".repeat(star)}</span>
            <span className="text-muted/70">({distribution[star] ?? 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Summary bar ──────────────────────────────────────────────────────────────

function SummaryBar({ reviews, total }: { reviews: JudgemeReview[]; total: number }) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const fiveStar = reviews.filter((r) => r.rating === 5).length;

  return (
    <div className="flex items-center gap-8 mb-8 py-6 border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex items-end gap-3">
        <span className="font-display text-5xl font-medium text-primary leading-none">
          {avg.toFixed(1)}
        </span>
        <div className="pb-1">
          <Stars rating={Math.round(avg)} size={16} />
          <p className="text-xs text-muted mt-1.5">{total} Bewertungen</p>
        </div>
      </div>
      <div className="hidden sm:block h-12 w-px bg-zinc-200 dark:bg-zinc-800" />
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-primary tabular-nums">
          {fiveStar} × <span className="text-gold">★★★★★</span>
        </p>
        <p className="text-xs text-muted mt-0.5">
          {Math.round((fiveStar / reviews.length) * 100)} % 5-Sterne-Bewertungen
        </p>
      </div>
      {/* Mini rating bar */}
      <div className="hidden md:flex flex-col gap-1 flex-1 max-w-xs">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.filter((r) => r.rating === star).length;
          const pct = Math.round((count / reviews.length) * 100);
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-muted w-3 text-right">{star}</span>
              <span className="text-gold text-xs">★</span>
              <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-muted w-6 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export function ReviewsClient({
  allReviews,
  total,
}: {
  allReviews: JudgemeReview[];
  total: number;
}) {
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  // Star distribution for filter bar badges
  const distribution = useMemo(() => {
    const d: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((r) => { d[r.rating] = (d[r.rating] ?? 0) + 1; });
    return d;
  }, [allReviews]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = allReviews;
    if (starFilter !== null) list = list.filter((r) => r.rating === starFilter);
    if (verifiedOnly) list = list.filter(
      (r) => r.verified === "verified_buyer" || r.verified === "shopify_verified_buyer",
    );
    switch (sort) {
      case "oldest": return [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case "highest": return [...list].sort((a, b) => b.rating - a.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "lowest": return [...list].sort((a, b) => a.rating - b.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default: return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [allReviews, starFilter, verifiedOnly, sort]);

  // Reset visible count when filter changes
  const handleStarFilter = (s: number | null) => { setStarFilter(s); setVisible(PAGE_SIZE); };
  const handleVerified = (v: boolean) => { setVerifiedOnly(v); setVisible(PAGE_SIZE); };
  const handleSort = (s: SortKey) => { setSort(s); setVisible(PAGE_SIZE); };

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <>
      {lightbox && (
        <ReviewLightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
      <SummaryBar reviews={allReviews} total={total} />

      <FilterBar
        total={total}
        filteredCount={filtered.length}
        starFilter={starFilter}
        setStarFilter={handleStarFilter}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={handleVerified}
        sort={sort}
        setSort={handleSort}
        distribution={distribution}
      />

      {filtered.length === 0 ? (
        <p className="text-center py-16 text-sm text-muted">
          Keine Bewertungen für diesen Filter.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shown.map((r) => (
              <ReviewCard key={r.id} review={r} onImageClick={(urls, i) => setLightbox({ images: urls, index: i })} />
            ))}
          </div>

          {hasMore && (
            <div className="flex flex-col items-center gap-2 mt-10">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-8 py-3 rounded-sm border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-muted hover:border-accent hover:text-accent transition-colors duration-200"
              >
                Mehr anzeigen ({filtered.length - visible} weitere)
              </button>
              <p className="text-xs text-muted/60">
                {visible} von {filtered.length} Bewertungen
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
