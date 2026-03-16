import { notFound } from "next/navigation";
import Image from "next/image";
import { validateReviewToken } from "@/app/lib/review-utils";
import { getProductByHandle } from "@/app/services/shopify";
import { ReviewForm } from "@/app/components/review-form";

// Typ für die asynchronen Props
type Props = {
  params: Promise<{ token: string }>;
};

const ReviewPage = async ({ params }: Props) => {
  const { token } = await params;

  const review = await validateReviewToken(token);

  if (!review) {
    notFound();
  }

  if (review.isVerified) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Thank You!</h1>
        <p className="text-lg">
          You have already submitted a review for this product. Thank you for
          your feedback!
        </p>
      </div>
    );
  }

  const product = await getProductByHandle(review.productId);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Write Your Review</h1>

      {product && (
        <div className="mb-8 flex items-center gap-4 p-4 border rounded-lg">
          {product.images && (
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image
                src={product.images?.edges[0].node.url || "/placeholder.svg"}
                alt={product.images?.edges[0].node.altText || product.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <div>
            <h2 className="font-semibold">{product.title}</h2>
            <p className="text-sm text-gray-500">
              {product.variants.edges[0]?.node.price.amount}{" "}
              {product.variants.edges[0]?.node.price.currencyCode}
            </p>
          </div>
        </div>
      )}

      <ReviewForm token={token} productId={"gid://shopify/Product/" + review.productId} />
    </div>
  );
};

export default ReviewPage;
