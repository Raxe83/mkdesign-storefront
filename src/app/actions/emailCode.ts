"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { encryptToken, decryptToken, setEmailSessionCookie } from "../lib/session";
import { adminLookupCustomerByEmail, adminCreateCustomer } from "../services/shopify/adminCustomer";

const CODE_COOKIE = "mk_email_code";
const REG_CODE_COOKIE = "mk_register_code";
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
      from: "M.K. Design <noreply@mkdesignweb.de>",
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

// ─── Code-Registrierung ─────────────────────────────────────────────────────

export interface RegisterCodeState {
  step: "info" | "code";
  firstName?: string;
  lastName?: string;
  email?: string;
  error?: string;
}

export async function sendRegisterCode(
  _prev: RegisterCodeState,
  formData: FormData,
): Promise<RegisterCodeState> {
  const firstName = (formData.get("firstName") as string)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim().toLowerCase() ?? "";

  if (firstName.length < 2) return { step: "info", error: "Bitte gib deinen Vornamen ein (mind. 2 Zeichen)." };
  if (lastName.length < 2) return { step: "info", error: "Bitte gib deinen Nachnamen ein (mind. 2 Zeichen)." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { step: "info", error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }

  const code = crypto.randomInt(100000, 999999).toString();
  const payload = JSON.stringify({ firstName, lastName, email, code, ts: Date.now() });

  const store = await cookies();
  store.set(REG_CODE_COOKIE, encryptToken(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { step: "info", error: "E-Mail-Dienst nicht konfiguriert." };
  }

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: "M.K. Design <noreply@mkdesignweb.de>",
      to: email,
      subject: `${code} — Dein Registrierungscode`,
      text: [
        `Hallo ${firstName},`,
        "",
        `Dein Registrierungscode für M.K. Design: ${code}`,
        "",
        "Der Code ist 10 Minuten gültig.",
        "",
        "Falls du diese Registrierung nicht angefordert hast, ignoriere diese E-Mail.",
      ].join("\n"),
    });
  } catch {
    return { step: "info", error: "Code konnte nicht gesendet werden. Bitte versuche es erneut." };
  }

  return { step: "code", firstName, lastName, email };
}

export async function verifyRegisterCode(
  _prev: RegisterCodeState,
  formData: FormData,
): Promise<RegisterCodeState> {
  const inputCode = (formData.get("code") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim().toLowerCase() ?? "";
  const firstName = (formData.get("firstName") as string)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string)?.trim() ?? "";

  if (!inputCode || inputCode.length !== 6) {
    return { step: "code", firstName, lastName, email, error: "Bitte gib den 6-stelligen Code ein." };
  }

  const store = await cookies();
  const codeCookie = store.get(REG_CODE_COOKIE);
  if (!codeCookie) {
    return { step: "info", error: "Code abgelaufen. Bitte starte erneut." };
  }

  const raw = decryptToken(codeCookie.value);
  if (!raw) {
    return { step: "info", error: "Code ungültig. Bitte starte erneut." };
  }

  const stored = JSON.parse(raw) as { firstName: string; lastName: string; email: string; code: string; ts: number };

  if (Date.now() - stored.ts > CODE_TTL_MS) {
    store.delete(REG_CODE_COOKIE);
    return { step: "info", error: "Code abgelaufen. Bitte starte erneut." };
  }

  if (stored.email !== email) {
    return { step: "info", error: "E-Mail stimmt nicht überein. Bitte starte erneut." };
  }

  const codeMatch =
    stored.code.length === inputCode.length &&
    crypto.timingSafeEqual(Buffer.from(stored.code), Buffer.from(inputCode));

  if (!codeMatch) {
    return { step: "code", firstName, lastName, email, error: "Code ist falsch. Bitte versuche es erneut." };
  }

  store.delete(REG_CODE_COOKIE);

  let customer;
  try {
    customer = await adminCreateCustomer(stored.firstName, stored.lastName, email);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("taken") || msg.includes("bereits") || msg.includes("already")) {
      return { step: "info", error: "Ein Konto mit dieser E-Mail existiert bereits. Bitte melde dich an." };
    }
    return { step: "info", error: msg || "Registrierung fehlgeschlagen." };
  }

  await setEmailSessionCookie(email, customer.id);
  redirect("/pages/account");
}
