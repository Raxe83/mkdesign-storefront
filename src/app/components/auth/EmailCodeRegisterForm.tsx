"use client";

import { useActionState, useRef, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { sendRegisterCode, verifyRegisterCode, type RegisterCodeState } from "../../actions/emailCode";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

const INITIAL: RegisterCodeState = { step: "info" };

export function EmailCodeRegisterForm() {
  const [sendState, sendAction] = useActionState(sendRegisterCode, INITIAL);
  const [verifyState, verifyAction] = useActionState(verifyRegisterCode, INITIAL);
  const codeRef = useRef<HTMLInputElement>(null);

  const step = verifyState.step === "info" && verifyState.error
    ? "info"
    : sendState.step === "code"
      ? "code"
      : "info";

  const firstName = sendState.firstName ?? verifyState.firstName ?? "";
  const lastName = sendState.lastName ?? verifyState.lastName ?? "";
  const email = sendState.email ?? verifyState.email ?? "";
  const error = step === "code" ? verifyState.error : (verifyState.error ?? sendState.error);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  if (step === "info") {
    return (
      <form action={sendAction} className="flex flex-col gap-5">
        {error && <ErrorBanner message={error} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="regFirstName"
            name="firstName"
            label="Vorname"
            autoComplete="given-name"
            placeholder="Max"
            defaultValue={firstName}
            required
          />
          <FormField
            id="regLastName"
            name="lastName"
            label="Nachname"
            autoComplete="family-name"
            placeholder="Mustermann"
            defaultValue={lastName}
            required
          />
        </div>

        <FormField
          id="regCodeEmail"
          name="email"
          label="E-Mail-Adresse"
          type="email"
          autoComplete="email"
          placeholder="du@beispiel.de"
          defaultValue={email}
          required
        />

        <SubmitButton label="Registrierungscode senden" pendingLabel="Code wird gesendet..." />

        <p className="text-center text-xs text-muted">
          Kein Passwort nötig — wir senden dir einen Code per E-Mail.
        </p>

        <p className="text-center text-xs text-muted">
          Bereits registriert?{" "}
          <Link href="/pages/login" className="text-rust hover:underline font-medium">
            Zum Login
          </Link>
        </p>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 px-4 py-3 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-sm text-emerald-700 dark:text-emerald-400">
        <Mail size={15} className="shrink-0" />
        Code wurde an <span className="font-medium">{email}</span> gesendet.
      </div>

      <form action={verifyAction} className="flex flex-col gap-5">
        {error && <ErrorBanner message={error} />}

        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="firstName" value={firstName} />
        <input type="hidden" name="lastName" value={lastName} />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="regVerifyCode"
            className="text-xs font-medium text-charcoal dark:text-primary tracking-wide"
          >
            Registrierungscode <span className="ml-0.5 text-rust">*</span>
          </label>
          <input
            ref={codeRef}
            id="regVerifyCode"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            required
            className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-[0.3em] rounded-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-primary placeholder:text-muted outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-1 hover:border-zinc-400 dark:hover:border-zinc-600"
          />
        </div>

        <SubmitButton label="Konto erstellen" pendingLabel="Wird erstellt..." />
      </form>

      <div className="flex items-center justify-between">
        <form action={sendAction}>
          <input type="hidden" name="firstName" value={firstName} />
          <input type="hidden" name="lastName" value={lastName} />
          <input type="hidden" name="email" value={email} />
          <button
            type="submit"
            className="text-xs text-muted hover:text-rust transition-colors duration-150"
          >
            Code erneut senden
          </button>
        </form>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 text-xs text-muted hover:text-rust transition-colors duration-150"
        >
          <ArrowLeft size={11} /> Zurück
        </button>
      </div>

      <p className="text-center text-[10px] text-muted leading-relaxed">
        Mit der Registrierung stimmst du unseren{" "}
        <Link href="/pages/tos" className="underline hover:text-rust">AGB</Link>{" "}
        und der{" "}
        <Link href="/pages/privacy" className="underline hover:text-rust">Datenschutzerklärung</Link>{" "}
        zu.
      </p>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 px-4 py-3 rounded-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-sm text-red-700 dark:text-red-400">
      <AlertCircle size={15} className="shrink-0 mt-0.5" />
      {message}
    </div>
  );
}
