"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { encryptToken, decryptToken, setEmailSessionCookie } from "../lib/session";
import { adminLookupCustomerByEmail } from "../services/shopify/adminCustomer";

const CODE_COOKIE = "mk_email_code";
const CODE_TTL_MS = 10 * 60 * 1000;

export interface EmailCodeState {
  step: "email" | "code";
  email?: string;
  error?: string;
}

export async function sendEmailCode(
  _prev: EmailCodeState,
  formData: FormData,
): Promise<EmailCodeState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase() ?? "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { step: "email", error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }

  const code = crypto.randomInt(100000, 999999).toString();
  const payload = JSON.stringify({ email, code, ts: Date.now() });

  const store = await cookies();
  store.set(CODE_COOKIE, encryptToken(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { step: "email", error: "E-Mail-Dienst nicht konfiguriert." };
  }

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: "M.K. Design <onboarding@resend.dev>",
      to: email,
      subject: `${code} — Dein Anmeldecode`,
      text: [
        `Dein Anmeldecode für M.K. Design: ${code}`,
        "",
        "Der Code ist 10 Minuten gültig.",
        "",
        "Falls du diese Anmeldung nicht angefordert hast, ignoriere diese E-Mail.",
      ].join("\n"),
    });
  } catch {
    return { step: "email", error: "Code konnte nicht gesendet werden. Bitte versuche es erneut." };
  }

  return { step: "code", email };
}

export async function verifyEmailCode(
  _prev: EmailCodeState,
  formData: FormData,
): Promise<EmailCodeState> {
  const inputCode = (formData.get("code") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim().toLowerCase() ?? "";

  if (!inputCode || inputCode.length !== 6) {
    return { step: "code", email, error: "Bitte gib den 6-stelligen Code ein." };
  }

  const store = await cookies();
  const codeCookie = store.get(CODE_COOKIE);
  if (!codeCookie) {
    return { step: "email", error: "Code abgelaufen. Bitte fordere einen neuen an." };
  }

  const raw = decryptToken(codeCookie.value);
  if (!raw) {
    return { step: "email", error: "Code ungültig. Bitte fordere einen neuen an." };
  }

  const stored = JSON.parse(raw) as { email: string; code: string; ts: number };

  if (Date.now() - stored.ts > CODE_TTL_MS) {
    store.delete(CODE_COOKIE);
    return { step: "email", error: "Code abgelaufen. Bitte fordere einen neuen an." };
  }

  if (stored.email !== email) {
    return { step: "email", error: "E-Mail stimmt nicht überein. Bitte starte erneut." };
  }

  const codeMatch =
    stored.code.length === inputCode.length &&
    crypto.timingSafeEqual(Buffer.from(stored.code), Buffer.from(inputCode));

  if (!codeMatch) {
    return { step: "code", email, error: "Code ist falsch. Bitte versuche es erneut." };
  }

  store.delete(CODE_COOKIE);

  let customer;
  try {
    customer = await adminLookupCustomerByEmail(email);
  } catch {
    return { step: "email", error: "Server nicht erreichbar. Bitte versuche es später." };
  }

  if (!customer) {
    return { step: "email", error: "Kein Kundenkonto mit dieser E-Mail gefunden." };
  }

  await setEmailSessionCookie(email, customer.id);
  redirect("/pages/account");
}
