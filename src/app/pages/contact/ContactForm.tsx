'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendContactEmail, type ContactFormState } from './actions';

const initialState: ContactFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent hover:bg-rustMid disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-medium transition-colors duration-200"
    >
      {pending ? 'Wird gesendet…' : 'Nachricht senden'}
    </button>
  );
}

export default function ContactForm() {
  const [state, action] = useActionState(sendContactEmail, initialState);

  if (state.success) {
    return (
      <div className="rounded border border-border bg-surface p-6 text-center">
        <p className="text-lg font-medium text-primary mb-1">Nachricht gesendet!</p>
        <p className="text-sm text-muted">Wir melden uns so schnell wie möglich bei dir.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs text-muted uppercase tracking-wider mb-1.5">
            Name <span className="text-rust">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Max Mustermann"
            className="w-full bg-transparent border border-border rounded px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-muted uppercase tracking-wider mb-1.5">
            E-Mail <span className="text-rust">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="deine@email.de"
            className="w-full bg-transparent border border-border rounded px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs text-muted uppercase tracking-wider mb-1.5">
          Betreff
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="z.B. Anfrage Feuertonne, Gravur, …"
          className="w-full bg-transparent border border-border rounded px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs text-muted uppercase tracking-wider mb-1.5">
          Nachricht <span className="text-rust">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Beschreibe deine Anfrage oder dein Wunschprodukt…"
          className="w-full bg-transparent border border-border rounded px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-rust">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
