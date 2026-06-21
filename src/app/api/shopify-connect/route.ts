/**
 * TEMPORÄRE Route — einmalig für OAuth-Token-Austausch.
 * Nach Erhalt des Tokens aus .env.local entfernen.
 */

import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID     = process.env.SHOPIFY_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_APP_CLIENT_SECRET;
const SHOP          = process.env.SHOPIFY_ADMIN_DOMAIN;
const REDIRECT_URI  = "http://localhost:3000/api/shopify-connect";
const SCOPES = [
  "read_customers",
  "write_customers",
  "read_products",
  "write_products",
  "read_orders",
  "read_shipping",
  "read_fulfillments",
  "read_inventory",
  "read_content",
  "read_metaobjects",
  "write_metaobjects",
  "write_metaobject_definitions",
  "read_metaobject_definitions",
].join(",");

export async function GET(req: NextRequest) {
  // Guard: fehlende Env-Vars früh abfangen
  if (!CLIENT_ID || !CLIENT_SECRET || !SHOP) {
    const missing = [
      !CLIENT_ID     && "SHOPIFY_APP_CLIENT_ID",
      !CLIENT_SECRET && "SHOPIFY_APP_CLIENT_SECRET",
      !SHOP          && "SHOPIFY_ADMIN_DOMAIN",
    ].filter(Boolean).join(", ");
    return NextResponse.json(
      { error: "Fehlende Umgebungsvariablen", missing },
      { status: 500 },
    );
  }

  try {
    const code = req.nextUrl.searchParams.get("code");

    // ── Schritt 2: Code → Token tauschen ──────────────────────────────────
    if (code) {
      const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
      });

      const rawText = await res.text();
      let data: { access_token?: string; scope?: string; error?: string } = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        return NextResponse.json(
          { error: "Shopify antwortete kein JSON – CLIENT_SECRET vermutlich falsch", preview: rawText.slice(0, 300) },
          { status: 400 },
        );
      }

      if (!res.ok || !data.access_token) {
        return NextResponse.json(
          { error: "Token-Austausch fehlgeschlagen", details: data },
          { status: 400 },
        );
      }

      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#4ade80">
          <h2 style="color:#fff">✅ Token erhalten!</h2>
          <p style="color:#a1a1aa">Trage diesen Wert in <code>.env.local</code> ein:</p>
          <pre style="background:#18181b;padding:16px;border-radius:8px;border:1px solid #27272a;overflow:auto">SHOPIFY_ADMIN_ACCESS_TOKEN=${data.access_token}</pre>
          <p style="color:#a1a1aa;font-size:13px">Erteilte Scopes: ${data.scope}</p>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } },
      );
    }

    // ── Schritt 1: Weiterleitung zu Shopify OAuth ─────────────────────────
    const authUrl = new URL(`https://${SHOP}/admin/oauth/authorize`);
    authUrl.searchParams.set("client_id",    CLIENT_ID);
    authUrl.searchParams.set("scope",        SCOPES);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("state",        crypto.randomUUID());

    return NextResponse.redirect(authUrl);

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Interner Fehler", message }, { status: 500 });
  }
}
