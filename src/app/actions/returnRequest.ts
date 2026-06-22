"use server";

import { Resend } from "resend";
import { adminFetch } from "../services/shopify/adminClient";

export type ReturnRequestState = {
  success: boolean;
  error?: string;
};

const ORDER_LOOKUP_QUERY = `
  query orderByName($q: String!) {
    orders(first: 1, query: $q) {
      edges {
        node {
          id
          name
          customer { firstName lastName email }
          shippingAddress { firstName lastName }
        }
      }
    }
  }
`;

type OrderLookupResult = {
  orders: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        customer: { firstName: string; lastName: string; email: string } | null;
        shippingAddress: { firstName: string; lastName: string } | null;
      };
    }>;
  };
};

function namesMatch(orderNode: OrderLookupResult["orders"]["edges"][0]["node"], inputName: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const input = norm(inputName);
  if (!input) return false;

  const candidates: string[] = [];
  if (orderNode.customer) {
    candidates.push(norm(`${orderNode.customer.firstName} ${orderNode.customer.lastName}`));
    candidates.push(norm(orderNode.customer.lastName));
  }
  if (orderNode.shippingAddress) {
    candidates.push(norm(`${orderNode.shippingAddress.firstName} ${orderNode.shippingAddress.lastName}`));
    candidates.push(norm(orderNode.shippingAddress.lastName));
  }

  return candidates.some((c) => c === input || c.includes(input) || input.includes(c));
}

export async function sendReturnRequest(
  _prevState: ReturnRequestState,
  formData: FormData,
): Promise<ReturnRequestState> {
  const orderNumber = (formData.get("orderNumber") as string)?.trim();
  const customerName = (formData.get("customerName") as string)?.trim();
  const customerEmail = (formData.get("customerEmail") as string)?.trim();
  const reason = (formData.get("reason") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!orderNumber || !customerName || !customerEmail || !reason) {
    return { success: false, error: "Bitte fülle alle Pflichtfelder aus." };
  }

  // Bestellung in Shopify prüfen
  try {
    const num = orderNumber.replace(/^#/, "");
    const data = await adminFetch<OrderLookupResult>(
      ORDER_LOOKUP_QUERY,
      { q: `name:#${num}` },
      { noCache: true },
    );

    const order = data.orders.edges[0]?.node;
    if (!order) {
      return { success: false, error: "Bestellung nicht gefunden. Bitte prüfe deine Bestellnummer." };
    }

    if (!namesMatch(order, customerName)) {
      return { success: false, error: "Name stimmt nicht mit der Bestellung überein." };
    }
  } catch (err) {
    console.error("[ReturnRequest] Order verification failed:", err);
    return { success: false, error: "Bestellung konnte nicht geprüft werden. Bitte versuche es erneut." };
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
