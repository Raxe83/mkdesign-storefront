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

export type DualDesignUploadResult = {
  designId: string;
  sideA: { previewUrl: string; jsonUrl: string };
  sideB?: { previewUrl: string; jsonUrl: string };
};

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; step: "preview-a" | "json-a" | "preview-b" | "json-b" }
  | { status: "success"; result: DualDesignUploadResult }
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

export type DualDesignPayload = {
  productId: string;
  sideA: { canvasJson: object; previewDataUrl: string };
  sideB?: { canvasJson: object; previewDataUrl: string };
};

/**
 * Lädt Seite A (+ optional Seite B) zu Cloudinary hoch.
 * Gibt DualDesignUploadResult zurück.
 */
export async function uploadDualDesign(
  payload: DualDesignPayload,
  onStep?: (step: "preview-a" | "json-a" | "preview-b" | "json-b") => void,
): Promise<DualDesignUploadResult> {
  const ts = Date.now();
  const id = `design_${ts}_${Math.random().toString(36).slice(2, 7)}`;

  // ── Seite A ────────────────────────────────────────────────────
  onStep?.("preview-a");
  const previewABlob = dataURLtoBlob(payload.sideA.previewDataUrl);
  const previewAUrl  = await uploadToCloudinary(
    previewABlob,
    `preview_${payload.productId}_${ts}_a.png`,
    "designs/previews",
  );

  onStep?.("json-a");
  const jsonAUrl = await uploadToCloudinary(
    new Blob([JSON.stringify(payload.sideA.canvasJson)], { type: "application/json" }),
    `canvas_${payload.productId}_${ts}_a.json`,
    "designs/json",
  );

  if (!payload.sideB) {
    return { designId: id, sideA: { previewUrl: previewAUrl, jsonUrl: jsonAUrl } };
  }

  // ── Seite B ────────────────────────────────────────────────────
  onStep?.("preview-b");
  const previewBBlob = dataURLtoBlob(payload.sideB.previewDataUrl);
  const previewBUrl  = await uploadToCloudinary(
    previewBBlob,
    `preview_${payload.productId}_${ts}_b.png`,
    "designs/previews",
  );

  onStep?.("json-b");
  const jsonBUrl = await uploadToCloudinary(
    new Blob([JSON.stringify(payload.sideB.canvasJson)], { type: "application/json" }),
    `canvas_${payload.productId}_${ts}_b.json`,
    "designs/json",
  );

  return {
    designId: id,
    sideA: { previewUrl: previewAUrl, jsonUrl: jsonAUrl },
    sideB: { previewUrl: previewBUrl, jsonUrl: jsonBUrl },
  };
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
