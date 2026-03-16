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
        console.error("Fehlende Shopify-Admin-Anmeldedaten")
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
        const errorData = await response.json()
        console.error("Fehler beim Registrieren des Webhooks:", errorData)
        return false
      }
  
      const data = await response.json()
      console.log("Webhook erfolgreich registriert:", data.webhook.id)
      return true
    } catch (error) {
      console.error("Fehler beim Registrieren des Webhooks:", error)
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
        console.error("Fehlende Shopify-Admin-Anmeldedaten")
        return []
      }
  
      const response = await fetch(`https://${shopDomain}/admin/api/2023-07/webhooks.json`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${adminApiKey}:${adminApiPassword}`).toString("base64")}`,
        },
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Fehler beim Abrufen der Webhooks:", errorData)
        return []
      }
  
      const data = await response.json()
      return data.webhooks
    } catch (error) {
      console.error("Fehler beim Abrufen der Webhooks:", error)
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
        console.error("Fehlende Shopify-Admin-Anmeldedaten")
        return false
      }
  
      const response = await fetch(`https://${shopDomain}/admin/api/2023-07/webhooks/${webhookId}.json`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(`${adminApiKey}:${adminApiPassword}`).toString("base64")}`,
        },
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Fehler beim Löschen des Webhooks:", errorText)
        return false
      }
  
      return true
    } catch (error) {
      console.error("Fehler beim Löschen des Webhooks:", error)
      return false
    }
  }
  