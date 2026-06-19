import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { GuestReturnForm } from "./GuestReturnForm";

export const metadata: Metadata = {
  title: "Rücksendung anfragen · M.K. Design",
  description: "Widerrufs- und Rücksendeanfrage für Bestellungen bei M.K. Design.",
};

export default function ReturnRequestPage() {
  return (
    <div className="pb-12 lg:pb-20 max-w-lg mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <RotateCcw size={18} className="text-rust" />
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-rust">
            Widerruf & Rücksendung
          </p>
        </div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-charcoal dark:text-primary">
          Rücksendung anfragen
        </h1>
        <p className="mt-3 text-sm text-muted dark:text-neutral-400 leading-relaxed">
          Gem. EU-Fernabsatzrichtlinie / § 355 BGB hast du ein 14-tägiges Widerrufsrecht
          ab Erhalt der Ware. Fülle das Formular aus und wir melden uns innerhalb von
          1–2 Werktagen bei dir.
        </p>
      </div>

      <GuestReturnForm />
    </div>
  );
}
