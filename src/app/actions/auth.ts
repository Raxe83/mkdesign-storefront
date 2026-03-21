"use server";

import { redirect } from "next/navigation";
import { loginCustomer, registerCustomer, recoverCustomerPassword } from "../services/shopifyCustomer";
import { setSessionCookie, clearSession } from "../lib/session";

// ─── Rückgabe-Typen ───────────────────────────────────────────────────────────

export interface ActionResult {
  error?: string;
  sent?: true;
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Wird von einem <form action={loginAction}> aufgerufen.
 * Bei Erfolg: Cookie setzen → Redirect auf /pages/account.
 * Bei Fehler: { error } zurückgeben (kein Redirect).
 */
export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "E-Mail und Passwort sind Pflichtfelder." };
  }

  let result;
  try {
    result = await loginCustomer(email, password);
  } catch {
    return { error: "Der Server ist momentan nicht erreichbar. Bitte versuche es später." };
  }

  if (result.errors.length > 0 || !result.accessToken) {
    return { error: result.errors[0]?.message ?? "Login fehlgeschlagen." };
  }

  await setSessionCookie(
    result.accessToken.accessToken,
    result.accessToken.expiresAt
  );

  redirect("/pages/account");
}

// ─── Registrierung ────────────────────────────────────────────────────────────

/**
 * Registriert einen neuen Shopify-Kunden.
 * Bei Erfolg: direkt einloggen → Cookie → Redirect auf /pages/account.
 */
export async function registerAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const firstName = (formData.get("firstName") as string | null)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!firstName || !lastName || !email || !password) {
    return { error: "Alle Felder sind Pflichtfelder." };
  }

  if (password.length < 8) {
    return { error: "Das Passwort muss mindestens 8 Zeichen lang sein." };
  }

  let registerResult;
  try {
    registerResult = await registerCustomer(firstName, lastName, email, password);
  } catch {
    return { error: "Der Server ist momentan nicht erreichbar. Bitte versuche es später." };
  }

  if (registerResult.errors.length > 0 || !registerResult.customer) {
    return { error: registerResult.errors[0]?.message ?? "Registrierung fehlgeschlagen." };
  }

  // Direkt einloggen nach erfolgreicher Registrierung
  let loginResult;
  try {
    loginResult = await loginCustomer(email, password);
  } catch {
    redirect("/pages/login");
  }

  if (loginResult!.accessToken) {
    await setSessionCookie(
      loginResult!.accessToken.accessToken,
      loginResult!.accessToken.expiresAt
    );
  }

  redirect("/pages/account");
}

// ─── Passwort zurücksetzen ────────────────────────────────────────────────────

export async function forgotPasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  if (!email) {
    return { error: "Bitte gib deine E-Mail-Adresse ein." };
  }

  let result;
  try {
    result = await recoverCustomerPassword(email);
  } catch {
    return { error: "Der Server ist momentan nicht erreichbar. Bitte versuche es später." };
  }

  if (!result.success) {
    return { error: result.errors[0]?.message ?? "Anfrage fehlgeschlagen." };
  }

  return { sent: true };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
