"use server";

import { Resend } from "resend";

export type ReturnRequestState = {
  success: boolean;
  error?: string;
};

export async function sendReturnRequest(
  _prevState: ReturnRequestState,
  formData: FormData,
): Promise<ReturnRequestState> {
  const orderNumber = (formData.get("orderNumber") as string)?.trim();
  const customerName = (formData.get("customerName") as string)?.trim();
  const customerEmail = (formData.get("customerEmail") as string)?.trim();
  const reason = (formData.get("reason") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!orderNumber || !customerEmail || !reason) {
    return { success: false, error: "Bitte fülle alle Pflichtfelder aus." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[ReturnRequest] RESEND_API_KEY not configured");
    return {
      success: false,
      error: "E-Mail-Dienst nicht konfiguriert. Bitte kontaktiere uns direkt.",
    };
  }

  const resend = new Resend(apiKey);

  const body = [
    `Widerrufs- / Rücksendeanfrage`,
    ``,
    `Bestellung: #${orderNumber}`,
    `Kunde: ${customerName || "—"}`,
    `E-Mail: ${customerEmail}`,
    ``,
    `Grund: ${reason}`,
    ...(message ? [``, `Nachricht:`, message] : []),
    ``,
    `---`,
    `Gesendet über das Kundenkonto (Widerrufsrecht gem. § 355 BGB / EU-Fernabsatzrichtlinie)`,
  ].join("\n");

  try {
    await resend.emails.send({
      from: "M.K. Design <noreply@mkdesignweb.de>",
      to: "MKDesignbyMarkusKlement@web.de",
      replyTo: customerEmail,
      subject: `[Rücksendung] Bestellung #${orderNumber}`,
      text: body,
    });

    return { success: true };
  } catch (err) {
    console.error("[ReturnRequest] Resend error:", err);
    return {
      success: false,
      error: "Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.",
    };
  }
}
