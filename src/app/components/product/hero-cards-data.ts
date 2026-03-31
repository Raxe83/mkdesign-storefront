import type { HeroCard, ProductCategory } from "./product-category";

export const HERO_CARDS: Record<ProductCategory, HeroCard[]> = {
  "stehtisch-zubehoer": [
    { imageIndex: 0, accentBg: "bg-rust",      title: "Wärme gezielt lenken",          body: "Die Wärmehaube (Ø 80 cm) sitzt auf dem Abzugsrohr und lenkt die Hitze zu den Gästen statt nutzlos nach oben. Gleichzeitig Windschutz und Funkensperre – besonders bei Veranstaltungen im Freien." },
    { imageIndex: 1, accentBg: "bg-zinc-800",  title: "Feueröffnung sauber abdecken",  body: "Das Lochblech liegt passgenau über der Feueröffnung. Funken und Asche bleiben unten, der Tisch wirkt aufgeräumt – egal ob das Feuer brennt oder nicht. Stahl, handgefertigt." },
    { imageIndex: 0, accentBg: "bg-stone-600", title: "Wetterfest einlagern",           body: "Der wasserdichte Überwurf (190 × 115 cm, 210D-Oxford-Tuch) schützt den Stehtisch vor Regen, UV und Staub. Kordelzug und Reißverschluss halten auch bei Wind sicher." },
    { imageIndex: 1, accentBg: "bg-teal-700",  title: "Ersatzteile griffbereit",        body: "Der Holzgriff (135 mm, Ø 24 mm) ist identisch mit dem verbauten – direkt austauschbar, Schraube inklusive. Kein langes Suchen, kein Warten." },
  ],

  stehtisch: [
    { imageIndex: 0, accentBg: "bg-teal-700",  title: "Optimale Stehhöhe",       body: "Ergonomisch auf 90–115 cm ausgelegt – perfekt für Stehempfänge, Messen und Gastronomie. Der Rücken dankt es." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Pflegeleichte Platte",     body: "Kratz- und feuchtigkeitsresistent behandelte Oberfläche. Ein feuchtes Tuch genügt – keine Spezialreiniger nötig." },
    { imageIndex: 0, accentBg: "bg-zinc-800",  title: "Getestete Stabilität",     body: "Tragkraft bis 60 kg geprüft. Das Metallgestell steht sicher – auch wenn es auf Veranstaltungen mal lebhafter zugeht." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "In 20 Minuten aufgebaut",  body: "Mitgeliefertes Werkzeug, klare Anleitung. Du brauchst keine Erfahrung – der Tisch steht, bevor dein Kaffee kalt wird." },
  ],

  feuerschale: [
    { imageIndex: 0, accentBg: "bg-zinc-900",  title: "Lebensmittelstahl, kein Öltonnen-Blech", body: "1,2 mm Stahlblech aus der Lebensmittelindustrie – sauber, robust, langlebig. Ein anderes Kaliber als die dünnen Billigschalen, die nach einem Winter rosten." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Motiv leuchtet im Feuer",                body: "Per Laser präzise eingeschnitten, nicht aufgeklebt. Wenn das Feuer brennt, leuchtet das Motiv von innen durch den Stahl – jede Schale wird zum Lichtobjekt." },
    { imageIndex: 0, accentBg: "bg-rust",      title: "Klein oder XL",                          body: "48 cm hoch für Balkon und Terrasse, 78 cm hoch für den Garten. Beide Varianten gibt es einseitig oder zweiseitig graviert – dein Motiv, deine Wahl." },
    { imageIndex: 1, accentBg: "bg-teal-700",  title: "Jedes Stück ein Unikat",                 body: "Sandgestrahlt, lackiert, graviert – einzeln, nicht vom Band. Wer ein eigenes Motiv möchte, schickt eine Nachricht. Wir setzen es um." },
  ],

  feuertonne: [
    { imageIndex: 0, accentBg: "bg-zinc-900",  title: "3 Stunden Brenndauer", body: "Massiver 3–4 mm Stahl speichert Wärme und gibt sie gleichmäßig ab. Eine Füllung reicht für einen ganzen Abend." },
    { imageIndex: 1, accentBg: "bg-amber-800", title: "Ganzjährig draußen",    body: "Wetterfester Stahl für Garten, Terrasse und Camping. Ob Frühling, Herbst oder Winter – die Tonne macht mit." },
    { imageIndex: 0, accentBg: "bg-stone-700", title: "Sicher & kippsicher",   body: "Breite Standfüße verhindern Kippen. Mindestabstand zu Brennbarem einhalten – dann ist das Feuer entspannt genießbar." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "360° Atmosphäre",       body: "Gleichmäßige Wärme rund um die Tonne, stimmungsvolles Licht. Der perfekte Mittelpunkt für Herbst- und Winterabende." },
  ],

  schieferuhr: [
    { imageIndex: 0, accentBg: "bg-stone-700", title: "Echter Naturschiefer",        body: "Kein Kunststoff, kein Laminat – echter Stein. Jede Uhr hat eine eigene Maserung, gebrochene Kanten. Man sieht, dass sie nicht aus dem Katalog kommt." },
    { imageIndex: 1, accentBg: "bg-zinc-800",  title: "Motiv dauerhaft graviert",    body: "Per Laser in den Stein geschnitten – tief, scharf, dauerhaft. Kein Aufkleber, keine Folie. Verblasst nicht, löst sich nicht ab." },
    { imageIndex: 0, accentBg: "bg-stone-600", title: "10 Zeigervarianten",          body: "Von klassisch schwarz bis farbenfroh. Das Motiv bleibt gleich – der Charakter ändert sich. Einfach beim Kauf auswählen." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "Geschenk mit Gewicht",        body: "Verpackt, sofort einsatzbereit, wirkungsstark. Ideal zu Geburtstagen, Einzügen und Hochzeiten – mit oder ohne persönliche Gravur." },
  ],

  nachtlicht: [
    { imageIndex: 0, accentBg: "bg-zinc-900",  title: "Motiv leuchtet von innen",   body: "LED-Licht strahlt durch das 3D-gedruckte Motiv. Kein blendender Schein – stimmungsvolles, warmes Licht für Schlafzimmer, Kinderzimmer und Wohnbereich." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Sofort einsatzbereit",       body: "Motiv, LED-Sockel und USB-Netzteil (5V) im Lieferumfang. Einstecken, fertig. Keine Batterie, kein Zubehör." },
    { imageIndex: 0, accentBg: "bg-teal-700",  title: "Über 80 Motive",             body: "Tiere, Fahrzeuge, Weihnachten, Fantasy – für fast jeden Geschmack etwas dabei. Eigenes Wunschmotiv auf Anfrage möglich." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "Geschenk mit Wirkung",       body: "Verpackt, sofort einsatzbereit, motiv-stark. Beim ersten Einschalten weiß man warum man es gekauft hat." },
  ],

  holzuhr: [
    { imageIndex: 0, accentBg: "bg-amber-800", title: "Echtholz Buche",             body: "Kein Furnier, kein Pressspan – echte Buche. Das Motiv ist dauerhaft ins Holz eingearbeitet, kein Aufkleber, der sich mit der Zeit ablöst." },
    { imageIndex: 1, accentBg: "bg-zinc-800",  title: "Kein Ticken",                body: "Lautloses Quarzuhrwerk – ideal für Schlafzimmer, Arbeitszimmer und alle Räume, in denen Stille zählt." },
    { imageIndex: 0, accentBg: "bg-stone-600", title: "Motiv mit Charakter",        body: "Barsch, Segelschiff, Coffee – jede Uhr hat ein klares Thema. Eigene Motive sind auf Anfrage möglich." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "Geschenk ohne Erklärung",   body: "Verpackt, sofort einsatzbereit, motiv-stark. Beliebt zu Geburtstagen, Einzügen und Weihnachten." },
  ],

  holzschild: [
    { imageIndex: 0, accentBg: "bg-amber-800", title: "Echtholz Buche",              body: "Kein Pressspan, kein MDF – echte Buche. Dicht, hart, langlebig. Sieht nach Handwerk aus, nicht nach Ramschangebot." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Der Spruch bleibt",           body: "Dauerhaft im Holz eingearbeitet – nicht aufgeklebt, nicht aufgedruckt. Verblasst nicht, löst sich nicht ab. Einfach hält." },
    { imageIndex: 0, accentBg: "bg-zinc-800",  title: "Juteseil inklusive",          body: "Sofort aufhängbar. Kein Bohren, kein Werkzeug. Einen Haken, Seil drüber – fertig. Überall passend: Küche, Flur, Werkstatt." },
    { imageIndex: 1, accentBg: "bg-rust",      title: "Geschenk ohne große Worte",   body: "Der richtige Spruch trifft ohne Erklärung. Verpackt, sofort einsatzbereit – Geburtstag, Einzug oder einfach so." },
  ],

  grillzubehoer: [
    { imageIndex: 0, accentBg: "bg-zinc-900",  title: "Stahl aus der Werkstatt",   body: "Jede Platte, jeder Einsatz – handgefertigt in Deutschland. Kein Katalogzubehör, sondern Werkzeug das wirklich hält." },
    { imageIndex: 1, accentBg: "bg-stone-600", title: "Das Plancha-System",        body: "Grillplatte, Einsatz, Wokaufsatz – alles aufeinander abgestimmt. Jedes Teil passt zum nächsten, passgenau auf Ø 20 cm." },
    { imageIndex: 0, accentBg: "bg-rust",      title: "Gleichmäßige Hitze",        body: "6 mm Stahl speichert Wärme länger als dünne Alternativen. Steaks scharf anbraten, Gemüse sanft garen – auf einer Platte." },
    { imageIndex: 1, accentBg: "bg-teal-700",  title: "Einfach pflegen",           body: "Heiß abwischen, einölen, fertig. Edelstahlvarianten kommen in die Spülmaschine. Stahl entwickelt Charakter – keine Angst vor Patina." },
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
