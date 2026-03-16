import { getReviewByToken, submitReview } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, rating, title, content, customerName } = await request.json()

    if (!token || !rating || !content || !customerName) {
      return NextResponse.json({ error: "Token, rating, content, and customer name are required" }, { status: 400 })
    }

    // Find the review by token
    const existingReview = await getReviewByToken(token)

    if (!existingReview) {
      return NextResponse.json({ error: "Invalid review token" }, { status: 400 })
    }

    if (existingReview.isVerified) {
      return NextResponse.json({ error: "This review has already been submitted" }, { status: 400 })
    }

    // Update the review with the customer's input
    const success = await submitReview(token, rating, title, content, customerName)

    if (!success) {
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
