"use client";

import Link from "next/link";
import { cn } from "../utils/utils";
import { PersonalizationVisual } from "./PersonalizationVisual";
import type { BarrelVariant } from "./PersonalizationVisual";
import { sanitizeInlineHtml } from "../utils/sanitizeHtml";

export interface PersonalizationStep {
  step: number;
  title: string;
  description: string;
}

export interface PersonalizationProps {
  sectionLabel?: string;
  title?: string;
  description?: string;
  steps?: PersonalizationStep[];
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image: { src: string; alt: string };
  pullQuote?: string;
  className?: string;
  disableBackground?: boolean;
  variant?: BarrelVariant;
}

const DEFAULT_STEPS: PersonalizationStep[] = [
  {
    step: 1,
    title: "Produkt auswählen",
    description: "Stöbert durch unsere Kategorien und findet das passende Produkt für Euren Anlass.",
  },
  {
    step: 2,
    title: "Motiv oder Text angeben",
    description: "Namen, Datum, Logo oder ein eigenes Bild – gebt es bei der Bestellung an oder schreibt uns direkt.",
  },
  {
    step: 3,
    title: "Handarbeit & Versand",
    description: "Markus fertigt Euer Unikat von Hand und versendet es direkt aus Bleckede an Euch.",
  },
];

export function Personalization({
  sectionLabel = "Wie es funktioniert",
  title = "Dein Produkt,<br/><em>dein Motiv</em>",
  description = "Personalisierung ist bei uns keine Ausnahme – es ist der Standard. Fast jedes Produkt kann mit Eurem Namen, Wunschdatum oder Motiv versehen werden.",
  steps = DEFAULT_STEPS,
  cta = { label: "Jetzt personalisieren", href: "/collections/wunschmotiv-und-personalisierung" },
  secondaryCta,
  image,
  pullQuote = "„Kein Produkt wie das andere",
  className,
  disableBackground = false,
  variant,
}: PersonalizationProps) {
  return (
    <div className={cn("w-full dark:bg-zinc-950", disableBackground ? "" : "bg-cream", className)}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Left: Text + Steps ── */}
          <div>
            <span className="block mb-2 text-xs font-medium tracking-[0.15em] uppercase text-rust">
              {sectionLabel}
            </span>
            <h2
              className={cn(
                "font-display font-bold leading-[1.1] tracking-tight mb-5",
                "text-[clamp(1.75rem,3.5vw,2.6rem)] text-charcoal dark:text-primary",
                "[&_em]:italic [&_em]:text-rust",
              )}
              dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(title) }}
            />
            {description && (
              <p className="text-stone dark:text-muted text-sm leading-[1.85] mb-10 max-w-[44ch]">
                {description}
              </p>
            )}
            <ol className="flex flex-col gap-6">
              {steps.map((s) => (
                <li key={s.step} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-rust flex items-center justify-center font-display font-bold text-white text-sm">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-medium text-charcoal dark:text-primary text-sm mb-0.5">{s.title}</p>
                    <p className="text-stone dark:text-muted text-sm leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            {(cta || secondaryCta) && (
              <div className="flex flex-wrap gap-3 mt-10">
                {cta && (
                  <Link
                    href={cta.href}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm bg-rust text-white text-sm font-medium tracking-[0.04em] uppercase transition-colors duration-200 hover:bg-rust-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2"
                  >
                    {cta.label}
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm border border-rust text-rust text-sm font-medium tracking-[0.04em] uppercase transition-colors duration-200 hover:bg-rust hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2"
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Animiertes Design-Visual ── */}
          <div className="relative">
            <PersonalizationVisual src={image.src} alt={image.alt} variant={variant} />
            {pullQuote && (
              <div className="absolute -bottom-4 -right-4 lg:-right-6 bg-rust text-white px-5 py-3 rounded-sm max-w-[200px] z-10">
                <p className="font-display italic text-sm leading-snug">{pullQuote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
