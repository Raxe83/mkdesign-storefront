"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");

    if (savedLang) {
      // Nutzer hat vorher schon eine Sprache gewählt
      i18n.changeLanguage(savedLang);
      setLanguage(savedLang);
    } else {
      // Erstbesuch → Browsersprache setzen
      const browserLang = navigator.language.split("-")[0]; // z. B. "de" aus "de-DE"
      const supportedLangs = ["de", "en", "es", "fr", "nl"];
      const fallbackLang = "en"; // falls Browser-Sprache nicht unterstützt

      const langToSet = supportedLangs.includes(browserLang)
        ? browserLang
        : fallbackLang;

      i18n.changeLanguage(langToSet);
      setLanguage(langToSet);
      localStorage.setItem("language", langToSet);
    }
  }, [i18n]);

  const handleLanguageChange = (lng: string) => {
    localStorage.setItem("language", lng);
    i18n.changeLanguage(lng);
    setLanguage(lng);
    i18n.changeLanguage(lng).then(() => {
      window.location.reload(); // Seite neu laden nach Sprache ändern
    });
  };

  return (
    <select
      className="font-medium bg-transparent cursor-pointer"
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      <option value="de" className="cursor-pointer">
        Deutsch
      </option>
      <option value="en" className="cursor-pointer">
        English
      </option>
      <option value="es" className="cursor-pointer">
        Spain
      </option>
      <option value="fr" className="cursor-pointer">
        France
      </option>
      <option value="nl" className="cursor-pointer">
        Nederlands
      </option>
    </select>
  );
};

export default LanguageSwitcher;
