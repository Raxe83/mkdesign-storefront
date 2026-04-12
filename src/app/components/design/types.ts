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
