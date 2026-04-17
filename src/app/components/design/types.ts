import type { ProductZusatzoptionen } from "@/app/types/shopify";
import type { ProductCategory } from "@/app/components/product/product-category";

export type ProductOption = {
  id:             string;
  label:          string;
  description:    string;
  backgroundUrl:  string | null;
  variantId:      string | null;
  price:          string;
  canvasPresetId: string;
  /** Erstes Zusatzprodukt aus `zusatzoptionen` → aktiviert Seite B und definiert den Aufpreis. */
  sideBZusatzprodukt: { variantId: string; price: string } | null;
  /** Verfügbare Farboptionen aus Zusatzoptionen (z. B. ["Schwarz", "Silber", "Gold"]). */
  farben: string[];
  /** Vollständige Zusatzoptionen für ProductExtras (Textfelder, Optionen, etc.). */
  zusatzoptionen: ProductZusatzoptionen | null;
  /** Kategorie des Produkts, z. B. "feuertonne" oder "nachtlicht". */
  category: ProductCategory | null;
};

export type SidebarTab = "shapes" | "text" | "image";

export type CartButtonState = "idle" | "loading" | "added" | "error" | "no-variant";

export type FabricConf =
  | { k: "rect";     w: number; h: number; rx?: number }
  | { k: "circle";   r: number }
  | { k: "ellipse";  rx: number; ry: number }
  | { k: "triangle"; w: number; h: number }
  | { k: "line" }
  | { k: "poly";     pts: { x: number; y: number }[] }
  | { k: "path";     d: string }
  | { k: "svg";      markup: string };

export type ShapeEntry = { id: string; label: string; cat: string; fc: FabricConf };
