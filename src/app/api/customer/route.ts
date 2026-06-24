import { NextResponse } from "next/server";
import { getSessionToken } from "@/app/lib/session";
import { getCustomerData } from "@/app/services/shopifyCustomer";

/** Liefert Vor-/Nachname des eingeloggten Kunden für Client-Komponenten (z. B. Design Studio). */
export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ customer: null });

  try {
    const { customer } = await getCustomerData(token);
    if (!customer) return NextResponse.json({ customer: null });
    return NextResponse.json({
      customer: { firstName: customer.firstName, lastName: customer.lastName },
    });
  } catch {
    return NextResponse.json({ customer: null });
  }
}
