import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Shopify Webhook Handler für ISR-Revalidation
 * Triggered bei: products/create, products/update, products/delete
 * Validiert HMAC-SHA256 signature, revalidiert betroffene Seiten
 */

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic");

  // 1. Authentifizieren via HMAC
  if (!signature || !process.env.SHOPIFY_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or secret" },
      { status: 401 },
    );
  }

  const body = await request.text();
  const hmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");

  if (hmac !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. Parse payload
  let payload: { id: string; handle: string } = { id: "", handle: "" };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Revalidate betroffene Seiten
  try {
    const handle = payload.handle;

    if (!handle) {
      return NextResponse.json(
        { error: "Missing product handle" },
        { status: 400 },
      );
    }

    // Revalidate Product-Seite + Collections/Homepage
    await revalidateTag(`product:${handle}`);
    await revalidateTag("products");
    await revalidateTag("collections");
    await revalidateTag("homepage");

    console.log(`[Webhook] Revalidated product: ${handle} (topic: ${topic})`);

    return NextResponse.json(
      { revalidated: true, handle },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Webhook] Revalidation error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 },
    );
  }
}
