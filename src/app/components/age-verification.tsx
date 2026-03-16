"use client"

import { useState, useEffect } from "react"
import { setCookie, getCookie } from "../lib/cookies"
import { useTranslation } from "react-i18next"
import { useRouter } from 'next/navigation';

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter();
  const [ t ] = useTranslation();

  useEffect(() => {
    const ageVerified = getCookie("age-verified")
    if (!ageVerified) {
      setIsVisible(true)
      document.body.style.overflow = "hidden" // Scrollen verhindern
    }

    return () => {
      document.body.style.overflow = "" // Scrollen wieder erlauben
    }
  }, [])

  const handleVerify = () => {
    setCookie("age-verified", "true", 30)
    setIsVisible(false)
    document.body.style.overflow = "" // Scrollen wieder aktivieren
  }

  const handleReject = () => {
    router.push("/age-restricted")
    document.body.style.overflow = "" // Falls jemand ablehnt, auch wieder aktivieren
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <h2 className="text-xl font-bold">{t("age.header")}</h2>
        <p className="text-gray-600 mt-2">
        {t("age.desc")}
        </p>
        <p className="text-sm text-gray-500 mt-4">
        {t("age.verify")}
        </p>
        <div className="mt-6 flex justify-between">
          <button 
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            onClick={handleReject}
          >
            {t("age.under")}
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleVerify}
          >
            {t("age.over")}
          </button>
        </div>
      </div>
    </div>
  )
}
