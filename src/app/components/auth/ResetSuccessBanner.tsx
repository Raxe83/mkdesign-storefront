"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export function ResetSuccessBanner() {
  const params = useSearchParams();

  if (params.get("reset") !== "success") return null;

  return (
    <div
      role="status"
      className="flex items-start gap-2.5 px-4 py-3 rounded-sm border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-sm text-emerald-700 dark:text-emerald-400"
    >
      <CheckCircle size={15} className="shrink-0 mt-0.5" />
      Passwort erfolgreich gespeichert! Du kannst dich jetzt einloggen.
    </div>
  );
}
