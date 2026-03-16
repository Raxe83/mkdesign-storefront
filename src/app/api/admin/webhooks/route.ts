import { listWebhooks } from "@/app/lib/shopify-admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const webhooks = await listWebhooks()
    return NextResponse.json({ webhooks })
  } catch (error) {
    console.error("Fehler beim Abrufen der Webhooks:", error)
    return NextResponse.json({ error: "Fehler beim Abrufen der Webhooks" }, { status: 500 })
  }
}
