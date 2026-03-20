import { CirclePlay, Mail, Star, Truck, type LucideIcon } from "lucide-react";

interface StaticItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const STATIC_ITEMS: StaticItem[] = [
  {
    title: "Handarbeit",
    description: "Jedes Produkt wird mit Liebe zum Detail in Handarbeit gefertigt",
    icon: CirclePlay,
  },
  {
    title: "Wunschmotiv",
    description: "Euer eigenes Motiv oder Gravur auf fast allen Produkten möglich",
    icon: Mail,
  },
  {
    title: "Schneller Versand",
    description: "DHL & GLS Versand direkt nach Fertigung an Euch",
    icon: Truck,
  },
];

export function HeroHighlight({
  reviewStats,
}: {
  reviewStats: { total: number; average: number } | null;
}) {
  return (
    <section className="w-full bg-charcoal border-b border-white/[0.04]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATIC_ITEMS.map((item) => (
            <HighlightCard key={item.title} item={item} />
          ))}
          <ReviewStatsCard reviewStats={reviewStats} />
        </div>
      </div>
    </section>
  );
}

function cardShell(children: React.ReactNode) {
  return (
    <div
      className="relative flex flex-col gap-6 px-7 py-9 rounded-sm
                    border border-white/[0.06] bg-neutral-900/40
                    shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)]
                    overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(183,65,14,0.03)_0%,transparent_60%)]" />
      {children}
    </div>
  );
}

function HighlightCard({ item }: { item: StaticItem }) {
  return cardShell(
    <>
      <div className="relative w-12 h-12 mx-auto rounded-sm bg-orange-700/10 flex items-center justify-center shrink-0 border border-orange-700/20 shadow-sm">
        <item.icon className="text-orange-600 w-6 h-6" />
      </div>
      <div className="relative z-10 text-center">
        <h3 className="text-base font-medium text-neutral-100 mb-2 tracking-tight">{item.title}</h3>
        <p className="text-[13px] text-neutral-400 leading-relaxed">{item.description}</p>
      </div>
    </>,
  );
}

function ReviewStatsCard({ reviewStats }: { reviewStats: { total: number; average: number } | null }) {
  return cardShell(
    <>
      <div className="relative w-12 h-12 mx-auto rounded-sm bg-orange-700/10 flex items-center justify-center shrink-0 border border-orange-700/20 shadow-sm">
        <Star className="text-orange-600 w-6 h-6" />
      </div>
      <div className="relative z-10 text-center">
        {reviewStats == null ? (
          <>
            <div className="h-4 w-32 mx-auto rounded bg-white/10 animate-pulse mb-3" />
            <div className="h-3 w-40 mx-auto rounded bg-white/[0.06] animate-pulse" />
          </>
        ) : (
          <>
            <h3 className="text-base font-medium text-neutral-100 mb-2 tracking-tight">
              {reviewStats.average} von 5 Sternen
            </h3>
            <p className="text-[13px] text-neutral-400 leading-relaxed">
              Über {reviewStats.total} begeisterte Kunden – Qualität die überzeugt
            </p>
          </>
        )}
      </div>
    </>,
  );
}

export default HeroHighlight;
