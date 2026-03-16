"use client"

import { Button } from "@/app/components/ui/next/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/next/ui/card"
import { Input } from "@/app/components/ui/next/ui/input"
import { Label } from "@/app/components/ui/next/ui/label"
import type React from "react"

import { useState } from "react"

export default function GenerateReviewLinkPage() {
  const [orderId, setOrderId] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [productId, setProductId] = useState("")
  const [productName, setProductName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; link?: string }>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(undefined)

    try {
      const response = await fetch("/api/send-review-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderNumber,
          productId,
          productName,
          customerEmail,
          customerName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate review link")
      }

      // For demo purposes, we'll construct the link here
      // In production, this would be sent via email
      const baseUrl = window.location.origin
      const token = data.token || "sample_token" // In a real app, the API would return the token
      const reviewLink = `${baseUrl}/review/${token}`
      console.log(token)
      setResult({
        success: true,
        message: "Review link generated successfully!",
        link: reviewLink,
      })
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : "An error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate Review Link</CardTitle>
          <CardDescription>Create a unique link for customers to leave product reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="gid://shopify/Order/1234567890"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="#1001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="gid://shopify/Product/1234567890"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate Review Link"}
            </Button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-md ${result.success ? "bg-green-50" : "bg-red-50"}`}>
              <p className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</p>
              {result.link && (
                <div className="mt-2">
                  <p className="font-semibold">Review Link:</p>
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all">
                    {result.link}
                  </a>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
