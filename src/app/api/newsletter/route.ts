import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/app/services/shopify/newsletter";

// POST /api/newsletter  —  body: { email: string }
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 },
      );
    }

    const result = await subscribeToNewsletter(email.trim().toLowerCase());

    if (!result.success) {
      return NextResponse.json(
        { error: "Anmeldung fehlgeschlagen. Bitte versuche es später erneut." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, alreadySubscribed: result.alreadySubscribed ?? false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
