import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Package, Truck, ExternalLink, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

import { getSession } from "@/app/lib/session";
import { getOrderDetail } from "@/app/services/shopifyCustomer";
import { adminGetOrderDetail } from "@/app/services/shopify/adminCustomer";
import { FULFILLMENT, FINANCIAL, StatusBadge } from "@/app/components/account/OrderHistory";
import type { OrderDetailLineItem } from "@/app/types/shopify";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: string, currency: string) {
  return parseFloat(amount).toLocaleString("de-DE", { style: "currency", currency });
}

// ─── Line Item Row ─────────────────────────────────────────────────────────────

function LineItemRow({ item }: { item: OrderDetailLineItem }) {
  const img = item.variant?.image;
  const opts = (item.variant?.selectedOptions ?? []).filter((o) => o.value !== "Default Title");
  const total = item.originalTotalPrice
    ? fmt(item.originalTotalPrice.amount, item.originalTotalPrice.currencyCode)
    : null;

  return (
    <div className="flex gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="w-16 h-16 rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
        {img
          ? <Image src={img.url} alt={img.altText ?? item.title} width={64} height={64} className="w-full h-full object-cover" />
          : <Package size={18} className="text-zinc-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary line-clamp-2">{item.title}</p>
        {opts.length > 0 && (
          <p className="text-xs text-muted mt-0.5">{opts.map((o) => o.value).join(" · ")}</p>
        )}
        <p className="text-xs text-muted mt-0.5">×{item.quantity}</p>
      </div>
      {total && <p className="text-sm font-medium text-primary shrink-0 pt-0.5">{total}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Bestellung #${id} · M.K. Design` };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect(`/pages/login?from=/pages/account/orders/${id}`);

  const order = session.type === "token"
    ? await getOrderDetail(id, session.accessToken)
    : await adminGetOrderDetail(id);
  if (!order) notFound();

  const items = order.lineItems.edges.map((e) => e.node);
  const trackingEntries = order.successfulFulfillments?.flatMap((f) => f.trackingInfo) ?? [];
  const fulfillment = FULFILLMENT[order.fulfillmentStatus] ?? FULFILLMENT.UNFULFILLED;
  const financial = FINANCIAL[order.financialStatus] ?? FINANCIAL.PENDING;
  const isPickup = !order.shippingAddress;
  const isReadyForPickup =
    isPickup &&
    (order.fulfillmentStatus === "READY_FOR_PICKUP" ||
      order.fulfillmentStatus === "FULFILLED" ||
      order.fulfillmentStatus === "IN_PROGRESS") &&
    trackingEntries.length === 0;
  const date = new Date(order.processedAt).toLocaleDateString("de-DE", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="pb-12 lg:pb-20 space-y-8">

      {/* Header */}
      <div>
        <Link href="/pages/account" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors duration-150 mb-6">
          <ArrowLeft size={13} /> Zurück zu meinen Bestellungen
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-rust mb-1">Bestelldetails</p>
            <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-tight text-charcoal dark:text-primary">
              Bestellung #{order.orderNumber}
            </h1>
            <p className="text-sm text-muted mt-1">{date}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge {...fulfillment} />
            <StatusBadge {...financial} />
            {order.statusUrl && (
              <a href={order.statusUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-sm border border-zinc-200 dark:border-zinc-700 text-muted hover:text-primary hover:border-zinc-400 transition-colors duration-150">
                Shopify-Status <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-sm border border-zinc-200/60 dark:border-zinc-800">
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted">Bestellte Artikel</p>
        </div>
        <div className="px-5">
          {items.map((item, i) => <LineItemRow key={i} item={item} />)}
        </div>
      </div>

      {/* Tracking + Shipping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`rounded-sm border p-5 ${isReadyForPickup ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-zinc-200/60 dark:border-zinc-800"}`}>
          <div className="flex items-center gap-2 mb-4">
            {isPickup
              ? <ShoppingBag size={15} className={isReadyForPickup ? "text-emerald-600 dark:text-emerald-400" : "text-muted"} />
              : <Truck size={15} className="text-muted" />
            }
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted">
              {isPickup ? "Abholung" : "Versand & Tracking"}
            </p>
          </div>

          {isPickup ? (
            isReadyForPickup ? (
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Deine Bestellung ist abholbereit!</p>
                  <p className="text-xs text-muted mt-0.5">Du kannst sie jetzt bei uns abholen.</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">
                {order.fulfillmentStatus === "UNFULFILLED" || order.fulfillmentStatus === "PENDING_FULFILLMENT"
                  ? "Deine Bestellung wird gerade vorbereitet."
                  : order.fulfillmentStatus === "ON_HOLD"
                    ? "Deine Bestellung wird noch geprüft."
                    : "Wir benachrichtigen dich, sobald sie abholbereit ist."}
              </p>
            )
          ) : trackingEntries.length > 0 ? (
            <ul className="space-y-3">
              {trackingEntries.map((t, i) => (
                <li key={i}>
                  <p className="font-mono text-xs font-medium text-primary">{t.number}</p>
                  {t.url && (
                    <a href={t.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-rust hover:text-rust/80 mt-0.5 transition-colors duration-150">
                      Sendung verfolgen <ExternalLink size={11} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted">
              {order.fulfillmentStatus === "UNFULFILLED" || order.fulfillmentStatus === "PENDING_FULFILLMENT"
                ? "Deine Bestellung wird gerade vorbereitet."
                : "Noch keine Trackingnummer vorhanden."}
            </p>
          )}
        </div>

        <div className="rounded-sm border border-zinc-200/60 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={15} className="text-muted" />
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted">
              {isPickup ? "Abholadresse" : "Lieferadresse"}
            </p>
          </div>
          {order.shippingAddress ? (
            <address className="not-italic text-sm text-muted leading-relaxed space-y-0.5">
              <p className="text-primary font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>{order.shippingAddress.zip} {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.country}</p>
            </address>
          ) : (
            <p className="text-xs text-muted">Keine Lieferadresse vorhanden.</p>
          )}
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-sm border border-zinc-200/60 dark:border-zinc-800 p-5 max-w-xs ml-auto">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted mb-4">Zusammenfassung</p>
        <dl className="space-y-2">
          {order.subtotalPrice && (
            <div className="flex justify-between text-sm">
              <dt className="text-muted">Zwischensumme</dt>
              <dd className="text-primary">{fmt(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}</dd>
            </div>
          )}
          {order.totalShippingPrice && (
            <div className="flex justify-between text-sm">
              <dt className="text-muted">Versand</dt>
              <dd className="text-primary">{fmt(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}</dd>
            </div>
          )}
          {order.totalTax && parseFloat(order.totalTax.amount) > 0 && (
            <div className="flex justify-between text-sm">
              <dt className="text-muted">MwSt.</dt>
              <dd className="text-primary">{fmt(order.totalTax.amount, order.totalTax.currencyCode)}</dd>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-1">
            <dt className="text-primary">Gesamt</dt>
            <dd className="text-primary">{fmt(order.totalPrice.amount, order.totalPrice.currencyCode)}</dd>
          </div>
        </dl>
      </div>

    </div>
  );
}
