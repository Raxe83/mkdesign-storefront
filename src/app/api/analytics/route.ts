import { NextRequest, NextResponse } from "next/server";

const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const MONORAIL_URL = `https://${SHOP_DOMAIN}/.well-known/shopify/monorail/unstable/produce_batch`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const res = await fetch(MONORAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
    });

    return NextResponse.json({ ok: res.ok }, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
