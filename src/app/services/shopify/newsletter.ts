// Server-side only — uses Shopify Admin API (requires SHOPIFY_ADMIN_ACCESS_TOKEN)

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const BASE = () => {
  if (!DOMAIN || !ADMIN_TOKEN) {
    throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN oder NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN fehlt in .env.local");
  }
  return `https://${DOMAIN}/admin/api/2024-10`;
};

export interface NewsletterResult {
  success: boolean;
  alreadySubscribed?: boolean;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  const base = BASE();
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": ADMIN_TOKEN as string,
  };

  // 1. Try to create new customer with newsletter opt-in
  const createRes = await fetch(`${base}/customers.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer: {
        email,
        email_marketing_consent: {
          state: "subscribed",
          opt_in_level: "single_opt_in",
        },
      },
    }),
    cache: "no-store",
  });

  if (createRes.ok) return { success: true };

  // 2. Customer already exists (422) — search and update marketing consent
  if (createRes.status === 422) {
    const searchRes = await fetch(
      `${base}/customers/search.json?query=email:${encodeURIComponent(email)}&fields=id,email,email_marketing_consent`,
      { headers: { "X-Shopify-Access-Token": ADMIN_TOKEN as string }, cache: "no-store" },
    );

    if (!searchRes.ok) return { success: false };

    const { customers } = await searchRes.json();
    const customer = customers?.[0];
    if (!customer) return { success: false };

    if (customer.email_marketing_consent?.state === "subscribed") {
      return { success: true, alreadySubscribed: true };
    }

    const updateRes = await fetch(`${base}/customers/${customer.id}.json`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        customer: {
          id: customer.id,
          email_marketing_consent: { state: "subscribed", opt_in_level: "single_opt_in" },
        },
      }),
      cache: "no-store",
    });

    return { success: updateRes.ok, alreadySubscribed: false };
  }

  return { success: false };
}
