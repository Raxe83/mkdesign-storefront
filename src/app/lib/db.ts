import { neon } from "@neondatabase/serverless";

// Create a SQL client
export const sql = neon(process.env.DATABASE_URL!);

// Utility-Funktion zum sicheren Abrufen von Rows
async function fetchRows<T>(query: any): Promise<T[]> {
  const result = await query;

  if (Array.isArray(result)) {
    return result as T[]; // Neon gibt direkt Array zurück
  }

  if (result?.rows) {
    return result.rows as T[];
  }

  throw new Error("Unexpected SQL result shape");
}

// Review type definition
export interface Review {
  id: string;
  productId: string;
  orderId: string;
  rating: number;
  title: string | null;
  content: string;
  customerName: string;
  customerEmail: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}

// Funktion: Alle verifizierten Reviews zu einem Produkt
export async function getReviewsByProductId(
  productId: string
): Promise<Review[]> {
  return await fetchRows<Review>(sql`
    SELECT * FROM "Review"
    WHERE "productId" = ${productId}
    AND "isVerified" = true
    ORDER BY "createdAt" DESC
  `);
}

// Funktion: Einzelne Review über Token holen
export async function getReviewByToken(token: string): Promise<Review | null> {
  const reviews = await fetchRows<Review>(sql`
    SELECT * FROM "Review"
    WHERE "token" = ${token}
  `);

  return reviews.length > 0 ? reviews[0] : null;
}

// Funktion: Platzhalter-Review anlegen
export async function createReviewPlaceholder(
  productId: string,
  orderId: string,
  customerEmail: string,
  token: string
): Promise<string> {
  const result = await fetchRows<{ id: string }>(sql`
    INSERT INTO "Review" (
      "id",
      "productId",
      "orderId",
      "rating",
      "content",
      "customerName",
      "customerEmail",
      "isVerified",
      "token",
      "updatedAt"
    )
    VALUES (
      ${"rev_" + Math.random().toString(36).substring(2, 15)},
      ${productId},
      ${orderId},
      0,
      '',
      '',
      ${customerEmail},
      false,
      ${token},
      CURRENT_TIMESTAMP
    )
    RETURNING "id"
  `);

  if (!result || result.length === 0) {
    throw new Error("Failed to create review placeholder");
  }

  return result[0].id;
}

// Funktion: Review abschicken
export async function submitReview(
  token: string,
  rating: number,
  title: string | null,
  content: string,
  customerName: string
): Promise<boolean> {
  const result = await fetchRows<{ id: string }>(sql`
    UPDATE "Review"
    SET
      "rating" = ${rating},
      "title" = ${title},
      "content" = ${content},
      "customerName" = ${customerName},
      "isVerified" = true,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE "token" = ${token}
    AND "isVerified" = false
    RETURNING "id"
  `);

  return result.length > 0;
}
