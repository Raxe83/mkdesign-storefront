import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateReviewToken } from "@/app/lib/review-utils";
import { createReviewPlaceholder } from "@/app/lib/db";
import { sendReviewInvitationEmail } from "@/app/lib/email-utils";

// Shopify sendet einen HMAC-Header zur Verifizierung
function verifyShopifyWebhook(data: string, hmac: string): boolean {
  const generatedHash = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET || "")
    .update(data, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmac));
}


export async function POST(request: Request) {
  try {
    // Verifiziere den Shopify-Webhook
    const hmac = request.headers.get("x-shopify-hmac-sha256") || "";
    const data = await request.text();

    if (!verifyShopifyWebhook(data, hmac)) {
      console.error("Ungültiger Shopify-Webhook-Aufruf");
      return NextResponse.json(
        { error: "Ungültiger Webhook-Aufruf" },
        { status: 401 }
      );
    }

    // Parse die Bestelldaten
    const order = JSON.parse(data);

    // Extrahiere die benötigten Informationen
    const orderId = order.id.toString();
    const orderNumber = order.name || `#${order.order_number}`;
    const customerEmail = order.email;
    const customerName = order.customer?.first_name
      ? `${order.customer.first_name} ${order.customer.last_name || ""}`
      : "Kunde";

    // Verarbeite jedes Produkt in der Bestellung
    for (const lineItem of order.line_items) {
      const productId = lineItem.product_id.toString();
      const productName = lineItem.title;

      // Generiere ein einzigartiges Token für dieses Produkt und diese Bestellung
      const token = generateReviewToken(orderId, productId);

      // Erstelle einen Platzhalter für die Bewertung in der Datenbank
      await createReviewPlaceholder(productId, orderId, customerEmail, token);

      // Sende eine E-Mail mit dem Review-Link
      // Wir könnten alle Produkte sammeln und eine E-Mail senden, aber für die Einfachheit
      // senden wir eine E-Mail pro Produkt
      await sendReviewInvitationEmail(
        customerEmail,
        customerName,
        orderNumber,
        productName,
        token
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler bei der Verarbeitung des Shopify-Webhooks:", error);
    return NextResponse.json(
      { error: "Fehler bei der Verarbeitung des Webhooks" },
      { status: 500 }
    );
  }
}
