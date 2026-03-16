"use client";

import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Datenschutzerklärung
      </h1>

      <div className="space-y-6 p-2">
        {/* Verantwortlicher */}
        <section>
          <h2 className="text-xl font-semibold">
            1. Verantwortliches Unternehmen
          </h2>
          <div className="flex flex-col gap-4">
            <p>
              <strong>Blvckray Studios UG (Haftungsbeschränkt)</strong> <br />
              Krönerweg 8 <br />
              29525 Uelzen <br />
              Deutschland
            </p>
          </div>

          <h2 className="text-xl mt-4 font-semibold">Kontakt</h2>
          <p>
            E-Mail: <strong>blvckraystudio@gmail.com</strong> <br />
            Website: <strong>www.rayden-studio.com/</strong>
          </p>
        </section>

        {/* Erhebung & Speicherung */}
        <section>
          <h2 className="text-xl font-semibold">
            2. Erhebung und Speicherung personenbezogener Daten
          </h2>
          <p>
            Beim Besuch unseres Shops werden folgende Daten automatisch erhoben:
          </p>
          <ul className="list-disc pl-5">
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Browsertyp & -version</li>
            <li>Betriebssystem</li>
            <li>Besuchte Seiten</li>
          </ul>
          <p>
            Die Rechtsgrundlage für die Erhebung dieser Daten ist unser
            berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO, um die
            Funktionalität unserer Website sicherzustellen und die Nutzung
            zu analysieren.
          </p>
        </section>

        {/* Nutzung & Weitergabe */}
        <section>
          <h2 className="text-xl font-semibold">
            3. Nutzung und Weitergabe der Daten
          </h2>
          <p>Deine Daten werden genutzt für:</p>
          <ul className="list-disc pl-5">
            <li>Bestellabwicklung</li>
            <li>Kundenservice</li>
            <li>Marketing & Analysen</li>
          </ul>
          <p>Weitergabe an:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Shopify</strong> (Plattform-Hosting)
            </li>
            <li>
              <strong>Zahlungsanbieter</strong> (z. B. PayPal, Klarna, Stripe)
            </li>
            <li>
              <strong>Versanddienstleister</strong> (z. B. DHL, UPS)
            </li>
          </ul>
          <p>
            Die Rechtsgrundlage für die Weitergabe an Dritte erfolgt im
            Rahmen der Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </section>

        {/* Zahlungsabwicklung */}
        <section>
          <h2 className="text-xl font-semibold">4. Zahlungsabwicklung</h2>
          <p>
            Alle Zahlungen erfolgen über sichere Anbieter wie PayPal, Klarna
            oder Kreditkarte.
          </p>
          <p>Wir speichern keine Zahlungsinformationen.</p>
          <p>
            Weitere Informationen zur Datenverarbeitung durch die
            Zahlungsanbieter findest du in deren Datenschutzerklärungen:
          </p>
          <ul className="list-disc pl-5">
            <li>
              <a
                href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full"
                className="text-blue-600 underline"
              >
                PayPal Datenschutz
              </a>
            </li>
            <li>
              <a
                href="https://www.klarna.com/de/datenschutz/"
                className="text-blue-600 underline"
              >
                Klarna Datenschutz
              </a>
            </li>
            <li>
              <a
                href="https://stripe.com/de/privacy"
                className="text-blue-600 underline"
              >
                Stripe Datenschutz
              </a>
            </li>
          </ul>
        </section>

        {/* Cookies & Tracking */}
        <section>
          <h2 className="text-xl font-semibold">5. Cookies & Tracking</h2>
          <p>Unser Shop nutzt Cookies für bessere Funktionalität und Analyse:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Essentielle Cookies:</strong> Notwendig für den Betrieb
            </li>
            <li>
              <strong>Analyse & Marketing:</strong> Google Analytics, Meta Pixel
            </li>
          </ul>
          <p>
            Du kannst Cookies in deinen Browsereinstellungen deaktivieren. Wir
            benötigen deine Zustimmung für die Verwendung von nicht-essenziellen
            Cookies. Weitere Details findest du in unserem Cookie-Banner.
          </p>
        </section>

        {/* DSGVO Rechte */}
        <section>
          <h2 className="text-xl font-semibold">6. Deine Rechte (DSGVO)</h2>
          <p>Du hast das Recht auf:</p>
          <ul className="list-disc pl-5">
            <li>Auskunft über gespeicherte Daten</li>
            <li>Löschung oder Berichtigung</li>
            <li>Widerruf deiner Einwilligung</li>
            <li>Datenübertragbarkeit</li>
          </ul>
          <p>
            📩 Kontakt: <strong>blvckraystudio@gmail.com</strong>
          </p>
        </section>

        {/* Drittanbieter und Tools */}
        <section>
          <h2 className="text-xl font-semibold">7. Nutzung der Shopify API</h2>
          <p>
            Unsere Website verwendet die Dienste der Shopify Inc. als technische
            Plattform für die Darstellung von Produkten, den Bestellprozess und
            die Verwaltung von Kundendaten. Die Verarbeitung erfolgt auf
            Grundlage von Art. 6 Abs. 1 lit. b und f DSGVO. Weitere
            Informationen findest du unter:{" "}
            <a
              href="https://www.shopify.com/legal/privacy"
              className="text-blue-600 underline"
            >
              https://www.shopify.com/legal/privacy
            </a>
          </p>
        </section>

        {/* Lucide */}
        <section>
          <h2 className="text-xl font-semibold">
            8. Verwendung von Lucide Icons
          </h2>
          <p>
            Diese Website nutzt Lucide-React, eine Open-Source-Icon-Bibliothek.
            Es erfolgt keine Datenübertragung an Dritte. Weitere Informationen
            unter:{" "}
            <a href="https://lucide.dev" className="text-blue-600 underline">
              https://lucide.dev
            </a>
          </p>
        </section>

        {/* Neon */}
        <section>
          <h2 className="text-xl font-semibold">
            9. Verwendung von Neon (Datenbankhosting)
          </h2>
          <p>
            Wir nutzen <strong>Neon</strong> für das Hosting unserer
            PostgreSQL-Datenbank. Dabei können personenbezogene Daten wie z. B.
            Bestellinformationen gespeichert werden. Weitere Informationen:{" "}
            <a
              href="https://neon.tech/privacy-policy"
              className="text-blue-600 underline"
            >
              https://neon.tech/privacy-policy
            </a>
          </p>
        </section>

        {/* Prisma */}
        <section>
          <h2 className="text-xl font-semibold">10. Einsatz von Prisma</h2>
          <p>
            Zur Datenbank-Kommunikation verwenden wir <strong>Prisma</strong>.
            Prisma selbst speichert keine Daten, dient aber als Vermittler
            zwischen unserem Backend und der Datenbank. Weitere Informationen
            unter:{" "}
            <a
              href="https://www.prisma.io/privacy"
              className="text-blue-600 underline"
            >
              https://www.prisma.io/privacy
            </a>
          </p>
        </section>

        {/* NextAuth */}
        <section>
          <h2 className="text-xl font-semibold">
            11. Authentifizierung über NextAuth
          </h2>
          <p>
            Für sichere Logins verwenden wir <strong>NextAuth.js</strong>. Je
            nach Anbieter (z. B. Google, GitHub) werden Daten wie Name und
            E-Mail-Adresse verarbeitet. Weitere Infos unter:{" "}
            <a
              href="https://next-auth.js.org/getting-started/introduction"
              className="text-blue-600 underline"
            >
              https://next-auth.js.org/getting-started/introduction
            </a>
          </p>
        </section>

        {/* Resend */}
        <section>
          <h2 className="text-xl font-semibold">
            12. E-Mail-Versand über Resend
          </h2>
          <p>
            Systemnachrichten und Bestätigungen versenden wir über{" "}
            <strong>Resend</strong>. Dabei werden deine E-Mail-Adresse und
            Versandmetadaten verarbeitet. Weitere Infos:{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              className="text-blue-600 underline"
            >
              https://resend.com/legal/privacy-policy
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">13. Hosting durch Vercel</h2>
          <p>
            Unser Webhosting wird durch Vercel durchgeführt. Weitere
            Informationen zur Datenspeicherung und -verarbeitung findest du unter:{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              className="text-blue-600 underline"
            >
              https://vercel.com/legal/privacy-policy
            </a>
          </p>
        </section>

        {/* Änderungen der Datenschutzerklärung */}
        <section>
          <h2 className="text-xl font-semibold">
            14. Änderungen der Datenschutzerklärung
          </h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung jederzeit zu
            ändern. Bitte überprüfe die Erklärung regelmäßig. Änderungen werden
            hier bekannt gegeben und treten mit der Veröffentlichung auf dieser
            Seite in Kraft.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
