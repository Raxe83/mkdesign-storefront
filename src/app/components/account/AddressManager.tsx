"use client";

import { useActionState, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "../../utils/utils";
import type { CustomerAddress } from "../../types/shopify";
import { AddressForm } from "./AddressForm";
import {
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
  type AddressActionResult,
} from "../../actions/address";

type Mode = "view" | "add" | { type: "edit"; address: CustomerAddress };

const EMPTY: AddressActionResult = {};

// ─── Einzelne Adresskarte ─────────────────────────────────────────────────────

function AddressCard({
  address,
  onEdit,
}: {
  address: CustomerAddress;
  onEdit: () => void;
}) {
  const [deleteState, deleteAction] = useActionState(deleteAddressAction, EMPTY);

  return (
    <div className="relative flex flex-col gap-3 p-4 rounded-sm border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex items-start gap-2.5">
        <MapPin size={14} className="text-rust shrink-0 mt-0.5" />
        <address className="not-italic text-sm text-charcoal dark:text-primary leading-relaxed flex-1">
          {[address.firstName, address.lastName].filter(Boolean).join(" ") && (
            <span className="font-medium block">
              {[address.firstName, address.lastName].filter(Boolean).join(" ")}
            </span>
          )}
          {address.address1}<br />
          {address.address2 && <>{address.address2}<br /></>}
          {address.zip} {address.city}<br />
          {address.country}
          {address.phone && <><br />{address.phone}</>}
        </address>
      </div>

      {deleteState.error && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle size={11} /> {deleteState.error}
        </p>
      )}

      <div className="flex gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary transition-colors duration-150 py-1 px-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Pencil size={12} /> Bearbeiten
        </button>

        <form action={deleteAction} className="ml-auto">
          <input type="hidden" name="addressId" value={address.id} />
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 py-1 px-2 rounded-sm hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={12} /> Löschen
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

interface AddressManagerProps {
  addresses: CustomerAddress[];
}

export function AddressManager({ addresses }: AddressManagerProps) {
  const [mode, setMode] = useState<Mode>("view");
  const [addState, addAction] = useActionState(addAddressAction, EMPTY);
  const [editState, editAction] = useActionState(updateAddressAction, EMPTY);

  // Nach Erfolg automatisch zurück zur Listenansicht
  if (addState.success && mode === "add") setMode("view");
  if (editState.success && typeof mode === "object") setMode("view");

  const editAddress = typeof mode === "object" ? mode.address : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-charcoal dark:text-primary tracking-tight">
          Meine Adressen
        </h2>
        {mode === "view" && (
          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rust border border-rust/40 rounded-sm hover:bg-rust hover:text-white transition-colors duration-200"
          >
            <Plus size={13} /> Adresse hinzufügen
          </button>
        )}
      </div>

      {/* ── Formular: Neue Adresse ── */}
      {mode === "add" && (
        <div className="rounded-sm border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
          <p className="text-xs font-medium text-muted uppercase tracking-[0.12em]">Neue Adresse</p>
          {addState.error && (
            <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
              <AlertCircle size={14} /> {addState.error}
            </p>
          )}
          <AddressForm
            action={addAction}
            onCancel={() => setMode("view")}
            submitLabel="Adresse speichern"
            pendingLabel="Wird gespeichert…"
          />
        </div>
      )}

      {/* ── Adresskarten ── */}
      {addresses.length === 0 && mode === "view" ? (
        <div className="flex flex-col items-center justify-center py-10 text-center rounded-sm border border-dashed border-zinc-300 dark:border-zinc-700">
          <MapPin size={28} className="text-muted mb-2" />
          <p className="text-sm font-medium text-primary mb-0.5">Noch keine Adressen</p>
          <p className="text-xs text-muted">Füge eine Lieferadresse hinzu.</p>
        </div>
      ) : (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", mode !== "view" && "opacity-60 pointer-events-none")}>
          {addresses.map((addr) =>
            editAddress?.id === addr.id ? (
              <div key={addr.id} className="sm:col-span-2 rounded-sm border border-rust/30 bg-white dark:bg-zinc-900 p-5 space-y-4">
                <p className="text-xs font-medium text-muted uppercase tracking-[0.12em]">Adresse bearbeiten</p>
                {editState.error && (
                  <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle size={14} /> {editState.error}
                  </p>
                )}
                <AddressForm
                  action={editAction}
                  defaultValues={addr}
                  addressId={addr.id}
                  onCancel={() => setMode("view")}
                  submitLabel="Änderungen speichern"
                  pendingLabel="Wird gespeichert…"
                />
              </div>
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={() => setMode({ type: "edit", address: addr })}
              />
            )
          )}
        </div>
      )}

      {/* Erfolgs-Feedback */}
      {(addState.success || editState.success) && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle size={14} /> Adresse erfolgreich gespeichert.
        </p>
      )}
    </div>
  );
}
