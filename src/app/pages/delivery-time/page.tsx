"use client";

import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import PageHeader from "../../components/PageHeader";

const entries = [
  {
    label: "Standardversand",
    time: "1–3 Werktage",
    note: "Nach Zahlungseingang",
  },
  {
    label: "Expressversand",
    time: "1 Werktag",
    note: "Bestellung bis 12:00 Uhr",
  },
  {
    label: "EU-Ausland",
    time: "3–8 Werktage",
    note: "Je nach Zielland",
  },
  {
    label: "International",
    time: "7–14 Werktage",
    note: "Außerhalb der EU",
  },
];

export default function DeliveryTimePage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Lieferzeiten"
        eyebrow="Service"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Lieferzeiten" },
        ]}
      />

      <p className="text-sm text-muted mb-8 max-w-xl">
        Alle Angaben in Werktagen (Mo–Fr, ohne Feiertage) — gültig ab Versanddatum.
      </p>

      <div className="space-y-3 max-w-2xl mb-8">
        {entries.map((e) => (
          <div
            key={e.label}
            className="flex items-center justify-between gap-4 p-5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">{e.label}</p>
                <p className="text-xs text-muted mt-0.5">{e.note}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-sm font-medium text-primary tabular-nums">{e.time}</span>
              <CheckCircle2 size={15} className="text-green-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 max-w-2xl">
        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
          Zu Stoßzeiten (z. B. Weihnachten, Black Friday) können die Lieferzeiten abweichen.
          Wir informieren bei Verzögerungen per E-Mail.
        </p>
      </div>
    </div>
  );
}
