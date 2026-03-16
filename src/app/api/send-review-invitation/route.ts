import { createReviewPlaceholder } from "@/app/lib/db"
import { sendReviewInvitationEmail } from "@/app/lib/email-utils"
import { generateReviewToken } from "@/app/lib/review-utils"
import { NextResponse } from "next/server"

type ReviewRequestBody = {
  orderId: string
  orderNumber: string
  productId: string
  productName: string
  customerEmail: string
  customerName: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReviewRequestBody
    const { orderId, orderNumber, productId, productName, customerEmail, customerName } = body

    if (!orderId || !productId || !customerEmail || !customerName || !orderNumber || !productName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const token = generateReviewToken(orderId, productId)

    const reviewId = await createReviewPlaceholder(productId, orderId, customerEmail, token)

    await sendReviewInvitationEmail(customerEmail, customerName, orderNumber, productName, token)

    return NextResponse.json({ success: true, reviewId })
  } catch (error) {
    console.error("❌ Fehler beim Senden der Review-Einladung:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Failed to send review invitation" }, { status: 500 })
  }
}
