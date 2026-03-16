import { Resend } from "resend"
import { generateReviewLink } from "./review-utils"

// Initialisiere Resend mit deinem API-Key
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Sendet eine E-Mail mit einem Review-Link an einen Kunden
 */
export async function sendReviewInvitationEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  productName: string,
  reviewToken: string,
) {
  const reviewLink = generateReviewLink(reviewToken)

  try {
    const { data, error } = await resend.emails.send({
      from: `Johnny Case <${process.env.EMAIL_FROM || "noreply@example.com"}>`,
      to: customerEmail,
      subject: `Bewerte deinen Einkauf: ${productName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hallo ${customerName},</h2>
          
          <p>Vielen Dank für deinen Einkauf (Bestellnummer: ${orderNumber}).</p>
          
          <p>Wir würden uns sehr über deine Meinung zu <strong>${productName}</strong> freuen.</p>
          <p> Hinterlasse uns doch gerne eine Bewertung, sobald du dein Produkt erhalten hast. </p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${reviewLink}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Produkt bewerten
            </a>
          </div>
          
          <p>Dein Feedback hilft uns, unsere Produkte zu verbessern und anderen Kunden bei ihrer Kaufentscheidung.</p>
          
          <p>Vielen Dank,<br>Dein Johnny Case Team</p>
        </div>
      `,
    })

    if (error) {
      console.error("Fehler beim Senden der E-Mail:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error)
    return false
  }
}

/**
 * Sendet eine Bestellbestätigung mit einem Review-Link
 */
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  orderItems: {
    productId: string
    productName: string
    price: string
    quantity: number
    reviewToken: string
  }[],
  totalAmount: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Shop <${process.env.EMAIL_FROM || "noreply@example.com"}>`,
      to: customerEmail,
      subject: `Bestellbestätigung #${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hallo ${customerName},</h2>
          
          <p>Vielen Dank für deine Bestellung. Hier ist eine Zusammenfassung:</p>
          
          <div style="margin: 20px 0; border: 1px solid #eee; border-radius: 5px; padding: 15px;">
            <h3 style="margin-top: 0;">Bestellnummer: ${orderNumber}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <th style="text-align: left; padding: 10px 5px;">Produkt</th>
                <th style="text-align: right; padding: 10px 5px;">Preis</th>
                <th style="text-align: right; padding: 10px 5px;">Menge</th>
                <th style="text-align: right; padding: 10px 5px;">Gesamt</th>
              </tr>
              ${orderItems
                .map(
                  (item) => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 5px;">${item.productName}</td>
                  <td style="text-align: right; padding: 10px 5px;">${item.price}</td>
                  <td style="text-align: right; padding: 10px 5px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 10px 5px;">${Number.parseFloat(item.price) * item.quantity} €</td>
                </tr>
              `,
                )
                .join("")}
              <tr>
                <td colspan="3" style="text-align: right; padding: 10px 5px; font-weight: bold;">Gesamtsumme:</td>
                <td style="text-align: right; padding: 10px 5px; font-weight: bold;">${totalAmount}</td>
              </tr>
            </table>
          </div>
          
          <p>Sobald deine Bestellung versendet wurde, erhältst du eine weitere E-Mail mit den Versandinformationen.</p>
          
          <h3 style="margin-top: 30px;">Bewerte deine Produkte</h3>
          <p>Wir würden uns über dein Feedback zu deinen gekauften Produkten freuen:</p>
          
          <ul style="padding-left: 20px;">
            ${orderItems
              .map(
                (item) => `
              <li style="margin-bottom: 10px;">
                <a href="${generateReviewLink(item.reviewToken)}" style="color: #000; text-decoration: underline;">
                  ${item.productName} bewerten
                </a>
              </li>
            `,
              )
              .join("")}
          </ul>
          
          <p>Vielen Dank für deinen Einkauf!<br>Dein Shop-Team</p>
        </div>
      `,
    })

    if (error) {
      console.error("Fehler beim Senden der Bestellbestätigung:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Fehler beim Senden der Bestellbestätigung:", error)
    return false
  }
}
