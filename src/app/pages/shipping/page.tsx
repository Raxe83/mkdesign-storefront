import { Truck, PackageCheck, BadgeEuro } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { getShippingProfiles } from "../../services/shopify/shipping";

const highlights = [
  { icon: Truck, label: "Schnelle Lieferung", desc: "2–4 Werktage Standard" },
  { icon: BadgeEuro, label: "Kostenloser Versand", desc: "Ab Mindestbestellwert je Produkt" },
  { icon: PackageCheck, label: "Sendungsverfolgung", desc: "Für alle Bestellungen" },
];

export default function ShippingPage() {
  const profiles = getShippingProfiles();

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

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
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

      {/* Profiles */}
      <div className="flex flex-col gap-10 max-w-3xl">
        {profiles.map((profile) => (
          <div key={profile.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
                {profile.name}
              </h2>
              <span className="text-xs text-muted/50">
                {profile.productCount} {profile.productCount === 1 ? "Produkt" : "Produkte"}
              </span>
            </div>

            <div className="rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                {["Versandart", "Lieferzeit", "Kosten"].map((h) => (
                  <div
                    key={h}
                    className="px-4 py-3 text-[11px] font-medium text-muted uppercase tracking-widest"
                  >
                    {h}
                  </div>
                ))}
              </div>

              {profile.options.map((opt, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors duration-150"
                >
                  <div className="px-4 py-3.5 text-sm font-medium text-primary">
                    {opt.method}
                  </div>
                  <div className="px-4 py-3.5 text-sm text-muted">
                    {opt.days}
                  </div>
                  <div className="px-4 py-3.5 text-sm font-medium text-primary">
                    {opt.price}
                    {opt.freeFrom && (
                      <p className="text-xs font-normal text-muted mt-0.5">
                        ab {opt.freeFrom} kostenlos
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted max-w-xl">
        * Bei Bestellungen aus Nicht-EU-Ländern können zusätzliche Zölle und
        Steuern anfallen, die vom Empfänger zu tragen sind.
      </p>
    </div>
  );
}
