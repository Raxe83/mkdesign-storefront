import { prisma } from "@/app/lib/prisma";
import { generateReviewToken } from "@/app/lib/review-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderId, productId, customerEmail } = await request.json();

    if (!orderId || !productId || !customerEmail) {
      return NextResponse.json(
        { error: "Order ID, Product ID, and customer email are required" },
        { status: 400 }
      );
    }

    // Check if a review token already exists for this order and product
    const existingReview = await prisma.review.findFirst({
      where: {
        orderId,
        productId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "A review token already exists for this order and product" },
        { status: 400 }
      );
    }

    // Generate a unique token for this review
    const token = generateReviewToken(
      orderId,
      "gid://shopify/Product/" + productId
    );

    const realProductID = "gid://shopify/Product/" + productId;
    // Create a placeholder review entry with the token
    const review = await prisma.review.create({
      data: {
        productId: realProductID,
        orderId,
        rating: 0, // Placeholder until the customer submits the review
        content: "", // Placeholder until the customer submits the review
        customerName: "", // Will be filled when the customer submits the review
        customerEmail,
        isVerified: false,
        token,
      },
    });

    return NextResponse.json({ token, reviewId: review.id });
  } catch (error) {
    console.error("Error creating review token:", error);
    return NextResponse.json(
      { error: "Failed to create review token" },
      { status: 500 }
    );
  }
}
