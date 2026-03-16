import { sql } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { productId, rating, title, content, customerName } = await request.json()

    if (!productId || !rating || !content || !customerName) {
      return NextResponse.json(
        { error: "Produkt-ID, Bewertung, Inhalt und Kundenname sind erforderlich" },
        { status: 400 },
      )
    }

    // Generiere eine zufällige ID und Order-ID für Testzwecke
    const randomId = "test_" + Math.random().toString(36).substring(2, 15)
    const randomOrderId = "order_" + Math.random().toString(36).substring(2, 15)

    // Erstelle das Review direkt als verifiziert
    const result = await sql`
      INSERT INTO "Review" (
        "id",
        "productId",
        "orderId",
        "rating",
        "title",
        "content",
        "customerName",
        "customerEmail",
        "isVerified",
        "token",
        "updatedAt"
      )
      VALUES (
        ${randomId},
        ${productId},
        ${randomOrderId},
        ${rating},
        ${title},
        ${content},
        ${customerName},
        ${"test@example.com"},
        true,
        ${"test_token_" + randomId},
        CURRENT_TIMESTAMP
      )
      RETURNING "id"
    `

    return NextResponse.json({ success: true, reviewId: result[0].id })
  } catch (error) {
    console.error("Fehler beim Erstellen des Test-Reviews:", error)
    return NextResponse.json({ error: "Fehler beim Erstellen des Test-Reviews" }, { status: 500 })
  }
}
