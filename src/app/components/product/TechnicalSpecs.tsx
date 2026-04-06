import type { SpecRow } from "@/app/utils/parseProductDescription";

interface Props {
  specs: SpecRow[];
}

export function TechnicalSpecs({ specs }: Props) {
  if (specs.length === 0) return null;

  return (
    <section className="mt-12 pt-10 z-10 border-t border-zinc-200/60 dark:border-zinc-800">
      <p className="text-xs uppercase tracking-widest text-muted dark:text-neutral-400 mb-5">
        Technische Details
      </p>
      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-200/60 dark:bg-zinc-800 rounded overflow-hidden border border-zinc-200/60 dark:border-zinc-800">
        {specs.map((spec, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 px-5 py-4 bg-white dark:bg-zinc-950"
          >
            <dt className="text-[10px] uppercase tracking-widest font-medium text-muted dark:text-neutral-500">
              {spec.label}
            </dt>
            <dd className="text-sm font-medium text-primary dark:text-neutral-100">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
