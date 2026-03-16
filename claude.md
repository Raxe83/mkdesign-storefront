# Design-Prinzipien & Tailwind-Standards

## Pflichtregeln für jede UI-Komponente

### Farben & Theming
- Nutze ausschließlich CSS-Variablen oder ein konsistentes Tailwind-Theme (`tailwind.config`)
- Keine hardcodierten Hex-Werte im Markup – immer semantische Tokens (`bg-primary`, `text-muted`, etc.)
- Dark Mode ist Pflicht: jede Komponente muss mit `dark:` Klassen funktionieren
- Farbpalette: maximal 2–3 Akzentfarben, dominante Hauptfarbe + scharfer Akzent

### Typografie
- Keine generischen Fonts (Arial, Inter, system-ui) ohne explizite Anfrage
- Display-Überschriften: Serif oder markanter Display-Font via `@font-face` / Google Fonts
- Body: lesbarer Sans-Serif, `text-base leading-relaxed` als Minimum
- Schriftgewichte: nur 400 (regular) und 500–600 (medium/semibold) – kein 700+ im Fließtext
- Überschriften immer mit `tracking-tight` oder `tracking-normal`, nie `tracking-wide`

### Abstände & Layout
- Konsistentes Spacing-System: nur Tailwind-Skala (4px-Raster), keine willkürlichen `px`-Werte
- Sektions-Padding: `py-16 px-6` (mobile) → `py-24 px-[5vw]` (desktop) als Ausgangspunkt
- Grid-Layouts bevorzugen: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Großzügiger Weißraum ist kein Fehler – `gap` und `space-y` lieber zu groß als zu klein

### Komponenten-Ästhetik
- Cards: `rounded-sm` oder `rounded` (keine `rounded-2xl` / `rounded-3xl` ohne Grund)
- Borders: `border border-stone-200/50` (subtil) – keine dicken Borders als Deko
- Shadows: sparsam – `shadow-sm` für Cards, `shadow-md` nur für Hover-States
- Buttons: immer `transition-colors duration-200` + klarer Hover-State
- Kein generisches "AI-Slop"-Styling: keine lila Gradienten auf weißem Grund, keine overused purple/blue-Farbschemata

### Animationen & Interaktionen
- CSS-only wo möglich: `transition`, `hover:scale-[1.02]`, `group-hover:`
- Page-Load: staggered fade-in via `animation-delay` statt kein Feedback
- Hover-States bei allen interaktiven Elementen Pflicht (`cursor-pointer` + visuelles Feedback)
- Keine gratuitous Animationen – Motion muss Bedeutung transportieren

### Responsive Design
- Mobile-first immer: Basis-Klassen = Mobile, dann `md:` und `lg:` erweitern
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Kein `overflow-x-hidden` als Bugfix – das Layout muss sauber sein

### Bildsprache & visuelle Hierarchie
- Aspect ratios explizit setzen: `aspect-video`, `aspect-square`, `aspect-[4/3]`
- Bilder immer `object-cover` in ihrem Container
- Hero-Bereiche: dunkler Overlay über Bilder für Textlesbarkeit (`bg-black/40`)
- Visuelle Gewichtung: genau ein primäres Element pro Abschnitt (kein gleichwertiges Gewusel)

## Verbotene Patterns
```
❌ style="color: #333"                → ✅ text-neutral-700 dark:text-neutral-300
❌ className="rounded-3xl p-10 ..."   → ✅ rounded p-6 (proportional)
❌ bg-purple-500 text-white gradient  → ✅ eigene Farbpalette aus tailwind.config
❌ <div style="margin-top: 37px">     → ✅ mt-8 oder mt-10 (Skala einhalten)
❌ font-bold überall                  → ✅ font-medium für UI, font-semibold für Titel
❌ shadow-2xl auf Cards               → ✅ shadow-sm + shadow-md on hover
```

## Tailwind Config Vorlage

Wenn kein `tailwind.config` existiert, diesen Ausgangspunkt verwenden:
```js
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
```

## Qualitäts-Check vor jedem Commit

Vor dem Fertigstellen einer UI-Komponente:
- [ ] Funktioniert Dark Mode?
- [ ] Responsive auf Mobile getestet?
- [ ] Alle interaktiven Elemente haben Hover-State?
- [ ] Kein hardcodierter Farbwert im Markup?
- [ ] Typografische Hierarchie klar erkennbar?
- [ ] Abstände konsistent mit dem restlichen Projekt?