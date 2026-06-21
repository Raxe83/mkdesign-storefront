import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthTabs } from "../../components/auth/AuthTabs";
import { getSession } from "../../lib/session";

export const metadata: Metadata = { title: "Anmelden · M.K. Design" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/pages/account");

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center pb-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-rust mb-2">
            Willkommen zurück
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-charcoal dark:text-primary">
            Anmelden
          </h1>
          <p className="mt-2 text-sm text-muted">
            Melde dich an, um deine Bestellungen zu verwalten.
          </p>
        </div>

        {/* Card */}
        <div className="mt-4 rounded-sm border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8 shadow-sm">
          <AuthTabs />
        </div>

      </div>
    </div>
  );
}
