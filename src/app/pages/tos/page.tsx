'use client'

import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <div className="space-y-6 p-2">
        {/* 1. Geltungsbereich */}
        <section>
          <h2 className="text-xl font-semibold">1. Geltungsbereich</h2>
          <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die über unseren Online-Shop getätigt werden.</p>
        </section>

        {/* 2. Vertragsabschluss */}
        <section>
          <h2 className="text-xl font-semibold">2. Vertragsabschluss</h2>
          <p>Der Kaufvertrag kommt zustande, sobald du eine Bestellbestätigung per E-Mail erhältst.</p>
        </section>

        {/* 3. Preise & Zahlung */}
        <section>
          <h2 className="text-xl font-semibold">3. Preise & Zahlung</h2>
          <ul className="list-disc pl-5">
            <li>Alle Preise verstehen sich in EUR inkl. der gesetzlichen MwSt.</li>
            <li>Folgende Zahlungsmethoden stehen zur Verfügung: PayPal, Kreditkarte, Klarna.</li>
            <li>Die Zahlung erfolgt direkt bei Bestellabschluss.</li>
          </ul>
        </section>

        {/* 4. Versand & Lieferung */}
        <section>
          <h2 className="text-xl font-semibold">4. Versand & Lieferung</h2>
          <ul className="list-disc pl-5">
            <li>Der Versand erfolgt innerhalb von 2-5 Werktagen.</li>
            <li>Die Versandkosten werden beim Checkout angezeigt.</li>
            <li>Wir liefern nur innerhalb Deutschlands und der EU.</li>
          </ul>
        </section>

        {/* 5. Widerrufsrecht */}
        <section>
          <h2 className="text-xl font-semibold">5. Widerrufsrecht</h2>
          <p>Du kannst deine Bestellung innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen.</p>
          <p>📩 <strong>Widerruf per E-Mail an:</strong> blvckraystudio@gmail.com</p>
        </section>

        {/* 6. Gewährleistung & Haftung */}
        <section>
          <h2 className="text-xl font-semibold">6. Gewährleistung & Haftung</h2>
          <p>Bei Mängeln hast du gesetzliche Gewährleistungsrechte.</p>
          <p>Wir haften nicht für Schäden, die durch unsachgemäßen Gebrauch entstehen.</p>
        </section>

        {/* 7. Datenschutz */}
        <section>
          <h2 className="text-xl font-semibold">7. Datenschutz</h2>
          <p>Alle Daten werden gemäß unserer <a href="/privacy" className="text-blue-500 underline">Datenschutzerklärung</a> verarbeitet.</p>
        </section>

        {/* 8. Änderungen der AGB */}
        <section>
          <h2 className="text-xl font-semibold">8. Änderungen der AGB</h2>
          <p>Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern.</p>
          <p><strong>Letzte Aktualisierung:</strong> {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
