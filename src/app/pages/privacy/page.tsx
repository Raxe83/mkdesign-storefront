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

        <Section title="1. Einleitung">
          <p>
            Diese Datenschutzerklärung beschreibt, wie {shopDetails.shopname} (&bdquo;die Website&ldquo;, &bdquo;wir&ldquo;, &bdquo;uns&ldquo; oder &bdquo;unser&ldquo;) personenbezogene Daten sammelt, verwendet und weitergibt, wenn Sie mkdesignweb.de besuchen oder dort einkaufen.
          </p>
        </Section>

        <Section title="2. Verantwortlicher">
          <p>
            <span className="text-primary font-medium">Markus Klement · {shopDetails.shopname}</span><br />
            Geschäftsadresse: {shopDetails.contact.address}, {shopDetails.contact.city}<br />
            Rechnungsadresse: im Wiesengrund 8, 29584 Himbergen OT Groß Thondorf<br />
            {shopDetails.contact.country}
          </p>
          <p>
            E-Mail:{" "}
            <a href={`mailto:${shopDetails.contact.email}`} className="text-accent hover:underline">
              {shopDetails.contact.email}
            </a>
            <br />
            Mobil: {shopDetails.contact.phone}<br />
            Festnetz: 05852 8409833
          </p>
        </Section>

        <Section title="3. Welche Daten wir erheben">
          <p className="text-primary font-medium">Direkt von Ihnen erhoben:</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>Kontaktdaten (Name, Adresse, Telefonnummer, E-Mail-Adresse)</li>
            <li>Bestellinformationen (Rechnungs- und Lieferadresse, Zahlungsbestätigung)</li>
            <li>Kontoinformationen (Benutzername, Passwort, Sicherheitsfragen)</li>
            <li>Angaben im Rahmen von Kundensupport-Anfragen</li>
          </ul>
          <p className="text-primary font-medium pt-1">Automatisch erhoben:</p>
          <p>
            Geräteinformationen, Browserinformationen, Informationen zu Ihrer Netzwerkverbindung sowie Ihre IP-Adresse — erfasst über Cookies und ähnliche Technologien.
          </p>
          <p className="text-primary font-medium pt-1">Von Dritten erhalten:</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li><span className="text-primary">Shopify</span> — unser Plattformanbieter</li>
            <li>Zahlungsabwickler</li>
            <li>Online-Tracking-Technologien (Pixel, Web Beacons, SDKs)</li>
          </ul>
        </Section>

        <Section title="4. Wofür wir Ihre Daten verwenden">
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>Bereitstellung unserer Produkte und Erfüllung des Kaufvertrags</li>
            <li>Marketing und Werbung, u. a. per E-Mail, SMS und Post</li>
            <li>Betrugsprävention und Sicherheit</li>
            <li>Kommunikation mit Ihnen und Verbesserung unseres Services</li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          <p>
            Die meisten Browser akzeptieren Cookies standardmäßig automatisch. Sie können Ihren Browser jedoch so einstellen, dass Cookies über die Browsersteuerung entfernt oder abgelehnt werden. Details zu unserem Cookie-Banner und den eingesetzten Kategorien finden Sie direkt im Cookie-Hinweis unserer Website.
          </p>
          <p>
            Weitere Informationen zu den von Shopify gesetzten Cookies:{" "}
            <a href="https://www.shopify.com/legal/cookies" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              shopify.com/legal/cookies
            </a>
          </p>
        </Section>

        <Section title="6. Weitergabe Ihrer Daten">
          <p>Wir geben personenbezogene Daten weiter an:</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li><span className="text-primary">Shopify Inc.</span> — Shop-Plattform und Bestellverwaltung</li>
            <li>Zahlungsabwickler (z. B. PayPal, Klarna, Kreditkartenanbieter)</li>
            <li><span className="text-primary">Versanddienstleister</span> — DPD, GLS, UPS</li>
            <li>Anbieter und andere Dritte, die in unserem Auftrag Dienstleistungen erbringen</li>
            <li>Geschäfts- und Marketingpartner sowie Affiliate-Partner</li>
          </ul>
          <p>
            Dabei können folgende Kategorien personenbezogener Daten weitergegeben werden: Identifikatoren (Name, E-Mail, Telefonnummer), kommerzielle Informationen sowie Nutzungsdaten. Eine Weitergabe zu Werbezwecken über die genannten Zwecke hinaus erfolgt nicht.
          </p>
        </Section>

        <Section title="7. Nutzergenerierte Inhalte">
          <p>
            Wenn Sie sich dafür entscheiden, Inhalte (z. B. Bewertungen) in einem öffentlichen Bereich unserer Website einzureichen, sind diese Inhalte öffentlich und für jedermann zugänglich.
          </p>
        </Section>

        <Section title="8. Links zu Drittanbieter-Websites">
          <p>
            Unsere Website kann Links zu Websites Dritter enthalten. Wir übernehmen keine Garantie und keine Verantwortung für den Datenschutz oder die Sicherheit solcher Websites.
          </p>
        </Section>

        <Section title="9. Schutz von Kindern">
          <p>
            Unsere Dienste sind nicht für die Nutzung durch Kinder vorgesehen. Wir erfassen wissentlich keine personenbezogenen Daten von Kindern.
          </p>
        </Section>

        <Section title="10. Sicherheit und Speicherdauer">
          <p>
            Wir treffen angemessene technische und organisatorische Maßnahmen zum Schutz Ihrer Daten. Keine Sicherheitsmaßnahme ist jedoch perfekt oder undurchdringlich — eine hundertprozentige Sicherheit können wir nicht garantieren.
          </p>
          <p>
            Die Dauer der Speicherung richtet sich danach, wie lange dies zur Verwaltung Ihres Kontos, zur Erfüllung gesetzlicher Pflichten und zur Durchsetzung unserer Verträge erforderlich ist.
          </p>
        </Section>

        <Section title="11. Ihre Rechte">
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
            <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen den Verkauf bzw. die Weitergabe Ihrer Daten</li>
            <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
            <li>Verwaltung Ihrer Kommunikationseinstellungen (z. B. Newsletter-Abmeldung)</li>
          </ul>
          <p>
            Ein aktiviertes &bdquo;Global Privacy Control&ldquo;-Signal Ihres Browsers werten wir automatisch als Widerspruch (Opt-out).
          </p>
          <p>
            Anfragen richten Sie bitte an:{" "}
            <a href={`mailto:${shopDetails.contact.email}`} className="text-accent hover:underline">
              {shopDetails.contact.email}
            </a>
          </p>
        </Section>

        <Section title="12. Beschwerderecht">
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist die Aufsichtsbehörde des Bundeslandes, in dem Sie wohnen oder arbeiten, oder die des Bundeslandes, in dem der mutmaßliche Verstoß stattgefunden hat. Eine Übersicht der Aufsichtsbehörden im EWR finden Sie unter{" "}
            <a href="https://edpb.europa.eu/about-edpb/about-edpb/members" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              edpb.europa.eu
            </a>.
          </p>
        </Section>

        <Section title="13. Internationale Datenübermittlung">
          <p>
            Sofern personenbezogene Daten außerhalb Europas verarbeitet werden, stützen wir uns auf die Standardvertragsklauseln der Europäischen Kommission, um ein angemessenes Datenschutzniveau sicherzustellen.
          </p>
        </Section>

        <Section title="14. Shopify">
          <p>
            Unser Shop basiert auf der Plattform Shopify Inc., 151 O&apos;Connor Street, Ottawa, ON K2P 2L8, Kanada. Shopify verarbeitet Bestelldaten, Kundendaten und Zahlungsinformationen in unserem Auftrag. Weitere Informationen:{" "}
            <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              shopify.com/legal/privacy
            </a>
          </p>
        </Section>

        <Section title="15. Aktualität">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die aktuelle Version ist stets auf dieser Seite abrufbar. Stand: 25. Juni 2026.
          </p>
        </Section>

      </div>
    </div>
  );
}
