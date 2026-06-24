"use client";

import { useEffect, useState } from "react";

export interface SessionCustomer {
  firstName: string | null;
  lastName: string | null;
}

/**
 * Lädt den eingeloggten Kunden für Client-Komponenten, die außerhalb der
 * Root-Layout-Serverkomponente liegen (z. B. das Design Studio).
 * `null` = nicht eingeloggt (oder noch nicht geladen).
 */
export function useSessionCustomer(): SessionCustomer | null {
  const [customer, setCustomer] = useState<SessionCustomer | null>(null);

  useEffect(() => {
    fetch("/api/customer")
      .then((res) => res.json())
      .then((data: { customer: SessionCustomer | null }) => setCustomer(data.customer))
      .catch(() => setCustomer(null));
  }, []);

  return customer;
}
