"use client";

import { useState, useActionState } from "react";
import { X, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { sendReturnRequest, type ReturnRequestState } from "../../actions/returnRequest";

const RETURN_REASONS = [
  "Widerruf (14-Tage-Recht)",
  "Artikel beschädigt / defekt",
  "Falscher Artikel erhalten",
  "Artikel entspricht nicht der Beschreibung",
  "Sonstiges",
];

interface Props {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  onClose: () => void;
}

export function ReturnRequestModal({ orderNumber, customerName, customerEmail, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [state, formAction, isPending] = useActionState<ReturnRequestState, FormData>(
    sendReturnRequest,
    { success: false },
  );

  if (state.success) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md rounded bg-white dark:bg-zinc-900 p-6 shadow-xl">
          <div className="flex flex-col items-center text-center gap-3">
            <CheckCircle size={40} className="text-emerald-500" />
            <h3 className="text-lg font-medium text-primary dark:text-neutral-100">
              Anfrage gesendet
            </h3>
            <p className="text-sm text-muted dark:text-neutral-400">
              Deine Rücksendeanfrage für Bestellung #{orderNumber} wurde erfolgreich übermittelt.
              Wir melden uns innerhalb von 1–2 Werktagen bei dir.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 text-sm font-medium rounded bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded bg-white dark:bg-zinc-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <RotateCcw size={16} className="text-muted" />
            <h3 className="text-sm font-medium text-primary dark:text-neutral-100">
              Rücksendung — #{orderNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-primary dark:hover:text-neutral-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="p-5 space-y-4">
          <input type="hidden" name="orderNumber" value={orderNumber} />
          <input type="hidden" name="customerName" value={customerName} />
          <input type="hidden" name="customerEmail" value={customerEmail} />

          <p className="text-xs text-muted dark:text-neutral-400">
            Gem. EU-Fernabsatzrichtlinie / § 355 BGB hast du ein 14-tägiges Widerrufsrecht ab Erhalt der Ware.
          </p>

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-primary dark:text-neutral-200 mb-1.5">
              Grund der Rücksendung *
            </label>
            <select
              name="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-primary dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Bitte wählen…</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-primary dark:text-neutral-200 mb-1.5">
              Nachricht (optional)
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="Weitere Details zur Rücksendung…"
              className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-primary dark:text-neutral-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          {/* Error */}
          {state.error && (
            <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !reason}
            className="w-full rounded bg-accent text-white text-sm font-medium py-2.5 hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Wird gesendet…" : "Rücksendung anfragen"}
          </button>
        </form>
      </div>
    </div>
  );
}
