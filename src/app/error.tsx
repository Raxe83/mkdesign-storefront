'use client'

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-rust mb-4">
        Fehler
      </p>
      <h1 className="text-5xl md:text-6xl font-display font-bold text-primary mb-4">
        500
      </h1>
      <h2 className="text-xl md:text-2xl font-medium text-primary mb-4">
        Etwas ist schiefgelaufen
      </h2>
      <p className="text-muted mb-8 max-w-md">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut oder
        kehre zur Startseite zurück.
      </p>

      {error.digest && (
        <p className="text-xs text-muted mb-8 font-mono bg-surface border border-border rounded px-3 py-1">
          Fehler-ID: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="bg-accent hover:bg-rustMid text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="border border-border text-primary hover:bg-surface px-6 py-3 rounded-md font-medium transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
