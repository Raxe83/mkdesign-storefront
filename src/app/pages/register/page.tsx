import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { RegisterAuthTabs } from "../../components/auth/RegisterAuthTabs";
import { getSession } from "../../lib/session";

export const metadata: Metadata = { title: "Registrieren · M.K. Design" };

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/pages/account");

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center pb-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-rust mb-2">
            Neu hier?
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-charcoal dark:text-primary">
            Konto erstellen
          </h1>
          <p className="mt-2 text-sm text-muted">
            Erstelle ein Konto, um Bestellungen zu verfolgen und zu verwalten.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8 shadow-sm">
          <RegisterAuthTabs />
        </div>

      </div>
    </div>
  );
}
