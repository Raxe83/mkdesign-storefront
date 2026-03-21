/**
 * Session-Utility — läuft ausschließlich im Node.js Runtime (Server Actions, Route Handlers).
 * Nicht in Edge-Middleware importieren.
 *
 * Benötigt env-Variable: SESSION_SECRET (mind. 32 Zeichen zufälliger String)
 * Generieren: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mk_session";
const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET muss mind. 32 Zeichen lang sein.");
  }
  // Deterministischer Key aus dem Secret (PBKDF2-ähnlich via scrypt)
  return crypto.scryptSync(secret, "mk_session_salt", 32);
}

// ─── Verschlüsseln ────────────────────────────────────────────────────────────

export function encryptToken(plaintext: string): string {
  const iv = crypto.randomBytes(12); // 96-bit IV für GCM
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag(); // 128-bit Authentifizierungs-Tag
  // Format: iv.ciphertext.authTag (je base64)
  return [iv, encrypted, authTag].map((b) => b.toString("base64url")).join(".");
}

// ─── Entschlüsseln ────────────────────────────────────────────────────────────

export function decryptToken(value: string): string | null {
  try {
    const parts = value.split(".");
    if (parts.length !== 3) return null;
    const [ivB64, encB64, tagB64] = parts;
    const iv = Buffer.from(ivB64, "base64url");
    const encrypted = Buffer.from(encB64, "base64url");
    const authTag = Buffer.from(tagB64, "base64url");
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted).toString("utf8") + decipher.final("utf8");
  } catch {
    return null; // manipulierter oder abgelaufener Cookie
  }
}

// ─── Cookie-Operationen ───────────────────────────────────────────────────────

export async function setSessionCookie(
  accessToken: string,
  expiresAt: string
): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encryptToken(accessToken), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  });
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie) return null;
  return decryptToken(cookie.value);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
