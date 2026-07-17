"use client";

// Rendert die Zusatzoptionen eines Produkts aus dem NEUEN Metaobjekt-System
// (custom.options -> additional_option, siehe types/shopify.ts). Verwaltet
// den Auswahl-State lokal und meldet Änderungen über `onChange` an die
// Produktseite, die daraus die Cart-Attribute/-Zeilen baut (siehe
// ProductDetailClient.tsx).
//
// Läuft parallel zum alten System (ProductExtras.tsx / custom.layout_konfiguration)
// — beide können auf demselben Produkt gleichzeitig aktiv sein, solange nicht
// alle Produkte umgestellt sind.

import { useEffect, useState } from "react";
import type { AdditionalOption, ZusatzproduktOption } from "@/app/types/shopify";
import { ZusatzprodukteList } from "./ZusatzprodukteList";

export interface ProductOptionsState {
  /** technicalKey -> eingegebener Text bzw. gewählter Farbwert (#rrggbb) */
  values: Record<string, string>;
  /** Ausgewählte Zusatzprodukte (type "product") */
  selectedProducts: ZusatzproduktOption[];
}

export const EMPTY_PRODUCT_OPTIONS_STATE: ProductOptionsState = {
  values: {},
  selectedProducts: [],
};

const LABEL_CLS =
  "block text-xs uppercase tracking-widest text-muted dark:text-neutral-400 mb-2";

const INPUT_CLS =
  "w-full px-3 py-2.5 text-sm bg-transparent " +
  "border border-zinc-200 dark:border-zinc-700 rounded " +
  "text-primary dark:text-neutral-100 " +
  "placeholder:text-zinc-400 dark:placeholder:text-zinc-500 " +
  "focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent " +
  "transition-colors duration-150";

interface Props {
  options: AdditionalOption[];
  onChange: (state: ProductOptionsState) => void;
}

export function ProductOptions({ options, onChange }: Props) {
  const [state, setState] = useState<ProductOptionsState>(EMPTY_PRODUCT_OPTIONS_STATE);

  useEffect(() => {
    onChange(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (options.length === 0) return null;

  const textOptions = options.filter((o) => o.type === "text");
  const colorOptions = options.filter((o) => o.type === "color");
  const productOptions = options.filter(
    (o): o is AdditionalOption & { linkedProduct: ZusatzproduktOption } =>
      o.type === "product" && o.linkedProduct !== null,
  );

  function setValue(technicalKey: string, value: string) {
    setState((prev) => ({ ...prev, values: { ...prev.values, [technicalKey]: value } }));
  }

  function toggleProduct(opt: ZusatzproduktOption, checked: boolean) {
    setState((prev) => ({
      ...prev,
      selectedProducts: checked
        ? [...prev.selectedProducts, opt]
        : prev.selectedProducts.filter((p) => p.id !== opt.id),
    }));
  }

  return (
    <div className="flex flex-col gap-5">
      {textOptions.map((option) => (
        <div key={option.id}>
          <label htmlFor={option.technicalKey} className={LABEL_CLS}>
            {option.title}
            {option.required && <span className="text-red-500 dark:text-red-400"> *</span>}
          </label>
          <input
            id={option.technicalKey}
            type="text"
            required={option.required}
            placeholder={option.title}
            value={state.values[option.technicalKey] ?? ""}
            onChange={(e) => setValue(option.technicalKey, e.target.value)}
            className={INPUT_CLS}
          />
        </div>
      ))}

      {colorOptions.map((option) => (
        <div key={option.id}>
          <p className="text-sm font-medium text-primary dark:text-neutral-100 mb-2">
            {option.title}
            {option.required && <span className="text-red-500 dark:text-red-400"> *</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.colors.map((c, i) => {
              // Gespeichert wird der Anzeigetext (z.B. "Blau"), nicht der
              // Hex-Code — das ist der Wert, der später im Warenkorb/der
              // Bestellung auftaucht. Hex dient nur der visuellen Vorschau.
              const label = option.colorLabels[i] ?? c;
              const selected = state.values[option.technicalKey] === label;
              return (
                <button
                  key={`${c}-${i}`}
                  type="button"
                  onClick={() => setValue(option.technicalKey, label)}
                  aria-label={label}
                  aria-pressed={selected}
                  title={label}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-colors duration-150 ${
                    selected
                      ? "border-accent"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                  }`}
                  style={{ backgroundColor: c }}
                />
              );
            })}
          </div>
        </div>
      ))}

      {productOptions.length > 0 && (
        <div>
          <p className={LABEL_CLS}>Zusatzprodukte</p>
          <ZusatzprodukteList
            options={productOptions.map((o) => o.linkedProduct)}
            selected={state.selectedProducts}
            onToggle={(opt: ZusatzproduktOption, checked: boolean) => toggleProduct(opt, checked)}
          />
        </div>
      )}
    </div>
  );
}
