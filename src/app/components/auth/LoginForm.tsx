"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { loginAction, type ActionResult } from "../../actions/auth";
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

// ─── Komponente ───────────────────────────────────────────────────────────────

const INITIAL: ActionResult = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, INITIAL);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
        />

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

        <SubmitButton label="Anmelden" pendingLabel="Anmelden…" />

        <p className="text-center text-xs text-muted">
          Noch kein Konto?{" "}
          <Link href="/pages/register" className="text-rust hover:underline font-medium">
            Jetzt registrieren
          </Link>
        </p>
      </form>
    </div>
  );
}
