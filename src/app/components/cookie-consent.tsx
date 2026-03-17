"use client";

import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import { setCookie, getCookie } from "../lib/cookies";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] =
    useState<keyof typeof cookiePreferences>("essential");
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const [t] = useTranslation();
  useEffect(() => {
    const cookieConsent = getCookie("cookie-consent");
    if (!cookieConsent) {
      setIsVisible(true);
    } else {
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setCookiePreferences(savedPreferences);
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setCookiePreferences(allAccepted);
    saveCookiePreferences(allAccepted);
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(cookiePreferences);
  };

  const saveCookiePreferences = (preferences: typeof cookiePreferences) => {
    setCookie("cookie-consent", JSON.stringify(preferences), 180);
    setIsVisible(false);
  };

  const handleToggle = (category: keyof typeof cookiePreferences) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4 md:p-6 rounded-t-xl"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              {t("cookies.settingsHeader")}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t("cookies.mainDesc")}{" "}
              <Link
                href="/privacy"
                className="underline font-medium text-blue-600"
              >
                {t("common.privacy")}
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-end">
            <Button color="outline_weed" onClick={() => setIsVisible(false)}>
              {t("cookies.decline")}
            </Button>
            <Button color="outline_weed" onClick={handleAcceptSelected}>
              {t("cookies.acceptCurrent")}
            </Button>
            <Button color="earthy" onClick={handleAcceptAll}>
              {t("cookies.acceptAll")}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap space-x-2 sm:space-x-4 border-b pb-2 overflow-x-auto">
            {Object.keys(cookiePreferences).map((key) => (
              <button
                key={key}
                className={`px-3 py-2 rounded-t-md mt-2 text-sm sm:text-base flex-1 sm:flex-none text-center transition-colors ${
                  activeTab === key
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() =>
                  setActiveTab(key as keyof typeof cookiePreferences)
                }
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-4 border rounded-md mt-2 bg-gray-50">
            {activeTab === "essential" ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {t("cookies.necessaryCookies")}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t("cookies.necessaryDesc")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="cursor-not-allowed"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                    {t("cookies.cookies")}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t("cookies.cookiesFunction")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePreferences[activeTab]}
                  onChange={() => handleToggle(activeTab)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
