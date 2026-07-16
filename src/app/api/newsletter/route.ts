import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "E-Mail ist erforderlich." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Newsletter API] CRITICAL: RESEND_API_KEY is missing in env!");
      return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // --- ÄNDERUNG 1: Sicherere Base64-Generierung für Node.js ---
    // btoa() macht auf Servern oft Probleme. Das hier ist absolut stabil:
    const token = Buffer.from(email).toString("base64url");
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const confirmationLink = `${baseUrl}/newsletter/confirm?token=${token}`;

    const mailBody = [
      `Hallo,`,
      ``,
      `vielen Dank für dein Interesse an unserem Newsletter!`,
      `Bitte bestätige deine Anmeldung, indem du auf den folgenden Link klickst:`,
      ``,
      confirmationLink,
      ``,
      `Solltest du dich nicht angemeldet haben, kannst du diese Mail einfach ignorieren.`,
      ``,
      `Viele Grüße,`,
      `Dein M.K. Design Team`,
    ].join("\n");

    // --- ÄNDERUNG 2: Antwort von Resend abfangen und loggen ---
    const { data, error } = await resend.emails.send({
      from: "M.K. Design <onboarding@resend.dev>", // Für den lokalen Test!
      to: email, // MUSS im Testmodus die Mail deines Resend-Accounts sein!
      subject: "Bitte bestätige deine Newsletter-Anmeldung",
      text: mailBody,
    });

    if (error) {
      console.error("[Newsletter API] Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("[Newsletter API] Success! Mail sent. ID:", data?.id);
    return NextResponse.json({ success: true });

  } catch (error) {
    // Falls irgendwo im Code (z.B. JSON-Parsing) ein Fehler auftritt
    console.error("[Newsletter API] Global Catch Error:", error);
    return NextResponse.json({ error: "Fehler beim Senden der Mail." }, { status: 500 });
  }
}