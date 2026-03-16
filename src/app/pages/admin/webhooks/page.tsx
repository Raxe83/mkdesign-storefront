"use client"

import { useState, useEffect } from "react"
import { Trash2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/next/ui/card"
import { Label } from "@/app/components/ui/next/ui/label"
import { Input } from "@/app/components/ui/next/ui/input"
import { Button } from "@/app/components/ui/next/ui/button"

interface Webhook {
  id: string
  address: string
  topic: string
  created_at: string
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  // Setze die Standard-Webhook-URL basierend auf der aktuellen Domain
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin
      setWebhookUrl(`${baseUrl}/api/webhooks/shopify/order-created`)
    }
  }, [])

  // Lade die Webhooks beim ersten Rendern
  useEffect(() => {
    fetchWebhooks()
  }, [])

  // Funktion zum Abrufen der Webhooks
  const fetchWebhooks = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/webhooks")

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Webhooks")
      }

      const data = await response.json()
      setWebhooks(data.webhooks || [])
    } catch (err) {
      setError("Fehler beim Laden der Webhooks. Bitte versuche es später erneut.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Funktion zum Registrieren eines neuen Webhooks
  const registerWebhook = async () => {
    setIsRegistering(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/webhooks/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: "orders/create",
          address: webhookUrl,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Fehler beim Registrieren des Webhooks")
      }

      setSuccess("Webhook erfolgreich registriert!")
      fetchWebhooks() // Aktualisiere die Liste der Webhooks
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsRegistering(false)
    }
  }

  // Funktion zum Löschen eines Webhooks
  const deleteWebhook = async (webhookId: string) => {
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/admin/webhooks/${webhookId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Fehler beim Löschen des Webhooks")
      }

      setSuccess("Webhook erfolgreich gelöscht!")
      setWebhooks(webhooks.filter((webhook) => webhook.id !== webhookId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Shopify Webhooks verwalten</h1>

      <div className="space-y-8">
        {/* Webhook-Registrierung */}
        <Card>
          <CardHeader>
            <CardTitle>Neuen Webhook registrieren</CardTitle>
            <CardDescription>
              Registriere einen Webhook, der bei neuen Bestellungen automatisch Review-Links generiert und versendet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook-URL</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://deine-domain.de/api/webhooks/shopify/order-created"
                />
                <p className="text-sm text-gray-500">
                  Dies ist die URL, die Shopify aufrufen wird, wenn eine neue Bestellung eingeht.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={registerWebhook} disabled={isRegistering}>
              {isRegistering ? "Wird registriert..." : "Webhook registrieren"}
            </Button>
          </CardFooter>
        </Card>

        {/* Liste der Webhooks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Registrierte Webhooks</CardTitle>
              <Button variant="outline" size="icon" onClick={fetchWebhooks} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <CardDescription>Hier siehst du alle bei Shopify registrierten Webhooks.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Webhooks werden geladen...</div>
            ) : webhooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Keine Webhooks registriert</div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{webhook.topic}</p>
                      <p className="text-sm text-gray-500">{webhook.address}</p>
                      <p className="text-xs text-gray-400">
                        Erstellt am: {new Date(webhook.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteWebhook(webhook.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
