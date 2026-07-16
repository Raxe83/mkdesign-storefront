"use client";

import PageHeader from "../../components/PageHeader";
import { shopDetails } from "../../global";

export default function ImprintPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Impressum"
        eyebrow="Rechtliches"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Impressum" }]}
      />

      <div className="max-w-2xl space-y-10">
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Angaben gemäß § 5 TMG
          </h2>
          <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 space-y-1">
            <p className="text-sm font-medium text-primary">Markus Klement</p>
            <p className="text-sm text-muted">{shopDetails.shopname}</p>
            <p className="text-sm text-muted">{shopDetails.contact.address}</p>
            <p className="text-sm text-muted">{shopDetails.contact.city}</p>
            <p className="text-sm text-muted">{shopDetails.contact.country}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Kontakt
          </h2>
          <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex gap-3 text-sm">
              <span className="text-muted w-20 shrink-0">Telefon</span>
              <a
                href={`tel:${shopDetails.contact.phone}`}
                className="text-primary hover:text-accent transition-colors"
              >
                {shopDetails.contact.phone}
              </a>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-muted w-20 shrink-0">E-Mail</span>
              <a
                href={`mailto:${shopDetails.contact.email}`}
                className="text-primary hover:text-accent transition-colors"
              >
                {shopDetails.contact.email}
              </a>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-muted w-20 shrink-0">Website</span>
              <span className="text-primary">mkdesignweb.de</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Umsatzsteuer
          </h2>
          <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-muted leading-relaxed">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:{" "}
              <span className="text-primary font-medium">335394256</span>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)
          </h2>
          <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 space-y-1">
            <p className="text-sm font-medium text-primary">Markus Klement</p>
            <p className="text-sm text-muted">im Wiesengrund 8</p>
            <p className="text-sm text-muted">
              29584 Himbergen, {shopDetails.contact.country}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Online-Streitbeilegung
          </h2>
          <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-muted leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Haftung für Inhalte
          </h2>
          <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-muted leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Urheberrecht
          </h2>
          <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-muted leading-relaxed">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
