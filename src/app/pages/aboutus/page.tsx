"use client";

import Link from "next/link";
import { Flame, Hammer, MapPin, Mail, Phone, Star, Palette, Package } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { shopDetails } from "../../global";

const products = [
  { icon: Flame, label: "Feuertonnen & Feuerschalen", description: "Handgefertigte Feuertonnen aus Stahl – massiv, langlebig und individuell." },
  { icon: Star, label: "Nachtlichter & Schlummerlichter", description: "Stimmungsvolle Lichter mit persönlichen Motiven für jeden Anlass." },
  { icon: Palette, label: "Gravuren & Personalisierungen", description: "Lasergravuren auf Schiefer, Holz, Metall und mehr." },
  { icon: Package, label: "Weinverpackungen & Holzschilder", description: "Edle Holzkisten und Schilder – perfekt als Geschenk oder Dekoration." },
  { icon: Hammer, label: "Stehtische & Tischplatten", description: "Robuste Stehtische aus dem eigenen Werkstattbetrieb – auch beheizt." },
];

const values = [
  {
    title: "Handarbeit",
    description: "Jedes Produkt entsteht in unserer Werkstatt in Bleckede – von Hand gefertigt und mit Sorgfalt verarbeitet.",
  },
  {
    title: "Individualität",
    description: "Kein Stück ist wie das andere. Persönliche Gravuren, Wunschtexte und eigene Designs machen jedes Produkt zum Unikat.",
  },
  {
    title: "Qualität",
    description: "Wir verwenden ausschließlich hochwertige Materialien – Stahl, Schiefer, massives Holz – für Produkte, die Bestand haben.",
  },
  {
    title: "Direktvertrieb",
    description: "Keine Zwischenhändler. Ihr kauft direkt beim Hersteller – faire Preise, persönlicher Kontakt, schnelle Antworten.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Über uns"
        eyebrow="M.K. Design"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Über uns" },
        ]}
      />

      {/* Intro */}
      <div className="max-w-2xl space-y-4 mb-16">
        <p className="text-base text-primary dark:text-neutral-100 leading-relaxed font-medium">
          Willkommen bei M.K. Design – der Werkstatt von Markus Klement aus Bleckede.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Was als Hobby begann, ist heute ein kleiner Betrieb mit großer Leidenschaft: Wir fertigen
          personalisierte Produkte in Handarbeit – von massiven Feuertonnen über gravierte Schieferuhren
          bis hin zu individuellen Nachtlichtern und Holzschildern. Direkt aus unserer Werkstatt zu Euch.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Hinter M.K. Design steht Markus Klement – Handwerker, Designer und Tüftler aus Überzeugung.
          Der Name ist Programm: Jedes Stück trägt seine Handschrift, jedes Produkt wird mit dem Anspruch
          gebaut, länger zu halten als erwartet.
        </p>
      </div>

      {/* Values */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="block w-8 h-px bg-rust" />
          <span className="text-xs font-medium text-rust tracking-[0.15em] uppercase">Unsere Werte</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-5 rounded border border-zinc-200 dark:border-zinc-800 space-y-1.5"
            >
              <p className="text-sm font-medium text-primary dark:text-neutral-100">{v.title}</p>
              <p className="text-sm text-muted leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="block w-8 h-px bg-rust" />
          <span className="text-xs font-medium text-rust tracking-[0.15em] uppercase">Was wir machen</span>
        </div>
        <div className="space-y-3 max-w-2xl">
          {products.map((p) => (
            <div
              key={p.label}
              className="flex items-start gap-4 p-5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150"
            >
              <div className="w-10 h-10 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <p.icon size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary dark:text-neutral-100">{p.label}</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop / Location */}
      <div className="mb-16 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="block w-8 h-px bg-rust" />
          <span className="text-xs font-medium text-rust tracking-[0.15em] uppercase">Werkstatt & Standort</span>
        </div>
        <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 space-y-4">
          <p className="text-sm text-muted leading-relaxed">
            Unsere Werkstatt befindet sich in der Industriestraße in Bleckede – mitten in der Natur der
            Lüneburger Heide. Hier entstehen alle Produkte: geschweißt, graviert, geschliffen, montiert.
            Wer persönlich vorbeikommen möchte, darf sich gerne melden.
          </p>
          <div className="flex flex-col gap-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={15} className="text-muted shrink-0" />
              <span className="text-muted">
                {shopDetails.contact.address}, {shopDetails.contact.city}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={15} className="text-muted shrink-0" />
              <a
                href={`tel:${shopDetails.contact.phone}`}
                className="text-muted hover:text-primary dark:hover:text-neutral-100 transition-colors"
              >
                {shopDetails.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={15} className="text-muted shrink-0" />
              <a
                href={`mailto:${shopDetails.contact.email}`}
                className="text-muted hover:text-primary dark:hover:text-neutral-100 transition-colors"
              >
                {shopDetails.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/pages/products"
          className="inline-flex items-center justify-center h-10 px-5 rounded bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200"
        >
          Alle Produkte entdecken
        </Link>
        <Link
          href="/pages/contact"
          className="inline-flex items-center justify-center h-10 px-5 rounded border border-zinc-300 dark:border-zinc-700 text-primary dark:text-neutral-100 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
        >
          Kontakt aufnehmen
        </Link>
      </div>
    </div>
  );
}
