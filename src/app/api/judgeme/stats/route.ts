import { NextResponse } from "next/server";
import { getAllReviewsCached } from "@/app/services/judgeme";

// GET /api/judgeme/stats
// Returns { total, average } using the server-side cached review set
export async function GET() {
  try {
    const { reviews, total } = await getAllReviewsCached();

    const average =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({ total, average: Math.round(average * 10) / 10 });
  } catch (err) {
    console.error("[judgeme/stats]", err);
    return NextResponse.json({ total: 0, average: 0 }, { status: 500 });
  }
}
