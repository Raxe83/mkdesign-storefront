/**
 * Hilfsfunktionen für die Interaktion mit der Shopify Admin API
 */

/**
 * Registriert einen Webhook bei Shopify
 */
export async function registerWebhook(topic: string, address: string): Promise<boolean> {
    try {
      const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
      const adminApiKey = process.env.SHOPIFY_ADMIN_API_KEY
      const adminApiPassword = process.env.SHOPIFY_ADMIN_API_PASSWORD
  
      if (!shopDomain || !adminApiKey || !adminApiPassword) {
        return false
      }

      const response = await fetch(`https://${shopDomain}/admin/api/2023-07/webhooks.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${adminApiKey}:${adminApiPassword}`).toString("base64")}`,
        },
        body: JSON.stringify({
          webhook: {
            topic,
            address,
            format: "json",
          },
        }),
      })
  
      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }
  
  /**
   * Listet alle registrierten Webhooks auf
   */
  export async function listWebhooks(): Promise<any[]> {
    try {
      const shopDomain = process.env.SHOPIFY_DOMAIN
      const adminApiKey = process.env.SHOPIFY_ADMIN_API_KEY
      const adminApiPassword = process.env.SHOPIFY_ADMIN_API_PASSWORD
  
      if (!shopDomain || !adminApiKey || !adminApiPassword) {
        return []
      }
  
      const response = await fetch(`https://${shopDomain}/admin/api/2023-07/webhooks.json`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${adminApiKey}:${adminApiPassword}`).toString("base64")}`,
        },
      })
  
      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.webhooks
    } catch {
      return []
    }
  }
  
  /**
   * Löscht einen Webhook
   */
  export async function deleteWebhook(webhookId: string): Promise<boolean> {
    try {
      const shopDomain = process.env.SHOPIFY_DOMAIN
      const adminApiKey = process.env.SHOPIFY_ADMIN_API_KEY
      const adminApiPassword = process.env.SHOPIFY_ADMIN_API_PASSWORD
  
      if (!shopDomain || !adminApiKey || !adminApiPassword) {
        return false
      }

      const response = await fetch(`https://${shopDomain}/admin/api/2023-07/webhooks/${webhookId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(`${adminApiKey}:${adminApiPassword}`).toString("base64")}`,
        },
      })
  
      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }
  