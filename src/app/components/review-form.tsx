"use client";

import type React from "react";

import { useState } from "react";
import { Star } from "lucide-react";
import { Label } from "./ui/next/ui/label";
import { Input } from "./ui/next/ui/input";
import { Textarea } from "./ui/next/ui/textarea";
import { Button } from "./ui/next/ui/button";
import { Checkbox } from "./ui/next/ui/checkbox";

interface ReviewFormProps {
  token: string;
  productId: string;
}

export function ReviewForm({ token, productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [anonym, setAnonym] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!content.trim()) {
      setError("Please enter your review");
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          rating,
          title,
          content,
          customerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Thank You for Your Review!</h2>
        <p className="mb-4">
          Your feedback helps other shoppers make better decisions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
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
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
              <span className="sr-only">{star} stars</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Review Title (Optional)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Your Review</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you like or dislike about this product?"
          rows={5}
          required
        />
      </div>
      <div>
        <Checkbox
          value={String(anonym)}
          onChange={() => {
            setAnonym(!anonym);
            setCustomerName("Anonym");
          }}
        />
      </div>

      {!anonym && (
        <div className="space-y-2">
          <Label htmlFor="customerName">Your Name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="How should we display your name?"
            required
          />
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
