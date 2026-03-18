"use client";

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

export default function PrivacyPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Datenschutzerklärung"
        eyebrow="Rechtliches"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Datenschutz" }]}
      />

      <div className="max-w-2xl space-y-8">

        <Section title="1. Verantwortlicher">
          <p>
            <span className="text-primary font-medium">Markus Klement · {shopDetails.shopname}</span><br />
            {shopDetails.contact.address}, {shopDetails.contact.city}<br />
            {shopDetails.contact.country}
          </p>
          <p>
            E-Mail:{" "}
            <a href={`mailto:${shopDetails.contact.email}`} className="text-accent hover:underline">
              {shopDetails.contact.email}
            </a>
            <br />
            Tel: {shopDetails.contact.phone}
          </p>
        </Section>

        <Section title="2. Erhebung und Speicherung personenbezogener Daten">
          <p>Beim Besuch unseres Shops werden folgende Daten automatisch erhoben:</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>IP-Adresse des anfragenden Geräts</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Browsertyp und -version</li>
            <li>Betriebssystem</li>
            <li>Besuchte Seiten und Verweildauer</li>
          </ul>
          <p>
            Rechtsgrundlage: berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO zur Sicherstellung der technischen Funktionalität.
          </p>
        </Section>

        <Section title="3. Bestelldaten und Vertragsabwicklung">
          <p>
            Zur Abwicklung von Bestellungen verarbeiten wir Name, Lieferadresse, E-Mail-Adresse, Telefonnummer und Zahlungsdaten. Diese Daten sind zur Vertragserfüllung notwendig (Art. 6 Abs. 1 lit. b DSGVO).
          </p>
          <p>Ihre Daten werden weitergegeben an:</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li><span className="text-primary">Shopify Inc.</span> – Shop-Plattform und Bestellverwaltung</li>
            <li><span className="text-primary">Zahlungsanbieter</span> – PayPal, Klarna, Kreditkarte (Stripe)</li>
            <li><span className="text-primary">Versanddienstleister</span> – GLS, UPS, DHL</li>
          </ul>
          <p>Eine Weitergabe an Dritte zu Werbezwecken erfolgt nicht.</p>
        </Section>

        <Section title="4. Shopify">
          <p>
            Unser Shop basiert auf der Plattform Shopify Inc., 151 O'Connor Street, Ottawa, ON K2P 2L8, Kanada. Shopify verarbeitet Bestelldaten, Kundendaten und Zahlungsinformationen in unserem Auftrag. Weitere Informationen:{" "}
            <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              shopify.com/legal/privacy
            </a>
          </p>
        </Section>

        <Section title="5. Zahlungsabwicklung">
          <p>Alle Zahlungen erfolgen über zertifizierte Anbieter. Wir speichern keine Zahlungsinformationen selbst.</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>
              <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PayPal Datenschutz</a>
            </li>
            <li>
              <a href="https://www.klarna.com/de/datenschutz/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Klarna Datenschutz</a>
            </li>
            <li>
              <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Stripe Datenschutz</a>
            </li>
          </ul>
        </Section>

        <Section title="6. Cookies">
          <p>Unser Shop verwendet Cookies, die für den Betrieb notwendig sind (z. B. Warenkorb, Session). Darüber hinaus setzen wir Cookies für Analyse und Marketing ein (Google Analytics, Meta Pixel) – nur mit Ihrer Einwilligung.</p>
          <p>Sie können Cookies jederzeit in Ihren Browsereinstellungen deaktivieren. Details entnehmen Sie unserem Cookie-Banner.</p>
        </Section>

        <Section title="7. Ihre Rechte (DSGVO)">
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p>
            Anfragen richten Sie bitte an:{" "}
            <a href={`mailto:${shopDetails.contact.email}`} className="text-accent hover:underline">
              {shopDetails.contact.email}
            </a>
          </p>
        </Section>

        <Section title="8. Beschwerderecht">
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist die Aufsichtsbehörde des Bundeslandes, in dem Sie wohnen oder arbeiten, oder die des Bundeslandes, in dem der Datenschutzverstoß stattgefunden hat.
          </p>
        </Section>

        <Section title="9. Aktualität">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die aktuelle Version ist stets auf dieser Seite abrufbar. Stand: März 2025.
          </p>
        </Section>

      </div>
    </div>
  );
}
