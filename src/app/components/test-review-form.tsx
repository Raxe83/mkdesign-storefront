"use client";

import type React from "react";
import { useState } from "react";
import { Cannabis } from "lucide-react";
import Image from "next/image";
import { Label } from "./ui/next/ui/label";
import { Card, CardContent } from "./ui/next/ui/card";
import { Input } from "./ui/next/ui/input";
import { Textarea } from "./ui/next/ui/textarea";
import { Button } from "./ui/next/ui/button";
import { Product } from "../types/shopify";
import { Checkbox } from "./ui/next/ui/checkbox";

interface TestReviewFormProps {
  products: Product[];
}

export function TestReviewForm({ products }: TestReviewFormProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [rating, setRating] = useState(1);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>();
  const [anonym, setAnonym] = useState(false);

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const selectedProducts = products.filter((p) =>
    selectedProductIds.includes(p.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProductIds.length === 0) {
      setResult({
        success: false,
        message: "Bitte wähle mindestens ein Produkt aus",
      });
      return;
    }

    if (rating === 0) {
      setResult({
        success: false,
        message: "Bitte wähle eine Bewertung",
      });
      return;
    }

    if (!content.trim()) {
      setResult({
        success: false,
        message: "Bitte gib einen Kommentar ein",
      });
      return;
    }

    if (!customerName.trim()) {
      setResult({
        success: false,
        message: "Bitte gib einen Namen ein",
      });
      return;
    }

    setIsSubmitting(true);
    setResult(undefined);

    try {
      for (const productId of selectedProductIds) {
        const response = await fetch("/api/reviews/create-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId, // einzelne ID
            rating,
            title,
            content,
            customerName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              `Fehler beim Erstellen des Reviews für Produkt ${productId}`
          );
        }
      }

      setResult({
        success: true,
        message: "Alle Reviews wurden erfolgreich erstellt!",
      });

      // Reset
      setTitle("");
      setContent("");
      setRating(5);
    } catch (err) {
      setResult({
        success: false,
        message:
          err instanceof Error ? err.message : "Ein Fehler ist aufgetreten",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Produkte auswählen</Label>
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-2">
              <Checkbox
                id={`product-${product.id}`}
                checked={selectedProductIds.includes(product.id)}
                onCheckedChange={() => toggleProductSelection(product.id)}
              />
              <Label htmlFor={`product-${product.id}`}>{product.title}</Label>
            </div>
          ))}
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-4">
          {selectedProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {product.images.edges.length > 0 ? (
                      <img
                        src={
                          product.images.edges[0].node.url || "/placeholder.svg"
                        }
                        alt={
                          product.images.edges[0].node.altText ||
                          `${product.title} - Thumbnail`
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Kein Bild
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {result && (
          <div
            className={`p-4 rounded-md ${
              result.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {result.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="rating">Bewertung</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl focus:outline-none"
              >
                <Cannabis
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
                <span className="sr-only">{star} Sterne</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Titel (Optional)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fasse deine Erfahrung zusammen"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Dein Kommentar</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Was hat dir an diesem Produkt gefallen oder nicht gefallen?"
            rows={5}
            required
          />
        </div>

        <div>
          <input
            type="checkbox"
            className="mr-2 my-auto"
            checked={anonym}
            onChange={() => {
              setAnonym(!anonym);
              setCustomerName("ANONYM");
            }}
          />
          <Label>Anonym?</Label>
        </div>

        {!anonym && (
          <div className="space-y-2">
            <Label htmlFor="customerName">Dein Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Wie sollen wir dich anzeigen?"
              required
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || selectedProductIds.length === 0}
          className="w-full"
        >
          {isSubmitting ? "Wird erstellt..." : "Review erstellen"}
        </Button>
      </form>
    </div>
  );
}
