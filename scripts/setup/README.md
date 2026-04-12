# scripts/setup — Einmalige Setup-Scripts

> **WARNUNG: Diese Scripts sind einmalige Setup-Scripts für die initiale Shopify-Befüllung.**
> Sie wurden bereits ausgeführt. Nicht erneut starten, ohne die Auswirkungen zu prüfen —
> viele Scripts erstellen oder überschreiben Metaobjekte, Tags und Produktdaten in Shopify.

## Wann wurde was ausgeführt?

Alle Scripts wurden im Rahmen der initialen Shop-Einrichtung (2025–2026) ausgeführt.
Details und Protokolle: `Raxe_Dev_Brain/01_Shopify_Ecosystem/`

---

## Übersicht

### create-* — Metaobjekt-Erstellung (FAQ & Extra-Info)

Erstellen FAQ- und Extra-Info-Metaobjekte für Produktkategorien in Shopify.

| Script | Kategorie |
|--------|-----------|
| `create-feuerschale-faq.mjs` | Feuerschale – FAQ |
| `create-feuerschale-extra-info.mjs` | Feuerschale – Extra-Info |
| `create-feuertonne-faq.mjs` | Feuertonne – FAQ |
| `create-grillzubehoer-faq.mjs` | Grillzubehör – FAQ |
| `create-holzschild-faq.mjs` | Holzschild – FAQ |
| `create-holzschild-extra-info.mjs` | Holzschild – Extra-Info |
| `create-holzuhr-faq.mjs` | Holzuhr – FAQ |
| `create-holzuhr-extra-info.mjs` | Holzuhr – Extra-Info |
| `create-nachtlicht-faq.mjs` | Nachtlicht – FAQ |
| `create-nachtlicht-extra-info.mjs` | Nachtlicht – Extra-Info |
| `create-schieferuhr-faq.mjs` | Schieferuhr – FAQ |
| `create-schieferuhr-extra-info.mjs` | Schieferuhr – Extra-Info |
| `create-schieferuntersetzer-faq.mjs` | Schieferuntersetzer – FAQ |
| `create-schieferuntersetzer-extra-info.mjs` | Schieferuntersetzer – Extra-Info |
| `create-stehtisch-faq.mjs` | Stehtisch – FAQ |
| `create-stehtisch-zubehoer-faq.mjs` | Stehtisch-Zubehör – FAQ |
| `create-stehtisch-zubehoer-extra-info.mjs` | Stehtisch-Zubehör – Extra-Info |
| `create-weinverpackung-faq.mjs` | Weinverpackung – FAQ |
| `create-weinverpackung-extra-info.mjs` | Weinverpackung – Extra-Info |
| `create-collection-stehtisch-zubehoer.mjs` | Kollektion Stehtisch-Zubehör anlegen |
| `create-product-lochblech.mjs` | Produkt Lochblech anlegen |

### update-* — Produktdaten-Aktualisierung

Aktualisieren Metafelder, Beschreibungen, Tags und andere Produktdaten per Bulk in Shopify.

| Script | Kategorie |
|--------|-----------|
| `update-feuertonnen.mjs` | Feuertonnen |
| `update-feuerschalen.mjs` | Feuerschalen |
| `update-feuer-grill-zubehoer.mjs` | Feuer- & Grillzubehör |
| `update-holzschilder.mjs` | Holzschilder |
| `update-holzuhren.mjs` | Holzuhren |
| `update-nachtlichter.mjs` | Nachtlichter |
| `update-schieferuhren.mjs` | Schieferuhren |
| `update-schieferuntersetzer.mjs` | Schieferuntersetzer |
| `update-stehtische.mjs` | Stehtische |
| `update-stehtisch-products.mjs` | Stehtisch-Produkte (allgemein) |
| `update-stehtisch-zubehoer.mjs` | Stehtisch-Zubehör |
| `update-weinverpackungen.mjs` | Weinverpackungen |

### seed-* — Spezifikationen befüllen

Befüllen technische Spezifikationen (Metafelder) für Produktgruppen.

| Script | Zweck |
|--------|-------|
| `seed-feuertonne-specs.mjs` | Technische Daten Feuertonnen |
| `seed-stehtisch-schale-specs.mjs` | Technische Daten Stehtische & Schalen |

### Sonstige Einmal-Scripts

| Script | Zweck |
|--------|-------|
| `tag-feuertonnen.mjs` | Tags auf Feuertonne-Produkte setzen |
| `fix-feuertonne-tags.mjs` | Tags korrigieren (Bugfix-Lauf) |
| `strip-specs-from-descriptions.mjs` | Spezifikationen aus Beschreibungen entfernen (Migration) |
| `export-products-brain.mjs` | Produktdaten in Brain-Format exportieren |

---

## Voraussetzungen (falls ein Script erneut gebraucht wird)

```bash
# .env.local muss gesetzt sein:
SHOPIFY_STORE_DOMAIN=...
SHOPIFY_ADMIN_API_TOKEN=...

# Ausführen (Beispiel):
node scripts/setup/create-nachtlicht-faq.mjs
```

Vor dem Ausführen immer prüfen:
1. Welche Shopify-Objekte werden angelegt / überschrieben?
2. Existiert das Ziel-Metaobjekt bereits?
3. Gibt es einen Dry-Run-Modus im Script?
