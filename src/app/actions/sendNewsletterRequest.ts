import { Resend } from "resend";

export type NewsletterState = {
  success: boolean;
  error?: string;
};

export async function sendNewsletterRequest(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const customerEmail = (formData.get("customerEmail") as string)?.trim();
  const customerName = (formData.get("customerName") as string)?.trim() || ""; // Optionaler Name

  if (!customerEmail) {
    return { success: false, error: "Bitte gib eine E-Mail-Adresse ein." };
  }

  // Einfache Validierung der E-Mail-Struktur
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    return { success: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[Newsletter] RESEND_API_KEY not configured");
    return {
      success: false,
      error: "E-Mail-Dienst nicht konfiguriert. Bitte versuche es später erneut.",
    };
  }

  const resend = new Resend(apiKey);

  // --- DOUBLE OPT-IN LOGIK ---
  // Hier generieren wir einen Token. In der Praxis würdest du diesen Token + E-Mail
  // temporär in einer Datenbank speichern, um ihn beim Klick zu verifizieren.
  // Für eine einfache Variante verschlüsseln wir die E-Mail oder nutzen einen Base64-String.
  const token = btoa(encodeURIComponent(customerEmail)); 
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mkdesignweb.de";
  const confirmationLink = `${baseUrl}/newsletter/confirm?token=${token}`;

  const body = [
    customerName ? `Hallo ${customerName},` : `Hallo,`,
    ``,
    `vielen Dank für dein Interesse an unserem Newsletter!`,
    `Bitte bestätige deine Anmeldung, indem du auf den folgenden Link klickst:`,
    ``,
    confirmationLink,
    ``,
    `Solltest du dich nicht für unseren Newsletter angemeldet haben, kannst du diese E-Mail einfach ignorieren. Es werden keine Daten an Dritte weitergegeben.`,
    ``,
    `---`,
    `M.K. Design | Datenschutzkonformer Newsletter nach DSGVO (Double Opt-In)`,
  ].join("\n");

  try {
    await resend.emails.send({
      from: "M.K. Design <noreply@mkdesignweb.de>",
      to: customerEmail, // Die Mail geht HIER an den Kunden, nicht an dich!
      subject: `Bitte bestätige deine Newsletter-Anmeldung`,
      text: body,
    });

    return { success: true };
  } catch (err) {
    console.error("[Newsletter] Resend error:", err);
    return {
      success: false,
      error: "Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.",
    };
  }
}