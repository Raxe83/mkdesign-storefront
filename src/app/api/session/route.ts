import { NextResponse } from "next/server";
import { getSessionToken } from "@/app/lib/session";

export async function GET() {
  const customerAccessToken = await getSessionToken();
  return NextResponse.json({ customerAccessToken });
}
