"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ReturnRequestModal } from "./ReturnRequestModal";

interface Props {
  orderNumber: number;
  financialStatus: string;
  customerName: string;
  customerEmail: string;
}

export function ReturnButton({ orderNumber, financialStatus, customerName, customerEmail }: Props) {
  const [open, setOpen] = useState(false);

  if (financialStatus === "REFUNDED" || financialStatus === "VOIDED") return null;

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Widerruf / Rücksendung"
      >
        <RotateCcw size={12} />
        <span className="hidden sm:inline">Rücksendung</span>
      </button>

      {open && (
        <ReturnRequestModal
          orderNumber={orderNumber}
          customerName={customerName}
          customerEmail={customerEmail}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
