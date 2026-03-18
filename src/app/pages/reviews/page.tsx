"use client";

import { Star } from "lucide-react";
import PageHeader from "../../components/PageHeader";

const reviews = [
  { author: "Maria K.", rating: 5, text: "Super Qualität und sehr schnelle Lieferung! Absolut empfehlenswert.", product: "Design-Poster A3", date: "März 2025" },
  { author: "Thomas B.", rating: 5, text: "Tolles Produkt, genau wie auf den Bildern. Bin sehr zufrieden.", product: "Canvas Print", date: "Februar 2025" },
  { author: "Sandra L.", rating: 4, text: "Gute Verarbeitung, schöne Designs. Lieferung hat etwas länger gedauert, aber das Ergebnis überzeugt.", product: "Wandbild Set", date: "Januar 2025" },
  { author: "Andreas M.", rating: 5, text: "Bereits die dritte Bestellung – immer wieder top. Weiter so!", product: "Poster-Bundle", date: "Januar 2025" },
  { author: "Julia R.", rating: 5, text: "Perfektes Geschenk für Designliebhaber. Danke für die tolle Verpackung!", product: "Geschenkset", date: "Dezember 2024" },
  { author: "Markus W.", rating: 4, text: "Sehr schöne Qualität, gutes Preis-Leistungs-Verhältnis.", product: "Acrylbild", date: "November 2024" },
];

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700 fill-current"}
        />
      ))}
    </div>
  );
}

const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

export default function ReviewsPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Bewertungen"
        eyebrow="Kundenstimmen"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Bewertungen" },
        ]}
        count={reviews.length}
        singularLabel="Bewertung"
        pluralLabel="Bewertungen"
      />

      {/* Summary bar */}
      <div className="flex items-center gap-8 mb-10 py-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-end gap-3">
          <span className="font-display text-5xl font-medium text-primary leading-none">{avg}</span>
          <div className="pb-1">
            <Stars rating={Math.round(Number(avg))} size={16} />
            <p className="text-xs text-muted mt-1.5">{reviews.length} Bewertungen</p>
          </div>
        </div>
        <div className="hidden sm:block h-12 w-px bg-zinc-200 dark:bg-zinc-800" />
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-primary tabular-nums">
            {fiveStarCount} × <span className="text-amber-400">★★★★★</span>
          </p>
          <p className="text-xs text-muted mt-0.5">
            {Math.round((fiveStarCount / reviews.length) * 100)} % 5-Sterne-Bewertungen
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 p-5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-primary">{r.author}</p>
                <p className="text-xs text-muted mt-0.5">{r.date}</p>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="text-sm text-muted leading-relaxed flex-1">{r.text}</p>
            {r.product && (
              <p className="text-xs text-muted border-t border-zinc-100 dark:border-zinc-800 pt-3">
                Produkt: <span className="text-primary font-medium">{r.product}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
