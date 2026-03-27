import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/cloudinary/upload
 *
 * FormData fields:
 *   file     — Blob (PNG oder JSON)
 *   folder   — Cloudinary-Zielordner  (default: "designs")
 *   filename — Öffentlicher Dateiname (optional)
 *
 * Response: { url: string }
 */
export async function POST(req: NextRequest) {
  try {
    const form     = await req.formData();
    const file     = form.get("file")     as File   | null;
    const folder   = (form.get("folder")   as string) || "designs";
    const filename = (form.get("filename") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "Kein File übergeben." }, { status: 400 });
    }

    // File → base64 Data URI (cloudinary.uploader.upload akzeptiert das direkt)
    const buffer  = Buffer.from(await file.arrayBuffer());
    const base64  = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      public_id:     filename ? filename.replace(/\.[^/.]+$/, "") : undefined,
      resource_type: "auto",   // "image" für PNG, "raw" für JSON — auto erkennt beides
      overwrite:     false,
      unique_filename: true,
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
