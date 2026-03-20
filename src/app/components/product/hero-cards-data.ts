import type { HeroCard, ProductCategory } from "./product-category";

export const HERO_CARDS: Record<ProductCategory, HeroCard[]> = {
  stehtisch: [
    { imageIndex: 0, accentBg: "bg-teal-700",  title: "Optimale Stehhöhe",       body: "Ergonomisch auf 90–115 cm ausgelegt – perfekt für Stehempfänge, Messen und Gastronomie. Der Rücken dankt es." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Pflegeleichte Platte",     body: "Kratz- und feuchtigkeitsresistent behandelte Oberfläche. Ein feuchtes Tuch genügt – keine Spezialreiniger nötig." },
    { imageIndex: 0, accentBg: "bg-zinc-800",  title: "Getestete Stabilität",     body: "Tragkraft bis 60 kg geprüft. Das Metallgestell steht sicher – auch wenn es auf Veranstaltungen mal lebhafter zugeht." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "In 20 Minuten aufgebaut",  body: "Mitgeliefertes Werkzeug, klare Anleitung. Du brauchst keine Erfahrung – der Tisch steht, bevor dein Kaffee kalt wird." },
  ],

  feuertonne: [
    { imageIndex: 0, accentBg: "bg-zinc-900",  title: "3 Stunden Brenndauer", body: "Massiver 3–4 mm Stahl speichert Wärme und gibt sie gleichmäßig ab. Eine Füllung reicht für einen ganzen Abend." },
    { imageIndex: 1, accentBg: "bg-amber-800", title: "Ganzjährig draußen",    body: "Wetterfester Stahl für Garten, Terrasse und Camping. Ob Frühling, Herbst oder Winter – die Tonne macht mit." },
    { imageIndex: 0, accentBg: "bg-stone-700", title: "Sicher & kippsicher",   body: "Breite Standfüße verhindern Kippen. Mindestabstand zu Brennbarem einhalten – dann ist das Feuer entspannt genießbar." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "360° Atmosphäre",       body: "Gleichmäßige Wärme rund um die Tonne, stimmungsvolles Licht. Der perfekte Mittelpunkt für Herbst- und Winterabende." },
  ],

  "3d-druck": [
    { imageIndex: 0, accentBg: "bg-teal-700",  title: "0,1 mm Präzision",         body: "Schichtdicke von 0,1–0,2 mm für gestochen scharfe Details. Jedes Teil wird nach dem Druck einzeln geprüft." },
    { imageIndex: 1, accentBg: "bg-zinc-700",  title: "PLA – nachhaltig",          body: "Biologisch abbaubares PLA-Filament, formstabil und geruchsneutral. Gutes Gewissen beim Bestellen inklusive." },
    { imageIndex: 0, accentBg: "bg-rust",      title: "Individuell anpassbar",     body: "Farbe, Größe oder Motiv nach Wunsch ändern. Custom-Aufträge nehmen wir gerne entgegen – einfach schreiben." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Versandfertig in 24–48h",   body: "Druck, Prüfung, bruchsichere Verpackung – und dann auf dem Weg zu dir. Expressversand auf Wunsch." },
  ],

  laser: [
    { imageIndex: 0, accentBg: "bg-zinc-900",  title: "Gravur auf 0,05 mm",       body: "Hochpräziser Laserstrahl mit 0,05 mm Genauigkeit – für feinste Linien, scharfe Konturen und lesbare Kleintexte." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Holz, Acryl & Leder",      body: "Wir gravieren auf einer breiten Materialpalette: Holz, Sperrholz, Acryl, Leder, Schiefer, Glas und mehr." },
    { imageIndex: 0, accentBg: "bg-rust",      title: "Dein Motiv, exakt",        body: "Eigenes Bild, Logo oder Text hochladen – wir konvertieren und gravieren es pixelgenau auf dein Material." },
    { imageIndex: 1, accentBg: "bg-teal-700",  title: "Fertig in 1–2 Werktagen",  body: "Schnelle Produktion, sicherer Versand. Bestellungen bis 12 Uhr werden häufig noch am selben Tag gestartet." },
  ],

  "custom-design": [
    { imageIndex: 0, accentBg: "bg-rust",      title: "Du gestaltest, wir produzieren", body: "Im Design Editor platzierst du Formen, Texte und Bilder frei auf dem Produkt – wir drucken es genau so." },
    { imageIndex: 1, accentBg: "bg-teal-700",  title: "CMYK-kalibriert",               body: "Unsere Drucker sind nach CMYK-Profil kalibriert. Was du auf dem Bildschirm siehst, bekommst du auch gedruckt." },
    { imageIndex: 0, accentBg: "bg-stone-600", title: "2–5 Werktage Produktion",        body: "Nach Designfreigabe starten wir sofort. Expressproduktion möglich – frag uns einfach an." },
    { imageIndex: 1, accentBg: "bg-zinc-700",  title: "Eine Korrektur inklusive",       body: "Änderungswunsch vor dem Druck? Kein Problem – eine kostenlose Korrektur ist immer inbegriffen." },
  ],

  default: [
    { imageIndex: 0, accentBg: "bg-zinc-800",  title: "Geprüfte Qualität",    body: "Jedes Produkt durchläuft eine Qualitätskontrolle, bevor es das Haus verlässt. Kein Kompromiss." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Sicher verpackt",      body: "Bruchsicher, sorgfältig, zuverlässig. Deine Bestellung kommt unbeschadet an – garantiert." },
    { imageIndex: 0, accentBg: "bg-rust",      title: "Nachhaltig produziert", body: "Kurze Lieferwege, bewusste Materialien. Nachhaltigkeit ist kein Schlagwort bei uns – sie steckt im Prozess." },
    { imageIndex: 1, accentBg: "bg-teal-700",  title: "Faire Preise",         body: "Direktvertrieb ohne Zwischenhändler. Keine versteckten Kosten – der Preis den du siehst, ist der Preis den du zahlst." },
  ],
};
