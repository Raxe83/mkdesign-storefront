'use client'

import React from "react";

const Impressum: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">📜 Impressum</h1>

      <div className="space-y-6">
        {/* Verantwortlicher */}
        <section>
          <h2 className="text-xl mb-4 font-semibold">
            Verantwortlich für den Inhalt:
          </h2>
          <div className="flex flex-col gap-4">
            <p>
              <strong>Blvckray Studios UG (Haftungsbeschränkt)</strong> <br />
              Krönerweg 8 <br />
              29525 Uelzen <br />
              Deutschland
            </p>
          </div>
        </section>

        {/* Kontakt */}
        <section>
          <h2 className="text-xl font-semibold">Kontakt</h2>
          <p>
            E-Mail: <strong>blvckraystudio@gmail.com</strong> <br />
            Website: <strong>www.rayden-studio.com/</strong>
          </p>
        </section>

        {/* USt-ID */}
        <section>
          <h2 className="text-xl font-semibold">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:{" "}
            <strong>DE123456789</strong>
          </p>
        </section>

        {/* Handelsregister */}
        <section>
          <h2 className="text-xl font-semibold">Handelsregister</h2>
          <p>
            Eingetragen im Handelsregister beim Amtsgericht Musterstadt <br />
            Registernummer: <strong>HRB 12345</strong>
          </p>
        </section>

        {/* Online-Streitbeilegung */}
        <section>
          <h2 className="text-xl font-semibold">Online-Streitbeilegung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
        </section>

        {/* Haftungsausschluss */}
        <section>
          <h2 className="text-xl font-semibold">Haftung für Inhalte</h2>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
            die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
            wir jedoch keine Gewähr übernehmen.
          </p>
        </section>

        {/* Urheberrecht */}
        <section>
          <h2 className="text-xl font-semibold">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Impressum;
