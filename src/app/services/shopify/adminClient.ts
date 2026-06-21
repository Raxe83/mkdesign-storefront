/**
 * Shopify Admin GraphQL Client.
 * Nutzt den permanenten OAuth-Token aus SHOPIFY_ADMIN_ACCESS_TOKEN.
 */

const ADMIN_API_URL = `https://${process.env.SHOPIFY_ADMIN_DOMAIN}/admin/api/2024-10/graphql.json`;

export async function adminFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options?: { noCache?: boolean },
): Promise<T> {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!token) {
    throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN fehlt in .env.local");
  }

  const res = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type":           "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(options?.noCache
      ? { cache: "no-store" as const }
      : { next: { revalidate: 3600 } }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Admin API HTTP-Fehler (${res.status}): ${body}`);
  }

  const result = await res.json();

  if (result.errors?.length) {
    throw new Error(
      result.errors.map((e: { message: string }) => e.message).join("\n"),
    );
  }

  return result.data as T;
}
