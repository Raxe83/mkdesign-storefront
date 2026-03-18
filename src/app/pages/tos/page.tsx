"use client";

import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import { shopDetails } from "../../global";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted">{title}</h2>
      <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 space-y-3 text-sm text-muted leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TosPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="AGB"
        eyebrow="Rechtliches"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "AGB" }]}
      />

      <div className="max-w-2xl space-y-8">

        <Section title="1. Geltungsbereich">
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, die über den Online-Shop von{" "}
            <span className="text-primary font-medium">{shopDetails.shopname}</span> (Inhaber: Markus Klement,{" "}
            {shopDetails.contact.address}, {shopDetails.contact.city}) getätigt werden.
          </p>
          <p>Abweichende Bedingungen des Käufers werden nicht anerkannt, sofern wir ihrer Geltung nicht ausdrücklich schriftlich zustimmen.</p>
        </Section>

        <Section title="2. Vertragsschluss">
          <p>
            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Bestellung.
          </p>
          <p>
            Ein Kaufvertrag kommt erst zustande, wenn wir Ihre Bestellung durch eine Auftragsbestätigung per E-Mail annehmen. Wir sind berechtigt, Bestellungen ohne Angabe von Gründen abzulehnen.
          </p>
        </Section>

        <Section title="3. Preise und Zahlung">
          <ul className="space-y-1.5 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>Alle Preise verstehen sich in Euro (EUR) inkl. gesetzlicher Mehrwertsteuer.</li>
            <li>Versandkosten werden im Bestellprozess gesondert ausgewiesen.</li>
            <li>Verfügbare Zahlungsmethoden: PayPal, Kreditkarte, Klarna.</li>
            <li>Die Zahlung ist sofort bei Bestellabschluss fällig.</li>
          </ul>
        </Section>

        <Section title="4. Versand und Lieferung">
          <ul className="space-y-1.5 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>Standardlieferung: 1–3 Werktage nach Zahlungseingang.</li>
            <li>Expresslieferung: 1 Werktag (Bestellung bis 12:00 Uhr).</li>
            <li>
              Bei personalisierten oder handgefertigten Produkten kann die Fertigungszeit zusätzlich{" "}
              <Link href="/pages/delivery-time" className="text-accent hover:underline">variieren</Link>.
            </li>
            <li>Wir liefern innerhalb Deutschlands und der EU.</li>
          </ul>
          <p>Gefahrenübergang findet mit Übergabe der Ware an den Versanddienstleister statt.</p>
        </Section>

        <Section title="5. Widerrufsrecht">
          <p>
            Als Verbraucher haben Sie das Recht, diesen Vertrag binnen <span className="text-primary font-medium">14 Tagen ohne Angabe von Gründen</span> zu widerrufen. Die Widerrufsfrist beginnt mit dem Tag des Eingangs der Ware.
          </p>
          <p>
            <span className="text-primary font-medium">Ausnahme:</span> Bei personalisierten Produkten (z. B. individuelle Gravuren, Wunschmotive) ist das Widerrufsrecht gemäß § 312g Abs. 2 Nr. 1 BGB ausgeschlossen, sofern die Ware eigens nach Kundenspezifikation hergestellt wurde.
          </p>
          <p>
            Widerruf schriftlich an:{" "}
            <a href={`mailto:${shopDetails.contact.email}`} className="text-accent hover:underline">
              {shopDetails.contact.email}
            </a>
          </p>
        </Section>

        <Section title="6. Rückgabe und Rückerstattung">
          <p>
            Bei berechtigtem Widerruf erstatten wir den Kaufpreis innerhalb von 14 Tagen nach Eingang der Rücksendung. Die Rücksendekosten trägt der Käufer, sofern die gelieferte Ware der bestellten entspricht.
          </p>
          <p>Rückgaben bitte vorab per E-Mail ankündigen.</p>
        </Section>

        <Section title="7. Gewährleistung">
          <p>
            Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln haben Sie das Recht auf Nacherfüllung (Reparatur oder Ersatzlieferung). Schlägt die Nacherfüllung fehl, können Sie den Kaufpreis mindern oder vom Vertrag zurücktreten.
          </p>
          <p>
            Handgefertigte Unikate können natürliche Materialunterschiede aufweisen – diese stellen keinen Mangel dar, sondern sind ein Qualitätsmerkmal der Handarbeit.
          </p>
        </Section>

        <Section title="8. Haftungsbeschränkung">
          <p>
            Wir haften nicht für Schäden, die durch unsachgemäßen Gebrauch, fehlerhafte Montage durch den Kunden oder höhere Gewalt entstehen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit keine wesentlichen Vertragspflichten berührt sind.
          </p>
        </Section>

        <Section title="9. Datenschutz">
          <p>
            Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{" "}
            <Link href="/pages/privacy" className="text-accent hover:underline">Datenschutzerklärung</Link>.
          </p>
        </Section>

        <Section title="10. Anwendbares Recht und Gerichtsstand">
          <p>
            Es gilt ausschließlich deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für Kaufleute ist {shopDetails.contact.city.split(" ")[1] || "Bleckede"}.
          </p>
        </Section>

        <Section title="11. Änderungen der AGB">
          <p>
            Wir behalten uns vor, diese AGB jederzeit anzupassen. Es gilt die zum Zeitpunkt des Vertragsabschlusses gültige Fassung.
          </p>
          <p className="text-xs text-muted/70">
            Letzte Aktualisierung: März 2025
          </p>
        </Section>

      </div>
    </div>
  );
}
