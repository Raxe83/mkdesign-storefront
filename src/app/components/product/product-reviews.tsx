"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/next/ui/avatar";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  customerName: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  short?: boolean;
}

export function ProductReviews({ productId, short }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate average rating
  const averageRating =
  reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/reviews?productId=${productId.split("/").pop()}`
        );
        const data = await response.json();

        if (!response.ok) {
          // Treat unavailable reviews API as empty (DB may not be configured)
          setReviews([]);
          setLoading(false);
          return;
        }

        setReviews(data.reviews ?? []);
      } catch {
        // Silently treat fetch errors as empty reviews
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div className="py-8 text-center">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    if (short) {
      return (
        <div className="flex flex-row gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 my-auto">
            No reviews yet for this product.
          </span>
        </div>
      );
    } else {
      return (
        <div className="py-8 text-center">No reviews yet for this product.</div>
      );
    }
  }

  if (short) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= Math.round(averageRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {averageRating.toFixed(1)} out of 5 ({reviews.length}{" "}
          {reviews.length === 1 ? "review" : "reviews"})
        </span>
      </div>
    );
  } else {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {averageRating.toFixed(1)} out of 5 ({reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-8">
              <div className="flex items-center gap-4 mb-2">
                {/* <Avatar>
                  <AvatarFallback>
                    {review.customerName.charAt(0)}
                  </AvatarFallback>
                </Avatar> */}
                <div>
                  <p className="font-medium">{review.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <h4 className="font-medium mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-4">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
