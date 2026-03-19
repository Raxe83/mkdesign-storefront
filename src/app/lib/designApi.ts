/**
 * designApi.ts — Cloudinary-backed Design-Upload-Service
 *
 * Alle Uploads gehen über die serverseitige Route /api/cloudinary/upload,
 * damit CLOUDINARY_API_SECRET niemals den Browser erreicht.
 *
 * Flow:
 *   1. PNG DataURL  → Blob → /api/cloudinary/upload → secure_url  (previewUrl)
 *   2. Fabric JSON  → Blob → /api/cloudinary/upload → secure_url  (jsonUrl)
 */

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type DesignPayload = {
  productId:      string;
  canvasJson:     object;
  previewDataUrl: string;
};

export type DesignUploadResult = {
  /** Eindeutige Design-ID — als _design_id in Shopify Line Item Properties */
  designId:   string;
  /** Cloudinary URL zum PNG-Vorschaubild */
  previewUrl: string;
  /** Cloudinary URL zur Fabric-JSON-Datei */
  jsonUrl:    string;
};

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; step: "preview" | "json" }
  | { status: "success"; result: DesignUploadResult }
  | { status: "error"; message: string };

/* ------------------------------------------------------------------ */
/*  Core — einen einzelnen Blob über die API-Route hochladen           */
/* ------------------------------------------------------------------ */

async function uploadToCloudinary(
  blob:     Blob,
  filename: string,
  folder:   string,
): Promise<string> {
  const form = new FormData();
  form.append("file",     blob, filename);
  form.append("folder",   folder);
  form.append("filename", filename);

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body:   form,
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Cloudinary Upload fehlgeschlagen: ${error}`);
  }

  const { url } = await res.json() as { url: string };
  return url;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Lädt PNG-Vorschau und Fabric-JSON zu Cloudinary hoch.
 * Gibt echte secure_url Werte zurück.
 *
 * @param onStep  - Callback für Live-Statusanzeige im UI ("preview" | "json")
 */
export async function uploadDesign(
  payload: DesignPayload,
  onStep?: (step: "preview" | "json") => void,
): Promise<DesignUploadResult> {
  const ts = Date.now();
  const id = `design_${ts}_${Math.random().toString(36).slice(2, 7)}`;

  // 1. PNG-Vorschau hochladen
  onStep?.("preview");
  const previewBlob = dataURLtoBlob(payload.previewDataUrl);
  const previewUrl  = await uploadToCloudinary(
    previewBlob,
    `preview_${payload.productId}_${ts}.png`,
    "designs/previews",
  );

  // 2. Fabric-Canvas-JSON hochladen
  onStep?.("json");
  const jsonBlob = new Blob(
    [JSON.stringify(payload.canvasJson)],
    { type: "application/json" },
  );
  const jsonUrl = await uploadToCloudinary(
    jsonBlob,
    `canvas_${payload.productId}_${ts}.json`,
    "designs/json",
  );

  return { designId: id, previewUrl, jsonUrl };
}

/* ------------------------------------------------------------------ */
/*  Bild auf Canvas laden — über Cloudinary-Upload-Route               */
/* ------------------------------------------------------------------ */

/**
 * Lädt eine Bilddatei zu Cloudinary hoch und gibt die secure_url zurück.
 * Wird vom DesignEditor verwendet um Nutzerbilder persistent zu machen,
 * damit sie beim Wiederherstellen des canvas.toJSON() in der Admin-View
 * noch erreichbar sind (im Gegensatz zu blob:-URLs).
 */
export async function uploadCanvasImage(file: File): Promise<string> {
  const ts   = Date.now();
  const form = new FormData();
  form.append("file",     file, `canvas_image_${ts}.${file.name.split(".").pop()}`);
  form.append("folder",   "designs/canvas-images");
  form.append("filename", `canvas_image_${ts}`);

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body:   form,
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Bild-Upload fehlgeschlagen: ${error}`);
  }

  const { url } = await res.json() as { url: string };
  return url;
}

/* ------------------------------------------------------------------ */
/*  Hilfsfunktion: DataURL → Blob                                       */
/* ------------------------------------------------------------------ */

export function dataURLtoBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime           = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary         = atob(data);
  const bytes          = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
