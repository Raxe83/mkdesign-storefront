"use client";

import { useState, useEffect } from "react";
import type { ProductZusatzoptionen, ZusatzproduktOption } from "@/app/types/shopify";
import { ZusatzprodukteGrid } from "./ZusatzprodukteGrid";

/** Mapping: Shopify-Farbname (lowercase) → CSS-Farbe.
 *  Nutzt die barrel-CSS-Variablen wo passend, sonst Standard-CSS-Farben. */
const COLOR_MAP: Record<string, string> = {
  schwarz:  "var(--barrel-schwarz)",
  grau:     "var(--barrel-grau)",
  silber:   "var(--barrel-silber)",
  gold:     "var(--barrel-gold)",
  weiß:     "#ffffff",
  weiss:    "#ffffff",
  weis:     "#ffffff",
  braun:    "#8B5E3C",
  kupfer:   "#B87333",
  bronze:   "#CD7F32",
  rot:      "#C0392B",
  blau:     "#2980B9",
  grün:     "#27AE60",
  natur:    "#D4C5A9",
  edelstahl:"#b0b8c1",
};

function colorSwatch(name: string): string | null {
  return COLOR_MAP[name.toLowerCase().trim()] ?? null;
}

export interface ProductExtrasValues {
  textfelder: string[];
  zusatzprodukte: ZusatzproduktOption[];
  optionen: string[];
  entscheid: string;
  farbe: string;
}

interface Props {
  config: ProductZusatzoptionen;
  onChange: (values: ProductExtrasValues) => void;
}

const DATE_KEYWORDS = ["datum", "date", "geburtstag", "hochzeitstag", "jahrestag", "termin"];

function isDateLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return DATE_KEYWORDS.some((kw) => lower.includes(kw));
}

const LABEL_CLS =
  "block text-xs uppercase tracking-widest text-muted dark:text-neutral-400 mb-2";

const INPUT_CLS =
  "w-full px-3 py-2.5 text-sm bg-transparent " +
  "border border-zinc-200 dark:border-zinc-700 rounded " +
  "text-primary dark:text-neutral-100 " +
  "placeholder:text-zinc-400 dark:placeholder:text-zinc-500 " +
  "focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent " +
  "transition-colors duration-150";

export function ProductExtras({ config, onChange }: Props) {
  const [textfelder, setTextfelder] = useState<string[]>(
    () => config.textfelder.map(() => ""),
  );
  const [zusatzprodukte, setZusatzprodukte] = useState<ZusatzproduktOption[]>([]);
  const [optionen, setOptionen] = useState<string[]>([]);
  const [entscheid, setEntscheid] = useState("");
  const [farbe, setFarbe] = useState(config.farben[0] ?? "");

  useEffect(() => {
    onChange({ textfelder, zusatzprodukte, optionen, entscheid, farbe });
  }, [textfelder, zusatzprodukte, optionen, entscheid, farbe, onChange]);

  const hasFields =
    config.textfelder.length > 0 ||
    config.zusatzprodukte.length > 0 ||
    config.optionen.length > 0 ||
    config.entscheide.length > 0 ||
    config.farben.length > 0;

  if (!hasFields) return null;

  const updateText = (i: number, value: string) =>
    setTextfelder((prev) => { const next = [...prev]; next[i] = value; return next; });

  const toggleZusatzprodukt = (opt: ZusatzproduktOption, checked: boolean) =>
    setZusatzprodukte((prev) =>
      checked ? [...prev, opt] : prev.filter((v) => v.id !== opt.id),
    );

  const toggleOption = (opt: string, checked: boolean) =>
    setOptionen((prev) =>
      checked ? [...prev, opt] : prev.filter((v) => v !== opt),
    );

  return (
    <div className="flex flex-col gap-5 pt-5 border-t border-zinc-200/60 dark:border-zinc-800">

      {/* ── Textfelder ── */}
      {config.textfelder.map((label, i) => {
        const dateField = isDateLabel(label);
        return (
          <div key={i}>
            <label className={LABEL_CLS}>{label}</label>
            <input
              type={dateField ? "date" : "text"}
              value={textfelder[i] ?? ""}
              onChange={(e) => updateText(i, e.target.value)}
              {...(!dateField && { placeholder: `z.B. ${label}` })}
              className={INPUT_CLS}
            />
          </div>
        );
      })}

      {/* ── Zusatzprodukte ── */}
      {config.zusatzprodukte.length > 0 && (
        <div>
          <p className={LABEL_CLS}>Zusatzprodukte</p>
          <ZusatzprodukteGrid
            options={config.zusatzprodukte}
            selected={zusatzprodukte}
            onToggle={toggleZusatzprodukt}
          />
        </div>
      )}

      {/* ── Checkboxen (Optionen) ── */}
      {config.optionen.length > 0 && (
        <div>
          <p className={LABEL_CLS}>Optionen</p>
          <div className="flex flex-col gap-2.5">
            {config.optionen.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className={[
                  "flex-shrink-0 w-4 h-4 rounded border transition-colors duration-150",
                  "flex items-center justify-center",
                  optionen.includes(opt)
                    ? "bg-primary border-primary dark:bg-neutral-100 dark:border-neutral-100"
                    : "border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-500 dark:group-hover:border-zinc-400",
                ].join(" ")}>
                  {optionen.includes(opt) && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        className="dark:stroke-neutral-900" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={optionen.includes(opt)}
                  onChange={(e) => toggleOption(opt, e.target.checked)}
                />
                <span className="text-sm text-primary dark:text-neutral-200">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Radio (Entscheide) ── */}
      {config.entscheide.length > 0 && (
        <div>
          <p className={LABEL_CLS}>Auswahl</p>
          <div className="flex flex-col gap-2.5">
            {config.entscheide.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className={[
                  "flex-shrink-0 w-4 h-4 rounded-full border transition-colors duration-150",
                  "flex items-center justify-center",
                  entscheid === opt
                    ? "border-primary dark:border-neutral-100"
                    : "border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-500 dark:group-hover:border-zinc-400",
                ].join(" ")}>
                  {entscheid === opt && (
                    <span className="w-2 h-2 rounded-full bg-primary dark:bg-neutral-100" />
                  )}
                </span>
                <input
                  type="radio"
                  className="sr-only"
                  checked={entscheid === opt}
                  onChange={() => setEntscheid(opt)}
                />
                <span className="text-sm text-primary dark:text-neutral-200">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Farben ── */}
      {config.farben.length > 0 && (
        <div>
          <p className={LABEL_CLS}>
            Farbe{farbe ? <> &mdash; <span className="normal-case tracking-normal">{farbe}</span></> : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.farben.map((color) => {
              const swatch = colorSwatch(color);
              const isSelected = farbe === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFarbe(color)}
                  className={[
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors duration-150",
                    isSelected
                      ? "bg-transparent text-accent dark:bg-neutral-100 dark:text-neutral-900 border-accent dark:border-accent"
                      : "bg-transparent text-muted dark:text-neutral-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-primary dark:hover:text-neutral-200",
                  ].join(" ")}
                >
                  {swatch && (
                    <span
                      className="shrink-0 w-3.5 h-3.5 rounded-sm border border-black/10 dark:border-white/10"
                      style={{ background: swatch }}
                      aria-hidden="true"
                    />
                  )}
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
