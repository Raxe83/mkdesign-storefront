import { registerWebhook } from "@/app/lib/shopify-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { topic, address } = await request.json()

    if (!topic || !address) {
      return NextResponse.json({ error: "Topic und Address sind erforderlich" }, { status: 400 })
    }

    const success = await registerWebhook(topic, address)

    if (!success) {
      return NextResponse.json({ error: "Fehler beim Registrieren des Webhooks" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fehler beim Registrieren des Webhooks:", error)
    return NextResponse.json({ error: "Fehler beim Registrieren des Webhooks" }, { status: 500 })
  }
}
