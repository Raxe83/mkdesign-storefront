"use client";

import { useActionState, useRef, useEffect } from "react";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { sendEmailCode, verifyEmailCode, type EmailCodeState } from "../../actions/emailCode";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

const INITIAL: EmailCodeState = { step: "email" };

export function EmailCodeForm() {
  const [sendState, sendAction] = useActionState(sendEmailCode, INITIAL);
  const [verifyState, verifyAction] = useActionState(verifyEmailCode, INITIAL);
  const codeRef = useRef<HTMLInputElement>(null);

  const step = verifyState.step === "email" && verifyState.error
    ? "email"
    : sendState.step === "code"
      ? "code"
      : "email";

  const email = sendState.email ?? verifyState.email ?? "";
  const error = step === "code" ? verifyState.error : (verifyState.error ?? sendState.error);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  if (step === "email") {
    return (
      <form action={sendAction} className="flex flex-col gap-5">
        {error && <ErrorBanner message={error} />}

        <FormField
          id="codeEmail"
          name="email"
          label="E-Mail-Adresse"
          type="email"
          autoComplete="email"
          placeholder="du@beispiel.de"
          defaultValue={email}
          required
        />

        <SubmitButton label="Anmeldecode senden" pendingLabel="Code wird gesendet..." />

        <p className="text-center text-xs text-muted">
          Wir senden dir einen 6-stelligen Code per E-Mail.
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

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="verifyCode"
            className="text-xs font-medium text-charcoal dark:text-primary tracking-wide"
          >
            Anmeldecode <span className="ml-0.5 text-rust">*</span>
          </label>
          <input
            ref={codeRef}
            id="verifyCode"
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

        <SubmitButton label="Anmelden" pendingLabel="Wird geprüft..." />
      </form>

      <div className="flex items-center justify-between">
        <form action={sendAction}>
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
          <ArrowLeft size={11} /> Andere E-Mail
        </button>
      </div>
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
