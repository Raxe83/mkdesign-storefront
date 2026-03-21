import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "../../components/auth/LoginForm";
import { ResetSuccessBanner } from "../../components/auth/ResetSuccessBanner";
import { decryptToken } from "../../lib/session";

export const metadata: Metadata = { title: "Anmelden · M.K. Design" };

export default async function LoginPage() {
  // Bereits eingeloggt? → direkt weiterleiten
  const cookieStore = await cookies();
  const session = cookieStore.get("mk_session");
  if (session && decryptToken(session.value)) {
    redirect("/pages/account");
  }

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

        {/* Reset-Erfolg Banner */}
        <Suspense>
          <ResetSuccessBanner />
        </Suspense>

        {/* Card */}
        <div className="mt-4 rounded-sm border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8 shadow-sm">
          <LoginForm />
        </div>

      </div>
    </div>
  );
}
