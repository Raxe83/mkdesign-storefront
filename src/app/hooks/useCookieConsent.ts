"use client";

import { useState, useEffect } from "react";
import { getCookie } from "../lib/cookies";

export type CookiePreferences = {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_DEFAULTS: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

function readPreferences(): CookiePreferences {
  try {
    const saved = getCookie("cookie-consent");
    if (saved) return JSON.parse(saved) as CookiePreferences;
  } catch {
    // invalid cookie — fall back to defaults
  }
  return COOKIE_CONSENT_DEFAULTS;
}

/**
 * Returns the current cookie consent preferences.
 * Re-renders automatically when the user updates their consent via the banner.
 */
export function useCookieConsent(): CookiePreferences {
  const [prefs, setPrefs] = useState<CookiePreferences>(COOKIE_CONSENT_DEFAULTS);

  useEffect(() => {
    setPrefs(readPreferences());

    const onUpdate = () => setPrefs(readPreferences());
    window.addEventListener("cookie-consent-updated", onUpdate);
    return () => window.removeEventListener("cookie-consent-updated", onUpdate);
  }, []);

  return prefs;
}
