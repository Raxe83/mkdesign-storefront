"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react"; // Mail-Icon für den Hinweis
import Link from "next/link";

type Status = "idle" | "loading" | "success" | "error";

const JoinUs = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Anmeldung fehlgeschlagen.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Netzwerkfehler. Bitte versuche es später erneut.");
      setStatus("error");
    }
  };

  return (
    <div className="w-full bg-background border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-8 h-px bg-rust" />
            <span className="text-xs font-medium text-rust tracking-[0.15em] uppercase">Newsletter</span>
            <span className="block w-8 h-px bg-rust" />
          </div>
          <h2 className="font-display font-bold tracking-tight text-[clamp(1.75rem,3.5vw,2.4rem)] text-primary mb-3">
            Nichts verpassen
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-8 max-w-[38ch] mx-auto">
            Neue Produkte, Rabattcodes &amp; Angebote direkt in Euer Postfach.
          </p>

          {status === "success" ? (
            /* --- NEUER INDIKATOR-TEXT FÜR DOUBLE-OPT-IN --- */
            <div className="flex flex-col items-center gap-3 py-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-md border border-zinc-200/60 dark:border-zinc-800 max-w-md mx-auto mb-6 p-4">
              <Mail size={32} className="text-rust animate-pulse" />
              <p className="text-sm font-semibold text-primary">Fast geschafft!</p>
              <p className="text-xs text-muted max-w-[32ch] mx-auto leading-relaxed">
                Wir haben dir eine Bestätigungs-E-Mail an <strong className="text-primary">{email}</strong> gesendet. 
                Bitte klicke auf den dortigen Link, um deine Anmeldung zu aktivieren.
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail-Adresse eingeben"
                  required
                  disabled={status === "loading"}
                  className="flex-1 px-4 py-2.5 text-sm rounded-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-rust focus:border-rust/40 transition-colors duration-200 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-rust text-white text-sm font-medium tracking-[0.04em] uppercase hover:bg-rust/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sende Link…" : <> Anmelden <ArrowRight size={14} /> </>}
                </button>
              </form>

              {status === "error" && (
                <p className="text-xs text-red-500 mb-3">{errorMsg}</p>
              )}
            </>
          )}

          <p className="text-xs text-muted">
            Mit der Anmeldung stimmst du unseren{" "}
            <Link href="/pages/terms-of-service" className="hover:text-primary underline underline-offset-2 transition-colors duration-150">Nutzungsbedingungen</Link>
            {" "}und der{" "}
            <Link href="/pages/privacy" className="hover:text-primary underline underline-offset-2 transition-colors duration-150">Datenschutzerklärung</Link> zu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;