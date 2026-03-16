"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

// Verwende den vorhandenen Image-Typ
interface Image {
  url: string
  altText?: string
  // Weitere Eigenschaften, die dein Image-Typ haben könnte
}

interface ImageGalleryProps {
  // Akzeptiert direkt ein Array von Images
  images: Image[]
  productTitle: string
  showZoom?: boolean
}

export default function ImageGallery({ images = [], productTitle = "Produkt", showZoom = true }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string>(images.length > 0 ? images[0].url : "")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Wenn keine Bilder vorhanden sind, zeige Platzhalter
  if (images.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <div className="flex h-full items-center justify-center bg-gray-200">
          <span className="text-gray-400">Kein Bild</span>
        </div>
      </div>
    )
  }

  const handleThumbnailClick = (url: string, index: number) => {
    setSelectedImage(url)
    setCurrentIndex(index)
    setIsZoomed(false)
  }

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex].url)
    setIsZoomed(false)
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex].url)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    } else if (e.key === "Escape" && isZoomed) {
      setIsZoomed(false)
    }
  }

  return (
    <div className="space-y-4" tabIndex={0} onKeyDown={handleKeyDown} aria-label="Bilder-Galerie">
      {/* Hauptbild Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
        {/* Hauptbild */}
        <div
          className={`h-full w-full transition-all duration-300 ease-in-out ${
            isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
          }`}
          onClick={showZoom ? toggleZoom : undefined}
        >
          <img
            src={selectedImage || "/placeholder.svg"}
            alt={images[currentIndex].altText || `${productTitle} - Bild ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Zoom-Icon */}
        {showZoom && !isZoomed && (
          <button
            className="absolute bottom-2 right-2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm hover:bg-white"
            onClick={toggleZoom}
            aria-label="Bild vergrößern"
          >
            <ZoomIn size={18} />
          </button>
        )}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm hover:bg-white"
              onClick={handlePrevious}
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-700 shadow-sm hover:bg-white"
              onClick={handleNext}
              aria-label="Nächstes Bild"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square overflow-hidden rounded-md border-2 transition-all duration-200 ${
                selectedImage === image.url
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-transparent hover:border-emerald-300"
              }`}
              onClick={() => handleThumbnailClick(image.url, index)}
              aria-label={`${productTitle} - Bild ${index + 1} auswählen`}
              aria-current={selectedImage === image.url}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.altText || `${productTitle} - Bild ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
