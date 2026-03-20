"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/utils/utils";
import type { JudgemeReview } from "@/app/services/judgeme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductReviewsProps {
  productId: string;
  short?: boolean;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
        aria-label="Schließen"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/50">
          {current + 1} / {images.length}
        </span>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt={`Bewertungsbild ${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
            aria-label="Nächstes Bild"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({
  rating,
  size = "sm",
  interactive = false,
  onSelect,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onSelect?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;
  const sizeClass = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";

  return (
    <div className={cn("flex items-center gap-0.5", sizeClass)} aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "transition-colors duration-100",
            i < active ? "text-gold" : "text-stone/30",
            interactive && "cursor-pointer hover:scale-110",
          )}
          onClick={() => interactive && onSelect?.(i + 1)}
          onMouseEnter={() => interactive && setHovered(i + 1)}
          onMouseLeave={() => interactive && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  onImageClick,
}: {
  review: JudgemeReview;
  onImageClick: (urls: string[], index: number) => void;
}) {
  const date = new Date(review.created_at).toLocaleDateString("de-DE", {
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
        <div className="flex items-center gap-1.5">
          <Stars rating={review.rating} />
          {(review.verified === "verified_buyer" || review.verified === "shopify_verified_buyer") && (
            <span className="text-[0.6rem] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded px-1.5 py-0.5">
              Verifiziert
            </span>
          )}
        </div>
      </div>

      {review.title && (
        <p className="text-sm font-medium text-primary">{review.title}</p>
      )}

      <p className="text-sm text-muted leading-relaxed">{review.body}</p>

      {review.pictures.length > 0 && (
        <div className="flex flex-wrap gap-2.5 pt-1">
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
                className="w-24 h-24 object-cover block"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== pic.urls.original) img.src = pic.urls.original;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── WriteReviewForm ──────────────────────────────────────────────────────────

function WriteReviewForm({ numericProductId, onSuccess }: { numericProductId: number; onSuccess: () => void }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Bitte wähle eine Sternebewertung."); return; }
    if (!name.trim() || !email.trim() || !body.trim()) {
      setError("Name, E-Mail und Bewertungstext sind Pflichtfelder.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/judgeme/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: numericProductId, name: name.trim(), email: email.trim(), rating, title: title.trim(), reviewBody: body.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Fehler beim Senden.");
      } else {
        setDone(true);
        onSuccess();
      }
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="p-5 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-sm text-emerald-700 dark:text-emerald-400">
        Danke für deine Bewertung! Sie wird nach Prüfung veröffentlicht.
      </div>
    );
  }

  const inputClass = "w-full rounded border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm text-primary placeholder:text-muted/50 px-3 py-2.5 outline-none focus:border-accent transition-colors duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">Deine Bewertung *</label>
        <Stars rating={rating} size="md" interactive onSelect={setRating} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Max Mustermann" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">E-Mail *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@example.de" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">Titel</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kurze Zusammenfassung" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">Bewertung *</label>
        <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Was hat dir gut gefallen?" className={cn(inputClass, "resize-none")} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 bg-rust text-white text-sm font-medium rounded-sm hover:bg-rust/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? "Wird gesendet…" : "Bewertung absenden"}
      </button>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const PER_PAGE = 5;

export function ProductReviews({ productId, short = false }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<JudgemeReview[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const numericId = parseInt(productId.split("/").pop() ?? "0", 10);

  const fetchReviews = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/judgeme/reviews?productId=${numericId}&page=${p}&perPage=${PER_PAGE}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews((prev) => p === 1 ? data.reviews : [...prev, ...data.reviews]);
      setHasNextPage(data.hasNextPage ?? false);
      setPage(p);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (numericId) fetchReviews(1);
  }, [numericId]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  // ── Compact summary ──
  if (short) {
    if (loading) return (
      <div className="flex items-center gap-1.5">
        <Stars rating={0} />
        <span className="text-xs text-muted">Lade…</span>
      </div>
    );
    if (reviews.length === 0) return (
      <button onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors duration-150">
        <Stars rating={0} />
        <span>Noch keine Bewertungen – als Erster bewerten</span>
      </button>
    );
    return (
      <button onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity duration-150">
        <Stars rating={Math.round(averageRating)} />
        <span className="text-xs text-muted">
          {averageRating.toFixed(1)} ({reviews.length}{hasNextPage ? "+" : ""} {reviews.length === 1 ? "Bewertung" : "Bewertungen"})
        </span>
      </button>
    );
  }

  // ── Full section ──
  return (
    <div id="reviews-section">
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-medium text-primary dark:text-neutral-100">Kundenbewertungen</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Stars rating={Math.round(averageRating)} />
              <span className="text-xs text-muted">
                {averageRating.toFixed(1)} · {reviews.length}{hasNextPage ? "+" : ""} {reviews.length === 1 ? "Bewertung" : "Bewertungen"}
              </span>
            </div>
          )}
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="text-sm font-medium text-rust border border-rust/40 rounded-sm px-4 py-2 hover:bg-rust hover:text-white transition-colors duration-200">
          {showForm ? "Abbrechen" : "Bewertung schreiben"}
        </button>
      </div>

      {/* Write form */}
      {showForm && (
        <div className="mb-8 p-5 rounded border border-zinc-200 dark:border-zinc-800">
          <WriteReviewForm numericProductId={numericId} onSuccess={() => { setShowForm(false); fetchReviews(1); }} />
        </div>
      )}

      {/* List */}
      {loading && reviews.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded border border-zinc-100 dark:border-zinc-800 animate-pulse bg-zinc-50 dark:bg-zinc-900" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted">Noch keine Bewertungen. Sei der Erste!</div>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                onImageClick={(urls, i) => setLightbox({ images: urls, index: i })}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-center mt-6">
            {page > 1 && (
              <button
                onClick={() => fetchReviews(1)}
                disabled={loading}
                className="absolute left-0 px-4 py-2.5 rounded-sm border border-zinc-300 dark:border-zinc-700 text-sm text-muted hover:border-zinc-500 hover:text-primary dark:hover:border-zinc-500 dark:hover:text-neutral-200 transition-colors duration-200 disabled:opacity-40"
              >
                Weniger anzeigen
              </button>
            )}
            {hasNextPage && (
              <button
                onClick={() => fetchReviews(page + 1)}
                disabled={loading}
                className="px-6 py-2.5 rounded-sm border border-zinc-300 dark:border-zinc-700 text-sm text-muted hover:border-accent hover:text-accent transition-colors duration-200 disabled:opacity-40"
              >
                Mehr laden
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
