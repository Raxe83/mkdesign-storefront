import type { Metaobject } from "@/app/types/shopify";

interface Props {
  metaobjects: Metaobject[];
}

function fieldValue(fields: Metaobject["fields"], key: string): string | null {
  return fields.find((f) => f.key === key)?.value ?? null;
}

/**
 * Renders a FAQ accordion from `{category}_faq_pdp` Metaobjects.
 * Each entry needs `frage` (single_line_text) and `antwort` (multi_line_text).
 * Uses native <details>/<summary> — no client JS required.
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
          <details key={i} className="group py-4 md:py-5">
            <summary className="flex cursor-pointer select-none items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
              <dt className="text-sm font-medium text-primary dark:text-neutral-100">
                {item.frage}
              </dt>
              {/* + rotates to × when open */}
              <span
                aria-hidden="true"
                className="shrink-0 text-muted dark:text-neutral-400 transition-transform duration-200 group-open:rotate-45"
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
            </summary>
            <dd className="mt-3 pr-8 text-sm text-muted dark:text-neutral-400 leading-relaxed whitespace-pre-line">
              {item.antwort}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  );
}
