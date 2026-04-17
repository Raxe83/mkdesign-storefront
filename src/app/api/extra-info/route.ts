import { getExtraInfoByType } from "@/app/services/shopify/metaobjects";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "";
  if (!category) return NextResponse.json([]);
  const items = await getExtraInfoByType(category);
  return NextResponse.json(items);
}
