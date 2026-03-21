"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { forgotPasswordAction, type ActionResult } from "../../actions/auth";
import { FormField } from "./FormField";

const INITIAL: ActionResult = {};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-sm bg-rust text-white hover:bg-rust/90 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          E-Mail wird gesendet…
        </>
      ) : (
        "Reset-Link anfordern"
      )}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, INITIAL);

  if (state.sent) {
    return (
      <div
        role="status"
        className="flex items-start gap-2.5 px-4 py-3 rounded-sm border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-sm text-emerald-700 dark:text-emerald-400"
      >
        <CheckCircle size={15} className="shrink-0 mt-0.5" />
        E-Mail gesendet. Bitte prüfe dein Postfach, um dein Passwort festzulegen.
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
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
        required
      />

      <SubmitBtn />
    </form>
  );
}
