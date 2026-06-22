"use client";

import { useActionState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { sendReturnRequest, type ReturnRequestState } from "../../actions/returnRequest";

const RETURN_REASONS = [
  "Widerruf (14-Tage-Recht)",
  "Artikel beschädigt / defekt",
  "Falscher Artikel erhalten",
  "Artikel entspricht nicht der Beschreibung",
  "Sonstiges",
];

export function GuestReturnForm() {
  const [state, formAction, isPending] = useActionState<ReturnRequestState, FormData>(
    sendReturnRequest,
    { success: false },
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-12 px-6 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
        <CheckCircle size={40} className="text-emerald-500" />
        <h3 className="text-lg font-medium text-primary dark:text-neutral-100">
          Anfrage gesendet
        </h3>
        <p className="text-sm text-muted dark:text-neutral-400">
          Deine Rücksendeanfrage wurde erfolgreich übermittelt.
          Wir melden uns innerhalb von 1–2 Werktagen per E-Mail bei dir.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Order number */}
      <div>
        <label htmlFor="orderNumber" className="block text-xs font-medium text-primary dark:text-neutral-200 mb-1.5">
          Bestellnummer *
        </label>
        <input
          id="orderNumber"
          name="orderNumber"
          type="text"
          required
          placeholder="z.B. 1042"
          className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-primary dark:text-neutral-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="customerName" className="block text-xs font-medium text-primary dark:text-neutral-200 mb-1.5">
          Name *
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          required
          placeholder="Vor- und Nachname"
          className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-primary dark:text-neutral-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="customerEmail" className="block text-xs font-medium text-primary dark:text-neutral-200 mb-1.5">
          E-Mail-Adresse *
        </label>
        <input
          id="customerEmail"
          name="customerEmail"
          type="email"
          required
          placeholder="deine@email.de"
          className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-primary dark:text-neutral-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Reason */}
      <div>
        <label htmlFor="reason" className="block text-xs font-medium text-primary dark:text-neutral-200 mb-1.5">
          Grund der Rücksendung *
        </label>
        <select
          id="reason"
          name="reason"
          required
          className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-primary dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Bitte wählen…</option>
          {RETURN_REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-medium text-primary dark:text-neutral-200 mb-1.5">
          Nachricht (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Weitere Details zur Rücksendung…"
          className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-primary dark:text-neutral-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
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
        disabled={isPending}
        className="w-full rounded bg-accent text-white text-sm font-medium py-3 hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Wird gesendet…" : "Rücksendung anfragen"}
      </button>
    </form>
  );
}
