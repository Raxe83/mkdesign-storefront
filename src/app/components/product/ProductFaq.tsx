'use client'

import { useState } from "react";
import type { Metaobject } from "@/app/types/shopify";

interface Props {
  metaobjects: Metaobject[];
}

function fieldValue(fields: Metaobject["fields"], key: string): string | null {
  return fields.find((f) => f.key === key)?.value ?? null;
}

interface FaqItemProps {
  frage: string;
  antwort: string;
}

function FaqItem({ frage, antwort }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4 md:py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <dt className="text-sm font-medium text-primary dark:text-neutral-100">
          {frage}
        </dt>
        <span
          aria-hidden="true"
          className={`shrink-0 text-muted dark:text-neutral-400 transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <dd className="pr-8 text-sm text-muted dark:text-neutral-400 leading-relaxed whitespace-pre-line">
          {antwort}
        </dd>
      </div>
    </div>
  );
}

/**
 * Renders a FAQ accordion from `{category}_faq_pdp` Metaobjects.
 * Each entry needs `frage` (single_line_text) and `antwort` (multi_line_text).
 *
 * Shopify Metaobject setup:
 *   Type:   {category}_faq_pdp  (e.g. feuertonne_faq_pdp)
 *   Fields: frage (single_line_text_field), antwort (multi_line_text_field)
 *   One entry per FAQ item — sort order = Shopify list order.
 */
export function ProductFaq({ metaobjects }: Props) {
  const items = metaobjects
    .map((m) => ({
      frage: fieldValue(m.fields, "frage"),
      antwort: fieldValue(m.fields, "antwort"),
    }))
    .filter(
      (item): item is { frage: string; antwort: string } =>
        Boolean(item.frage && item.antwort),
    );

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="faq-heading"
      className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800"
    >
      <h2
        id="faq-heading"
        className="font-display text-xl font-medium text-primary dark:text-neutral-100 mb-6"
      >
        Häufige Fragen
      </h2>

      <dl className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
        {items.map((item, i) => (
          <FaqItem key={i} frage={item.frage} antwort={item.antwort} />
        ))}
      </dl>
    </section>
  );
}
