"use client";

import { Truck, Clock, PackageCheck } from "lucide-react";
import PageHeader from "../../components/PageHeader";

const rows = [
  { zone: "Deutschland", method: "DHL Paket", time: "1–3 Werktage", price: "4,99 €" },
  { zone: "Deutschland", method: "DHL Express", time: "1 Werktag", price: "9,99 €" },
  { zone: "EU (Zone 1)", method: "DHL International", time: "3–5 Werktage", price: "8,99 €" },
  { zone: "EU (Zone 2)", method: "DHL International", time: "5–8 Werktage", price: "12,99 €" },
  { zone: "Weltweit", method: "DHL Worldwide", time: "7–14 Werktage", price: "19,99 €" },
];

const highlights = [
  { icon: Truck, label: "Gratis Versand", desc: "ab 50 € innerhalb DE" },
  { icon: Clock, label: "Schnelle Lieferung", desc: "1–3 Werktage Standard" },
  { icon: PackageCheck, label: "Sendungsverfolgung", desc: "für alle Bestellungen" },
];

export default function ShippingPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Versandkosten"
        eyebrow="Service"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Versandkosten" },
        ]}
      />

      <p className="text-sm text-muted mb-8 max-w-xl">
        Alle Preise inkl. MwSt. Kostenloser Versand ab <span className="text-primary font-medium">50 €</span> Bestellwert innerhalb Deutschlands.
      </p>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {highlights.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-start gap-4 p-5 rounded border border-zinc-200 dark:border-zinc-800"
          >
            <div className="w-10 h-10 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
              <Icon size={17} className="text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">{label}</p>
              <p className="text-xs text-muted mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden max-w-3xl">
        {/* Head */}
        <div className="grid grid-cols-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
          {["Zone", "Versandart", "Lieferzeit", "Kosten"].map((h) => (
            <div key={h} className="px-4 py-3 text-[11px] font-medium text-muted uppercase tracking-widest">
              {h}
            </div>
          ))}
        </div>
        {/* Rows */}
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors duration-150"
          >
            <div className="px-4 py-3.5 text-sm font-medium text-primary">{row.zone}</div>
            <div className="px-4 py-3.5 text-sm text-muted">{row.method}</div>
            <div className="px-4 py-3.5 text-sm text-muted">{row.time}</div>
            <div className="px-4 py-3.5 text-sm font-medium text-primary">{row.price}</div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted max-w-xl">
        * Bei Bestellungen aus Nicht-EU-Ländern können zusätzliche Zölle und Steuern anfallen, die vom Empfänger zu tragen sind.
      </p>
    </div>
  );
}
