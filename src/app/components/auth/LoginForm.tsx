"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, CheckCircle, KeyRound, Loader2 } from "lucide-react";
import { loginAction, forgotPasswordAction, type ActionResult } from "../../actions/auth";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

// ─── Client-Validierung ───────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!EMAIL_RE.test(email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse ein.";
  if (password.length < 8)   errors.password = "Das Passwort muss mindestens 8 Zeichen lang sein.";
  return errors;
}

// ─── Reset-Button mit eigenem Pending-State ───────────────────────────────────

function ResetButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-sm border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-charcoal dark:text-primary hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          E-Mail wird gesendet…
        </>
      ) : (
        <>
          <KeyRound size={14} />
          Passwort für bestehendes Konto festlegen / zurücksetzen
        </>
      )}
    </button>
  );
}

// ─── Komponente ───────────────────────────────────────────────────────────────

const INITIAL: ActionResult = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, INITIAL);
  const [resetState, resetAction] = useActionState(forgotPasswordAction, INITIAL);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [emailValue, setEmailValue] = useState("");

  const loginFailed = !!state.error;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const email    = (form.elements.namedItem("email")    as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const errors = validate(email, password);
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
  }

  return (
    <div className="flex flex-col gap-5">
      <form action={action} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* Server-Fehler */}
        {state.error && (
          <div role="alert" className="flex items-start gap-2.5 px-4 py-3 rounded-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-sm text-red-700 dark:text-red-400">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            {state.error}
          </div>
        )}

        <FormField
          id="email"
          name="email"
          label="E-Mail-Adresse"
          type="email"
          autoComplete="email"
          placeholder="du@beispiel.de"
          error={fieldErrors.email}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailValue(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <FormField
            id="password"
            name="password"
            label="Passwort"
            type="password"
            autoComplete="current-password"
            placeholder="Mindestens 8 Zeichen"
            minLength={8}
            error={fieldErrors.password}
            required
          />
          <Link
            href="/pages/forgot-password"
            className="self-end text-xs text-muted hover:text-rust transition-colors duration-150"
          >
            Passwort vergessen?
          </Link>
        </div>

        <SubmitButton label="Anmelden" pendingLabel="Anmelden…" />

        <p className="text-center text-xs text-muted">
          Noch kein Konto?{" "}
          <Link href="/pages/register" className="text-rust hover:underline font-medium">
            Jetzt registrieren
          </Link>
        </p>
      </form>

      {/* ── Passwort-Reset — erscheint nur nach gescheitertem Login ── */}
      {loginFailed && !resetState.sent && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 flex flex-col gap-3">
          <p className="text-xs text-muted leading-relaxed">
            Bereits Kunde? Falls du noch kein Passwort gesetzt hast oder es vergessen hast,
            kannst du dir einen Reset-Link zuschicken lassen.
          </p>

          {resetState.error && (
            <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle size={12} /> {resetState.error}
            </p>
          )}

          <form action={resetAction}>
            <input type="hidden" name="email" value={emailValue} />
            <ResetButton />
          </form>
        </div>
      )}

      {/* ── Erfolgs-Feedback ── */}
      {resetState.sent && (
        <div
          role="status"
          className="flex items-start gap-2.5 px-4 py-3 rounded-sm border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-sm text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle size={15} className="shrink-0 mt-0.5" />
          E-Mail gesendet. Bitte prüfe dein Postfach, um dein Passwort festzulegen.
        </div>
      )}
    </div>
  );
}
