import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Passwort zurücksetzen · M.K. Design" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-rust mb-2">
            Konto-Zugang
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-charcoal dark:text-primary">
            Passwort zurücksetzen
          </h1>
          <p className="mt-2 text-sm text-muted">
            Gib deine E-Mail-Adresse ein — wir schicken dir einen Reset-Link.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-8 shadow-sm">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/pages/login" className="text-rust hover:underline font-medium">
            ← Zurück zur Anmeldung
          </Link>
        </p>

      </div>
    </div>
  );
}
