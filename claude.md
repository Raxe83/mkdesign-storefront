🏗️ 1. Arbeitsweise & Planung (Plan-First-Prinzip)

Bevor du auch nur eine Zeile Code schreibst, musst du zwingend diese Schritte befolgen:

    Problemverständnis: Fasse kurz in 1-2 Sätzen zusammen, was das genaue Ziel der Aufgabe ist.

    Der Plan: Erstelle IMMER eine nummerierte oder Bullet-Point-Liste mit den geplanten Schritten.

        Welche Dateien müssen erstellt/angepasst werden?

        Welche Komponenten werden benötigt?

        Gibt es Abhängigkeiten oder Edge-Cases zu beachten?

    Zustimmung (Optional): Warte auf mein "Go", falls der Plan komplex ist, oder beginne direkt mit der Umsetzung des Plans Schritt für Schritt.

    Schrittweise Umsetzung: Setze nicht alles in einem riesigen Code-Block um. Gehe logisch vor und erkläre, welchen Teil des Plans du gerade abarbeitest.

🏛️ 2. Architektur-Leitfaden & Clean Code
Modularität & Dateigröße

    Kleine Dateien: Eine Datei sollte idealerweise nicht länger als 150–200 Zeilen sein.

    Komponenten-Aufteilung: Sobald eine UI-Komponente komplexer wird oder mehr als zwei hierarchische Ebenen hat, lagere sie in kleinere Sub-Komponenten aus (z.B. CardHeader, CardBody, CardActions).

    Single Responsibility Principle (SRP): Jede Komponente, Funktion oder Klasse hat genau eine Aufgabe.

Separation of Concerns (Trennung von Logik und UI)

    UI (Ansicht): Komponenten sollten so "dumm" wie möglich sein. Sie nehmen Props entgegen und rendern UI.

    Logik (Verhalten): Komplexe Business-Logik, API-Calls oder umfangreicher State gehören in Custom Hooks (z.B. useUserFetch.ts) oder Utility-Funktionen.

    Utils: Reine Funktionen (Pure Functions) zur Datenverarbeitung immer in separate Dateien auslagern (utils/formatters.ts, etc.) und testbar halten.

Dateinamen & Ordnerstruktur

    Komponenten: PascalCase (z.B. UserProfile.tsx)

    Hooks: camelCase mit Präfix use (z.B. useAuth.ts)

    Utils/Helpers: camelCase (z.B. dateUtils.ts)

    Nutze Feature-basierte Ordnerstrukturen, wo sinnvoll (z.B. src/features/auth/components/).

Code-Qualität

    TypeScript First: Keine Verwendung von any. Typisiere Props, State und API-Responses strikt (Interfaces/Types).

    Early Returns: Vermeide tiefe Verschachtelungen (Nesting). Prüfe Fehler oder leere States früh und verlasse die Funktion (if (!data) return null;).

    DRY (Don't Repeat Yourself): Wiederkehrende UI-Elemente (z.B. Buttons, Badges, Inputs) MÜSSEN als wiederverwendbare Core-Komponenten angelegt werden.

🎨 3. Design-Prinzipien & Tailwind-Standards
Pflichtregeln für jede UI-Komponente
Farben & Theming

    Nutze ausschließlich CSS-Variablen oder ein konsistentes Tailwind-Theme (tailwind.config)

    Keine hardcodierten Hex-Werte im Markup – immer semantische Tokens (bg-primary, text-muted, etc.)

    Dark Mode ist Pflicht: jede Komponente muss mit dark: Klassen funktionieren

    Farbpalette: maximal 2–3 Akzentfarben, dominante Hauptfarbe + scharfer Akzent

Typografie

    Keine generischen Fonts (Arial, Inter, system-ui) ohne explizite Anfrage

    Display-Überschriften: Serif oder markanter Display-Font via @font-face / Google Fonts

    Body: lesbarer Sans-Serif, text-base leading-relaxed als Minimum

    Schriftgewichte: nur 400 (regular) und 500–600 (medium/semibold) – kein 700+ im Fließtext

    Überschriften immer mit tracking-tight oder tracking-normal, nie tracking-wide

Abstände & Layout

    Konsistentes Spacing-System: nur Tailwind-Skala (4px-Raster), keine willkürlichen px-Werte

    Sektions-Padding: py-16 px-6 (mobile) → py-24 px-[5vw] (desktop) als Ausgangspunkt

    Grid-Layouts bevorzugen: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

    Großzügiger Weißraum ist kein Fehler – gap und space-y lieber zu groß als zu klein

Komponenten-Ästhetik

    Cards: rounded-sm oder rounded (keine rounded-2xl / rounded-3xl ohne Grund)

    Borders: border border-stone-200/50 (subtil) – keine dicken Borders als Deko

    Shadows: sparsam – shadow-sm für Cards, shadow-md nur für Hover-States

    Buttons: immer transition-colors duration-200 + klarer Hover-State

    Kein generisches "AI-Slop"-Styling: keine lila Gradienten auf weißem Grund, keine overused purple/blue-Farbschemata

Animationen & Interaktionen

    CSS-only wo möglich: transition, hover:scale-[1.02], group-hover:

    Page-Load: staggered fade-in via animation-delay statt kein Feedback

    Hover-States bei allen interaktiven Elementen Pflicht (cursor-pointer + visuelles Feedback)

    Keine gratuitous Animationen – Motion muss Bedeutung transportieren

Responsive Design

    Mobile-first immer: Basis-Klassen = Mobile, dann md: und lg: erweitern

    Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

    Kein overflow-x-hidden als Bugfix – das Layout muss sauber sein

Bildsprache & visuelle Hierarchie

    Aspect ratios explizit setzen: aspect-video, aspect-square, aspect-[4/3]

    Bilder immer object-cover in ihrem Container

    Hero-Bereiche: dunkler Overlay über Bilder für Textlesbarkeit (bg-black/40)

    Visuelle Gewichtung: genau ein primäres Element pro Abschnitt (kein gleichwertiges Gewusel)

Verbotene Patterns
Plaintext

❌ style="color: #333"                → ✅ text-neutral-700 dark:text-neutral-300
❌ className="rounded-3xl p-10 ..."   → ✅ rounded p-6 (proportional)
❌ bg-purple-500 text-white gradient  → ✅ eigene Farbpalette aus tailwind.config
❌ <div style="margin-top: 37px">     → ✅ mt-8 oder mt-10 (Skala einhalten)
❌ font-bold überall                  → ✅ font-medium für UI, font-semibold für Titel
❌ shadow-2xl auf Cards               → ✅ shadow-sm + shadow-md on hover
❌ Riesige 500-Zeilen Komponenten     → ✅ Aufteilung in kleine, fokussierte Sub-Komponenten

Tailwind Config Vorlage

Wenn kein tailwind.config existiert, diesen Ausgangspunkt verwenden:
JavaScript

// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
      },
    },
  },
}

⚛️ 4. React & Next.js (App Router) Standards
Server vs. Client Components

    Default = Server Components: Jede Komponente ist standardmäßig eine Server Component.

    "use client" nur wenn nötig: Verwende die Direktive AUSSCHLIESSLICH, wenn Interaktivität zwingend ist (z.B. useState, useEffect, onClick, Browser-APIs).

    Client Components nach unten pushen: Halte Client Components so weit unten im Komponentenbaum wie möglich (Leaf Nodes). Vermeide es, große Layouts oder Pages zu Client Components zu machen.

State Management & URL

    URL als State: Verwende Search-Parameter (?page=2&filter=active) für globale UI-Zustände (Paginierung, Filter, Tabs). Nutze dafür Next.js useSearchParams().

    Lokaler State: Nutze useState nur für kurzlebige, isolierte UI-Zustände (z.B. Dropdown offen/geschlossen).

    Vermeide riesige Context-Provider: Nutze React Context nur für wirklich globale Dinge (z.B. Theme, Auth), nicht als Ersatz für Prop-Drilling kleinerer Datenmengen.

Data Fetching

    Server-seitiges Fetching bevorzugen: Lade Daten direkt in Server Components mit asynchronen Funktionen (async function Page() { const data = await getData(); }).

    Next.js Caching nutzen: Nutze das erweiterte fetch API von Next.js inklusive Caching-Strategien ({ cache: 'no-store' } oder { next: { revalidate: 3600 } }).

    Kein useEffect für initialen Data Fetch: Client-seitiges Laden von Basis-Daten über useEffect ist ein Anti-Pattern in Next.js.

Next.js Optimierungen

    Bilder: IMMER next/image (<Image />) verwenden anstelle des normalen <img> Tags. Breite und Höhe (oder fill) zwingend angeben.

    Links: IMMER next/link (<Link />) verwenden anstelle von normalen <a> Tags für internes Routing.

    Schriften: Nutze next/font für Performance-optimiertes Laden von Schriften ohne Layout Shifts (CLS).

✅ 5. Qualitäts-Check vor jedem Commit/jeder Antwort

Vor dem Fertigstellen einer UI-Komponente oder eines Features geht die AI folgende Checkliste gedanklich durch:

    [ ] Wurde ein Plan vorab erstellt und befolgt?

    [ ] Ist die Datei klein genug oder müssen Teile ausgelagert werden (max. ~200 Zeilen)?

    [ ] Ist die Logik sauber von der UI getrennt (Custom Hooks genutzt)?

    [ ] Funktioniert Dark Mode?

    [ ] Responsive auf Mobile getestet (Mobile First)?

    [ ] Alle interaktiven Elemente haben Hover-State?

    [ ] Kein hardcodierter Farbwert im Markup?

    [ ] Typografische Hierarchie klar erkennbar?

    [ ] Abstände konsistent mit dem restlichen Projekt?