import { AlertCircle, Hammer, Truck } from "lucide-react";
import PageHeader from "../../components/PageHeader";

interface DeliveryEntry {
  category: string;
  production: string;
  shippingTime: string;
  carrier: string;
}

// Quelle: manuelle Angabe des Betriebs — nur bestätigte Werte, keine Schätzungen.
const ENTRIES: DeliveryEntry[] = [
  {
    category: "Feuertonnen mit fertigen Motiven",
    production: "2–3 Werktage",
    shippingTime: "2 Tage",
    carrier: "DHL",
  },
  {
    category: "Feuertonnen und Feuerschalen mit Wunschmotiv",
    production: "ca. 14–20 Werktage",
    shippingTime: "2 Tage",
    carrier: "DHL",
  },
  {
    category: "Feuerschalen mit fertigen Motiven",
    production: "10 Werktage",
    shippingTime: "2 Tage",
    carrier: "DHL",
  },
  {
    category: "Stehtische beheizt",
    production: "ca. 14–16 Werktage",
    shippingTime: "3–5 Tage",
    carrier: "Cargo International",
  },
  {
    category: "Stehtische mit Wunschmotiv beheizt",
    production: "ca. 14–20 Werktage",
    shippingTime: "3–5 Tage",
    carrier: "Cargo International",
  },
  {
    category: "Faßmöbel",
    production: "16–20 Werktage",
    shippingTime: "3–5 Tage",
    carrier: "Cargo International",
  },
  {
    category: "Alle anderen Artikel",
    production: "2–3 Werktage",
    shippingTime: "2 Tage",
    carrier: "DHL",
  },
];

export default function DeliveryTimePage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Herstellungs- & Lieferzeiten"
        eyebrow="Service"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Lieferzeiten" },
        ]}
      />

      <p className="text-sm text-muted mb-2 max-w-xl">
        Alle Artikel werden auf Bestellung gefertigt. Dadurch entstehen immer Herstellungs- und
        Lieferzeiten. Diese sind immer abhängig von der aktuellen Auftragslage.
      </p>
      <p className="text-sm text-muted mb-8 max-w-xl">
        Hier sind immer die aktuellen Zeiten im Überblick.
      </p>

      <div className="rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden max-w-3xl mb-8">
        <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_1fr_1fr] border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
          {["Kategorie", "Herstellung", "Versand"].map((h) => (
            <div
              key={h}
              className="px-4 py-3 text-[11px] font-medium text-muted uppercase tracking-widest"
            >
              {h}
            </div>
          ))}
        </div>

        {ENTRIES.map((e) => (
          <div
            key={e.category}
            className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_1fr_1fr] border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors duration-150"
          >
            <div className="px-4 py-3.5 text-sm font-medium text-primary">
              {e.category}
            </div>
            <div className="px-4 py-3.5 flex items-start gap-2">
              <Hammer size={14} className="text-muted shrink-0 mt-0.5" />
              <span className="text-sm text-primary tabular-nums">{e.production}</span>
            </div>
            <div className="px-4 py-3.5 flex items-start gap-2">
              <Truck size={14} className="text-muted shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-primary tabular-nums">{e.shippingTime}</span>
                <p className="text-xs text-muted mt-0.5">{e.carrier}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 max-w-2xl">
        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
          Herstellungszeit + Versandzeit ergeben zusammen die Gesamt-Lieferzeit. Beide Angaben
          hängen von der aktuellen Auftragslage ab und können abweichen.
        </p>
      </div>
    </div>
  );
}
