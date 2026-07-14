"use client";

import PageHeader from "../../components/PageHeader";
import { shopDetails } from "../../global";
import { TOS_PARTS, type TosBlock } from "./content";

function Block({ block }: { block: TosBlock }) {
  if (block.type === "subheading") {
    return <p className="text-primary font-medium pt-1">{block.text}</p>;
  }
  if (block.type === "list") {
    return (
      <ul className="space-y-1 pl-4 border-l border-zinc-200 dark:border-zinc-700">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted">{title}</h2>
      <div className="p-5 rounded border border-zinc-200 dark:border-zinc-800 space-y-3 text-sm text-muted leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="AGB"
        eyebrow="Rechtliches"
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "AGB" }]}
      />

      <div className="max-w-2xl space-y-10">
        {TOS_PARTS.map((part) => (
          <div key={part.heading} className="space-y-8">
            <div className="pt-2">
              <h2 className="font-display text-xl font-medium text-primary dark:text-neutral-100 mb-3">
                {part.heading}
              </h2>
              {part.intro.map((line, i) => (
                <p key={i} className="text-sm text-muted leading-relaxed mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>

            {part.sections.map((section) => (
              <Section key={section.title} title={section.title}>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </Section>
            ))}
          </div>
        ))}

        <Section title="Kontakt">
          <p>
            Fragen zu diesen Bedingungen richten Sie bitte an:{" "}
            <a href={`mailto:${shopDetails.contact.email}`} className="text-accent hover:underline">
              {shopDetails.contact.email}
            </a>
          </p>
          <p className="text-xs text-muted/70">Stand: 25. Juni 2026</p>
        </Section>
      </div>
    </div>
  );
}
