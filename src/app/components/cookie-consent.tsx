"use client";

import { useState, useEffect } from "react";
import { setCookie, getCookie } from "../lib/cookies";
import { motion } from "framer-motion";
import Link from "next/link";
import type { CookiePreferences } from "../hooks/useCookieConsent";

const REJECTED: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const ACCEPTED_ALL: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const TAB_LABELS: Record<keyof CookiePreferences, string> = {
  essential: "Notwendig",
  functional: "Funktional",
  analytics: "Analyse",
  marketing: "Marketing",
};

const TAB_INFO: Record<keyof CookiePreferences, { title: string; description: string }> = {
  essential: {
    title: "Notwendige Cookies",
    description: "Für den Betrieb der Website zwingend erforderlich (Warenkorb, Session, Sicherheit).",
  },
  functional: {
    title: "Funktionale Cookies",
    description:
      "Erweiterte Funktionen wie Kundenbewertungen (Judge.me) und gespeicherte Einstellungen.",
  },
  analytics: {
    title: "Analyse-Cookies",
    description: "Helfen uns zu verstehen, wie Besucher die Website nutzen.",
  },
  marketing: {
    title: "Marketing-Cookies",
    description: "Werden für personalisierte Werbung und Tracking verwendet.",
  },
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof CookiePreferences>("essential");
  const [preferences, setPreferences] = useState<CookiePreferences>(REJECTED);

  useEffect(() => {
    const saved = getCookie("cookie-consent");
    if (!saved) {
      setIsVisible(true);
    } else {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const save = (prefs: CookiePreferences) => {
    setCookie("cookie-consent", JSON.stringify(prefs), 180);
    setPreferences(prefs);
    setIsVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg dark:shadow-black/30 z-40 p-4 md:p-6 rounded-t-xl"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div>
            <h3 className="text-base font-semibold mb-1.5 text-primary">Wir verwenden Cookies</h3>
            <p className="text-sm text-muted">
              Wir nutzen Cookies, um dir die bestmögliche Erfahrung zu bieten.{" "}
              <Link href="/pages/privacy" className="underline font-medium text-accent hover:text-rustMid transition-colors duration-200">
                Datenschutz
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-end">
            <button
              onClick={() => save(REJECTED)}
              className="w-full sm:w-auto px-4 py-2 rounded border border-border text-sm text-muted hover:text-primary hover:border-muted transition-colors duration-200"
            >
              Ablehnen
            </button>
            <button
              onClick={() => save(preferences)}
              className="w-full sm:w-auto px-4 py-2 rounded border border-border text-sm text-muted hover:text-primary hover:border-muted transition-colors duration-200"
            >
              Auswahl speichern
            </button>
            <button
              onClick={() => save(ACCEPTED_ALL)}
              className="w-full sm:w-auto px-4 py-2 rounded bg-accent hover:bg-rustMid text-white text-sm font-medium transition-colors duration-200"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-1 border-b border-border pb-2">
            {(Object.keys(TAB_LABELS) as Array<keyof CookiePreferences>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-t text-sm transition-colors duration-150 ${
                  activeTab === key
                    ? "bg-accent/10 text-accent border border-accent/20 border-b-transparent"
                    : "text-muted hover:text-primary"
                }`}
              >
                {TAB_LABELS[key]}
              </button>
            ))}
          </div>

          <div className="p-4 border border-border border-t-0 rounded-b bg-surface">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-primary mb-0.5">{TAB_INFO[activeTab].title}</h4>
                <p className="text-xs text-muted">{TAB_INFO[activeTab].description}</p>
              </div>
              <input
                type="checkbox"
                checked={preferences[activeTab]}
                disabled={activeTab === "essential"}
                className="mt-0.5 w-4 h-4 shrink-0 accent-accent disabled:cursor-not-allowed"
                onChange={() => {
                  if (activeTab === "essential") return;
                  setPreferences((prev) => ({ ...prev, [activeTab]: !prev[activeTab] }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
