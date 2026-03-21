import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { decryptToken } from "../../lib/session";

export const metadata: Metadata = { title: "Registrieren · M.K. Design" };

export default async function RegisterPage() {
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
          <RegisterForm />
        </div>

      </div>
    </div>
  );
}
