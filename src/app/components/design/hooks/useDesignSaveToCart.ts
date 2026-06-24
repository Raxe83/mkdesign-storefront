"use client";

import { useCallback, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import type { useDesignCanvas } from "./useDesignCanvas";
import type { ProductOption } from "../types";

type Canvas = ReturnType<typeof useDesignCanvas>;

export type SaveToCartStatus =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "success"; previewUrl: string }
  | { status: "error"; message: string };

interface Options {
  /** Lesbares Lackierungs-/Finish-Label, z. B. "Gold" — landet als Detail im Warenkorb. */
  finishLabel?: string;
}

/**
 * Orchestriert den Ein-Klick-Flow „Design speichern → in den Warenkorb".
 *
 * 1. Lädt das Canvas-Design zu Cloudinary (über canvas.saveDesign)
 * 2. Baut die Line-Item-Attribute (Vorschau, interne IDs, sichtbare Details)
 * 3. Legt das Produkt mit Attributen in den Warenkorb
 *
 * Sichtbare Details (ohne `_`-Präfix) erscheinen im Warenkorb; interne
 * Felder (`_design_id`, `_design_json`) steuern Vorschau & Produktion.
 */
export function useDesignSaveToCart(
  canvas: Canvas,
  product: ProductOption | null,
  { finishLabel }: Options = {},
) {
  const { addItem } = useCart();
  const [state, setState] = useState<SaveToCartStatus>({ status: "idle" });

  const reset = useCallback(() => {
    setState({ status: "idle" });
    canvas.resetUploadState();
  }, [canvas]);

  const saveAndAddToCart = useCallback(async () => {
    if (!product?.variantId) {
      setState({ status: "error", message: "Kein gültiges Produkt ausgewählt." });
      return;
    }

    setState({ status: "saving" });

    // 1. Design hochladen (einseitig) — gibt das Ergebnis direkt zurück
    const result = await canvas.saveDesign();
    if (!result) {
      setState({ status: "error", message: "Upload fehlgeschlagen. Bitte erneut versuchen." });
      return;
    }

    // 2. Line-Item-Attribute zusammenstellen
    const attrs: { key: string; value: string }[] = [
      { key: "Design-Vorschau", value: result.sideA.previewUrl },
      { key: "_design_id", value: result.designId },
      { key: "_design_json", value: result.sideA.jsonUrl },
      ...(finishLabel ? [{ key: "Lackierung", value: finishLabel }] : []),
    ];

    // 3. In den Warenkorb (löst automatisch das Cart-Popup aus)
    try {
      await addItem(product.variantId, 1, attrs);
      setState({ status: "success", previewUrl: result.sideA.previewUrl });
    } catch {
      setState({ status: "error", message: "Konnte nicht zum Warenkorb hinzugefügt werden." });
    }
  }, [addItem, canvas, product, finishLabel]);

  return { state, saveAndAddToCart, reset };
}
