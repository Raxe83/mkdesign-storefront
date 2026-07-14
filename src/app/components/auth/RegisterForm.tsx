"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { registerAction, type ActionResult } from "../../actions/auth";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

// ─── Client-Validierung ───────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

function validate(data: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};
  if (data.firstName.trim().length < 2)   errors.firstName = "Bitte gib deinen Vornamen ein (mind. 2 Zeichen).";
  if (data.lastName.trim().length < 2)    errors.lastName  = "Bitte gib deinen Nachnamen ein (mind. 2 Zeichen).";
  if (!EMAIL_RE.test(data.email))         errors.email     = "Bitte gib eine gültige E-Mail-Adresse ein.";
  if (data.password.length < 8)          errors.password  = "Das Passwort muss mindestens 8 Zeichen lang sein.";
  if (data.password !== data.passwordConfirm)
    errors.passwordConfirm = "Die Passwörter stimmen nicht überein.";
  return errors;
}

// ─── Komponente ───────────────────────────────────────────────────────────────

const INITIAL: ActionResult = {};

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, INITIAL);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const els = e.currentTarget.elements;
    const get = (n: string) => (els.namedItem(n) as HTMLInputElement).value;

    const errors = validate({
      firstName:       get("firstName"),
      lastName:        get("lastName"),
      email:           get("email"),
      password:        get("password"),
      passwordConfirm: get("passwordConfirm"),
    });

    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
  }

  return (
    <form action={action} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* Server-Fehler */}
      {state.error && (
        <div role="alert" className="flex items-start gap-2.5 px-4 py-3 rounded-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-sm text-red-700 dark:text-red-400">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          {state.error}
        </div>
      )}

      {/* Name — nebeneinander auf sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="firstName"
          name="firstName"
          label="Vorname"
          autoComplete="given-name"
          placeholder="Max"
          error={fieldErrors.firstName}
          required
        />
        <FormField
          id="lastName"
          name="lastName"
          label="Nachname"
          autoComplete="family-name"
          placeholder="Mustermann"
          error={fieldErrors.lastName}
          required
        />
      </div>

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
        autoComplete="new-password"
        placeholder="Mindestens 8 Zeichen"
        minLength={8}
        error={fieldErrors.password}
        required
      />

      <FormField
        id="passwordConfirm"
        name="passwordConfirm"
        label="Passwort bestätigen"
        type="password"
        autoComplete="new-password"
        placeholder="Passwort wiederholen"
        error={fieldErrors.passwordConfirm}
        required
      />

      <SubmitButton label="Konto erstellen" pendingLabel="Registrierung läuft…" />

      <p className="text-center text-xs text-muted">
        Bereits registriert?{" "}
        <Link href="/pages/login" className="text-rust hover:underline font-medium">
          Zum Login
        </Link>
      </p>

      <p className="text-center text-[10px] text-muted leading-relaxed">
        Mit der Registrierung stimmst du unseren{" "}
        <Link href="/pages/terms-of-service" className="underline hover:text-rust">AGB</Link>{" "}
        und der{" "}
        <Link href="/pages/privacy" className="underline hover:text-rust">Datenschutzerklärung</Link>{" "}
        zu.
      </p>
    </form>
  );
}
