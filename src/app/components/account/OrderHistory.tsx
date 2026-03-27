import Link from "next/link";
import { Package, Truck, Calendar, ShoppingBag } from "lucide-react";
import { cn } from "../../utils/utils";
import type { Order, OrderFulfillmentStatus, OrderFinancialStatus } from "../../types/shopify";

// ─── Status-Konfiguration ─────────────────────────────────────────────────────

export const FULFILLMENT: Record<OrderFulfillmentStatus, { label: string; className: string }> = {
  FULFILLED:           { label: "Versandt",          className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  IN_PROGRESS:         { label: "Unterwegs",          className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  PARTIALLY_FULFILLED: { label: "Teilw. versandt",    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  READY_FOR_PICKUP:    { label: "Abholbereit",        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  UNFULFILLED:         { label: "In Bearbeitung",     className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  ON_HOLD:             { label: "Zurückgehalten",     className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  OPEN:                { label: "Offen",              className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  PENDING_FULFILLMENT: { label: "Ausstehend",         className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  RESTOCKED:           { label: "Zurückgelegt",       className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  SCHEDULED:           { label: "Geplant",            className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
};

export const FINANCIAL: Record<OrderFinancialStatus, { label: string; className: string }> = {
  PAID:               { label: "Bezahlt",        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  PENDING:            { label: "Ausstehend",     className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  REFUNDED:           { label: "Erstattet",      className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  PARTIALLY_REFUNDED: { label: "Teil-Erstattung", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  AUTHORIZED:         { label: "Autorisiert",    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  PARTIALLY_PAID:     { label: "Teilbezahlt",    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  EXPIRED:            { label: "Abgelaufen",     className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  VOIDED:             { label: "Storniert",      className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
};

// ─── Sub-Komponenten ──────────────────────────────────────────────────────────

export function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium", className)}>
      {label}
    </span>
  );
}

function OrderRow({ order }: { order: Order }) {
  const items = order.lineItems.edges.map((e) => e.node);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const firstName = items[0]?.title ?? "—";
  const hasMore = items.length > 1;
  const orderId = (order.id.split("/").pop() ?? "").split("?")[0];

  const date = new Date(order.processedAt).toLocaleDateString("de-DE", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const price = parseFloat(order.totalPrice.amount).toLocaleString("de-DE", {
    style: "currency",
    currency: order.totalPrice.currencyCode,
  });

  const fulfillment = FULFILLMENT[order.fulfillmentStatus] ?? FULFILLMENT.UNFULFILLED;
  const financial   = FINANCIAL[order.financialStatus]     ?? FINANCIAL.PENDING;

  return (
    <li>
    <Link
      href={`/pages/account/orders/${orderId}`}
      className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-3 sm:gap-6 px-5 py-4 border-b border-zinc-200/60 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-150 group"
    >
      {/* Icon */}
      <div className="hidden sm:flex items-start pt-0.5">
        <div className="w-9 h-9 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
          {order.fulfillmentStatus === "FULFILLED"
            ? <Truck size={16} className="text-emerald-600" />
            : <Package size={16} className="text-zinc-500" />
          }
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-primary font-body">
            Bestellung #{order.orderNumber}
          </span>
          <StatusBadge {...fulfillment} />
          <StatusBadge {...financial} />
        </div>
        <p className="text-xs text-stone dark:text-muted line-clamp-1">
          {firstName}{hasMore ? ` +${items.length - 1} weitere` : ""} · {itemCount} Artikel
        </p>
        <div className="flex items-center gap-1 text-xs text-muted">
          <Calendar size={11} className="shrink-0" />
          {date}
        </div>
      </div>

      {/* Preis + Arrow */}
      <div className="flex items-start justify-between sm:justify-end sm:flex-col sm:items-end gap-1">
        <span className="text-sm font-medium text-primary">{price}</span>
        <span className="hidden sm:block text-xs text-muted group-hover:text-rust transition-colors duration-150">Details →</span>
      </div>
    </Link>
    </li>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function OrderHistorySkeleton() {
  return (
    <div className="rounded-sm border border-zinc-200/60 dark:border-zinc-800 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-zinc-200/60 dark:border-zinc-800 last:border-0">
          <div className="hidden sm:block w-9 h-9 rounded-sm bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            </div>
            <div className="h-3 w-48 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
          <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-sm border border-dashed border-zinc-300 dark:border-zinc-700">
        <ShoppingBag size={32} className="text-muted mb-3" />
        <p className="text-sm font-medium text-primary mb-1">Noch keine Bestellungen</p>
        <p className="text-xs text-muted">Deine Bestellungen erscheinen hier nach dem Kauf.</p>
      </div>
    );
  }

  return (
    <ul className="rounded-sm border border-zinc-200/60 dark:border-zinc-800 overflow-hidden divide-y-0">
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </ul>
  );
}
