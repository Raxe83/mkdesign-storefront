"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getCollections } from "../services/shopify"
import Link from "next/link"
import { ShopifyCollection } from "./CollectionsList"

const FeaturedCollections: React.FC = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCollections = async (): Promise<void> => {
      try {
        const data = await getCollections()
        setCollections(data)
      } catch {
        // ignore, show empty state
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (collections.length === 0) {
    return null
  }

  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Unsere Kollektionen</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/products?collection=${collection.handle}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <div className="aspect-[3/4] bg-gray-100">
              {collection.image ? (
                <img
                  src={collection.image.url || "/placeholder.svg"}
                  alt={collection.image.altText || collection.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <span className="text-gray-400">Kein Bild</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{collection.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCollections

