import { NextRequest, NextResponse } from "next/server";
import {
  getReviewsForProduct,
  getAllStoreReviews,
  getAllReviewsCached,
  createReview,
} from "@/app/services/judgeme";

// GET /api/judgeme/reviews?productId=123&handle=my-product&page=1&perPage=10
// GET /api/judgeme/reviews?page=1&perPage=30  ← all store reviews
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const productId = searchParams.get("productId");
    const handle = searchParams.get("handle");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const perPage = parseInt(searchParams.get("perPage") ?? "10", 10);

    let data;
    if (productId) {
      // Fetch paginated reviews + true total count from cached store reviews
      const [pageData, { reviews: allReviews }] = await Promise.all([
        getReviewsForProduct(Number(productId), page, perPage),
        getAllReviewsCached(),
      ]);
      const totalCount = handle
        ? allReviews.filter((r) => r.product_handle === handle).length
        : pageData.totalCount;
      data = { ...pageData, totalCount };
    } else {
      data = await getAllStoreReviews(page, perPage);
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[judgeme/reviews GET]", message);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

// POST /api/judgeme/reviews
// Body: { productId, name, email, rating, title, body }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, name, email, rating, title, reviewBody } = body;

    if (!productId || !name || !email || !rating) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen: productId, name, email, rating" },
        { status: 400 },
      );
    }

    const result = await createReview({
      productId: Number(productId),
      name,
      email,
      rating: Number(rating),
      title: title ?? "",
      body: reviewBody ?? "",
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("[judgeme/reviews POST]", err);
    return NextResponse.json(
      { error: "Bewertung konnte nicht gespeichert werden." },
      { status: 500 },
    );
  }
}
