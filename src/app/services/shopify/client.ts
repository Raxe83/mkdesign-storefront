export const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
export const SHOPIFY_STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>({
  query,
  variables = {},
  locale,
  revalidate,
}: {
  query: string;
  variables?: Record<string, unknown>;
  locale?: string;
  /** Next.js ISR revalidation in seconds. Omit for no caching. */
  revalidate?: number | false;
}): Promise<T> {
  const variablesWithLocale = locale ? { ...variables, locale } : variables;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN as string,
  };

  if (locale) headers["Accept-Language"] = locale;

  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables: variablesWithLocale }),
      ...(revalidate !== undefined && { next: { revalidate } }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! Status: ${response.status}, Details: ${errorText}`,
    );
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(
      result.errors.map((e: { message: string }) => e.message).join("\n"),
    );
  }

  return result.data as T;
}
