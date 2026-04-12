import { createHmac, timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

/** Verify Shopify HMAC-SHA256 signature. */
async function verifyShopifyWebhook(req: NextRequest, rawBody: string): Promise<boolean> {
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
  if (!hmacHeader || !WEBHOOK_SECRET) return false;

  const computed = createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    return timingSafeEqual(Buffer.from(hmacHeader), Buffer.from(computed));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const isValid = await verifyShopifyWebhook(req, rawBody);
  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic") ?? "";

  if (topic.startsWith("products/")) {
    revalidateTag("shopify-products");
  }

  return NextResponse.json({ ok: true });
}
