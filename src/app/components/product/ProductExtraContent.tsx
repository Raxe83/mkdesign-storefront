import Image from "next/image";
import { cn } from "@/app/utils/utils";
import type { Metaobject, MetaobjectField } from "@/app/types/shopify";

// ─── Feldextraktion ───────────────────────────────────────────────────────────

function resolveField(fields: MetaobjectField[], ...keys: string[]): string | null {
  for (const key of keys) {
    const value = fields.find((f) => f.key === key)?.value;
    if (value) return value;
  }
  return null;
}

function resolveImage(fields: MetaobjectField[], ...keys: string[]): { url: string; alt: string | null } | null {
  for (const key of keys) {
    const field = fields.find((f) => f.key === key);
    if (!field) continue;
    if (field.reference?.image?.url) {
      return { url: field.reference.image.url, alt: field.reference.image.altText ?? null };
    }
    if (field.value?.startsWith("http")) {
      return { url: field.value, alt: null };
    }
  }
  return null;
}

// ─── Akzentpalette ────────────────────────────────────────────────────────────
// Jede Farbe hat: Hintergrund, dekorative Nummer, Overlay auf dem Bild

const ACCENTS = [
  { bg: "bg-zinc-900",  num: "text-white/[0.04]", imgOverlay: "bg-gradient-to-r from-zinc-900/30 to-transparent" },
  { bg: "bg-rust",      num: "text-white/[0.06]", imgOverlay: "bg-gradient-to-l from-rust/25 to-transparent" },
  { bg: "bg-teal-800",  num: "text-white/[0.05]", imgOverlay: "bg-gradient-to-r from-teal-900/30 to-transparent" },
  // { bg: "bg-stone-700", num: "text-white/[0.05]", imgOverlay: "bg-gradient-to-l from-stone-700/25 to-transparent" },
  // { bg: "bg-amber-900", num: "text-white/[0.05]", imgOverlay: "bg-gradient-to-r from-amber-900/30 to-transparent" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  metaobjects: Metaobject[];
}

// ─── Einzelner Eintrag ────────────────────────────────────────────────────────

function ExtraContentItem({ obj, index }: { obj: Metaobject; index: number }) {
  const { fields } = obj;

  const title       = resolveField(fields, "titel",        "title",       "heading",    "name");
  const subtitle    = resolveField(fields, "sub_titel_tag","subtitle",    "untertitel", "eyebrow", "badge", "kategorie");
  const description = resolveField(fields, "beschreibung", "description", "text",       "inhalt",  "content");
  const image       = resolveImage(fields,  "bild",         "image",       "foto",       "bild_url","image_url");
  const imageAlt    = image?.alt ?? title ?? "Produktbild";

  const accent   = ACCENTS[index % ACCENTS.length];
  const reversed = index % 2 !== 0;
  const numLabel = String(index + 1).padStart(2, "0");

  return (
    <div className={cn("flex flex-col md:flex-row", reversed && "md:flex-row-reverse")}>

      {/* ── Bild ── */}
      <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[300px] overflow-hidden">
        {image ? (
          <>
            <Image
              src={image.url}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* farbiger Gradient-Übergang zum Text-Panel */}
            <div className={cn("absolute inset-0", accent.imgOverlay)} />
          </>
        ) : (
          <div className={cn("w-full h-full", accent.bg, "opacity-60")} />
        )}
      </div>

      {/* ── Text ── */}
      <div className={cn(
        "relative w-full md:w-1/2 flex flex-col justify-center overflow-hidden",
        "px-8 md:px-14 py-12 md:py-16",
        accent.bg,
      )}>
        {/* Dekorative Zahl im Hintergrund */}
        <span
          aria-hidden
          className={cn(
            "absolute right-6 bottom-4 font-display font-semibold leading-none select-none pointer-events-none",
            "text-[8rem] md:text-[10rem]",
            accent.num,
          )}
        >
          {numLabel}
        </span>

        {/* Inhalt */}
        <div className="relative z-10 flex flex-col gap-4">
          {subtitle && (
            <div className="flex items-center gap-3">
              <span className="block w-6 h-px bg-white/40 shrink-0" />
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                {subtitle}
              </p>
            </div>
          )}

          {title && (
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm md:text-[0.95rem] text-white/70 leading-relaxed max-w-[34ch]">
              {description}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export function ProductExtraContent({ metaobjects }: Props) {
  if (metaobjects.length === 0) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded border border-stone-200/50 dark:border-zinc-700/50 shadow-sm divide-y divide-black/10">
      {metaobjects.map((obj, index) => (
        <ExtraContentItem key={obj.id} obj={obj} index={index} />
      ))}
    </div>
  );
}
