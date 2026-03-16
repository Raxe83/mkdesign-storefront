import { createHash } from "crypto"
import { getReviewByToken } from "./db"

/**
 * Generate a unique review token based on order ID and product ID
 */
export function generateReviewToken(orderId: string, productId: string): string {
  const data = `${orderId}-${productId}-${Date.now()}`
  return createHash("sha256").update(data).digest("hex")
}

/**
 * Generate a review link that can be sent to customers
 */
export function generateReviewLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/review/${token}`
}

/**
 * Validate a review token
 */
export async function validateReviewToken(token: string) {
  try {
    const review = await getReviewByToken(token)

    if (!review) {
      return null
    }

    return {
      id: review.id,
      productId: review.productId,
      isVerified: review.isVerified,
    }
  } catch (error) {
    console.error("Error validating review token:", error)
    return null
  }
}
