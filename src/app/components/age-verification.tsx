"use client"

import { useState, useEffect } from "react"
import { setCookie, getCookie } from "../lib/cookies"
import { useRouter } from 'next/navigation';

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter();

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
        <h2 className="text-xl font-bold">Altersverifikation</h2>
        <p className="text-gray-600 mt-2">
        Bist du 18 Jahre oder älter?
        </p>
        <p className="text-sm text-gray-500 mt-4">
        Bitte bestätige dein Alter, um fortzufahren.
        </p>
        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            onClick={handleReject}
          >
            Nein
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleVerify}
          >
            Ja, ich bin 18+
          </button>
        </div>
      </div>
    </div>
  )
}
