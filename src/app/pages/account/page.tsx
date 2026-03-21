import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Mail, User, LogOut } from "lucide-react";
import type { Metadata } from "next";

import { decryptToken } from "../../lib/session";
import { getCustomerData } from "../../services/shopifyCustomer";
import { getCustomerOrders } from "../../services/shopifyCustomer";
import { logoutAction } from "../../actions/auth";
import { OrderHistory } from "../../components/account/OrderHistory";
import { AddressManager } from "../../components/account/AddressManager";

export const metadata: Metadata = { title: "Mein Konto · M.K. Design" };

// ─── Server Component ─────────────────────────────────────────────────────────

export default async function AccountPage() {
  // ── Session prüfen ──────────────────────────────────────────────
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("mk_session");
  if (!sessionCookie) redirect("/pages/login?from=/pages/account");

  const accessToken = decryptToken(sessionCookie.value);
  if (!accessToken) redirect("/pages/login?from=/pages/account");

  // ── Daten parallel laden ────────────────────────────────────────
  const [{ customer }, { orders }] = await Promise.all([
    getCustomerData(accessToken),
    getCustomerOrders(accessToken, 10),
  ]);

  if (!customer) redirect("/pages/login?from=/pages/account");

  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(" ");
  const addresses = customer.addresses.edges.map((e) => e.node);

  return (
    <div className="pb-12 lg:pb-20 space-y-10">

      {/* ── Seitenkopf ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-rust mb-1">
            Mein Konto
          </p>
          <h1 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-tight text-charcoal dark:text-primary leading-tight">
            Hallo, {customer.firstName ?? "dort"} 👋
          </h1>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone dark:text-muted border border-zinc-200 dark:border-zinc-700 rounded-sm hover:border-rust hover:text-rust transition-colors duration-200"
          >
            <LogOut size={14} />
            Abmelden
          </button>
        </form>
      </div>

      {/* ── Profil-Karte ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Name + Email */}
        <div className="flex items-start gap-3 p-5 rounded-sm border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="w-9 h-9 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
            <User size={16} className="text-rust" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.12em] mb-1">
              Profil
            </p>
            <p className="text-sm font-medium text-primary truncate">{fullName || "—"}</p>
            <p className="text-xs text-stone dark:text-muted truncate mt-0.5">{customer.email}</p>
          </div>
        </div>

        {/* Kontakt */}
        <div className="flex items-start gap-3 p-5 rounded-sm border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="w-9 h-9 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
            <Mail size={16} className="text-rust" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.12em] mb-1">
              Kontakt
            </p>
            <p className="text-xs text-stone dark:text-muted break-all">{customer.email}</p>
            {customer.phone && (
              <p className="text-xs text-stone dark:text-muted mt-0.5">{customer.phone}</p>
            )}
          </div>
        </div>

      </div>

      {/* ── Adressverwaltung ── */}
      <AddressManager addresses={addresses} />

      {/* ── Bestellverlauf ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-charcoal dark:text-primary tracking-tight">
            Meine Bestellungen
          </h2>
          <span className="text-xs text-muted">
            {orders.length} {orders.length === 1 ? "Bestellung" : "Bestellungen"}
          </span>
        </div>
        <OrderHistory orders={orders} />
      </div>

    </div>
  );
}
