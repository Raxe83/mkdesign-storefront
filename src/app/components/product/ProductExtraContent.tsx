import Image from "next/image";
import { cn } from "@/app/utils/utils";
import type { Metaobject, MetaobjectField } from "@/app/types/shopify";

// ─── Feldextraktion ───────────────────────────────────────────────────────────

function resolveField(
  fields: MetaobjectField[],
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = fields.find((f) => f.key === key)?.value;
    if (value) return value;
  }
  return null;
}

function resolveImage(
  fields: MetaobjectField[],
  ...keys: string[]
): { url: string; alt: string | null } | null {
  for (const key of keys) {
    const field = fields.find((f) => f.key === key);
    if (!field) continue;
    if (field.reference?.image?.url) {
      return {
        url: field.reference.image.url,
        alt: field.reference.image.altText ?? null,
      };
    }
    if (field.value?.startsWith("http")) {
      return { url: field.value, alt: null };
    }
  }
  return null;
}

// ─── Akzentfarben (rotierend, analog zu HeroCards) ────────────────────────────

const ACCENT_BG = ["bg-zinc-800", "bg-rust", "bg-teal-700"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  metaobjects: Metaobject[];
}

// ─── Einzelner Eintrag ────────────────────────────────────────────────────────

function ExtraContentItem({ obj, index }: { obj: Metaobject; index: number }) {
  const { fields } = obj;

  const title = resolveField(fields, "titel", "title", "heading", "name");
  const subtitle = resolveField(
    fields,
    "sub_titel_tag",
    "subtitle",
    "untertitel",
    "eyebrow",
    "badge",
    "kategorie",
  );
  const description = resolveField(
    fields,
    "beschreibung",
    "description",
    "text",
    "inhalt",
    "content",
  );
  const image = resolveImage(
    fields,
    "bild",
    "image",
    "foto",
    "bild_url",
    "image_url",
  );
  const imageAlt = image?.alt ?? title ?? "Produktbild";
  const accentBg = ACCENT_BG[index % ACCENT_BG.length];
  const reversed = index % 3 !== 0;

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row",
        reversed && "md:flex-row-reverse",
      )}
    >
      {/* ── Bild ── */}
      <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[280px] overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-stone-200 dark:bg-zinc-700" />
        )}
      </div>

      {/* ── Text ── */}
      <div
        className={cn(
          "w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 py-10 md:py-14",
          accentBg,
        )}
      >
        {subtitle && (
          <p className="text-[10px] flex flex-row items-center gap-1 font-medium uppercase tracking-[0.18em] text-white/45 dark:text-white/60 mb-4">
            <span className="block w-8 h-px bg-white/45" />
            <span>{subtitle}</span>
          </p>
        )}

        {title && (
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-white leading-tight mb-4">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-sm md:text-[0.95rem] text-white/70 dark:text-white/80 leading-relaxed max-w-[34ch]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export function ProductExtraContent({ metaobjects }: Props) {
  if (metaobjects.length === 0) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded border border-stone-200/50 dark:border-zinc-700/50 shadow-sm divide-y divide-stone-200/40 dark:divide-zinc-700/40">
      {metaobjects.map((obj, index) => (
        <ExtraContentItem key={obj.id} obj={obj} index={index} />
      ))}
    </div>
  );
}
