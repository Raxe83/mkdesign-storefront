'use server'

import { Resend } from 'resend';

export type ContactFormState = {
  success: boolean;
  error?: string;
};

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const subject = (formData.get('subject') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, error: 'Bitte fülle alle Pflichtfelder aus.' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Contact] RESEND_API_KEY not configured');
    return { success: false, error: 'E-Mail-Dienst nicht konfiguriert. Bitte kontaktiere uns direkt.' };
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: 'M.K. Design <noreply@mkdesignweb.de>',
      to: 'MKDesignbyMarkusKlement@web.de',
      replyTo: email,
      subject: subject ? `[Anfrage] ${subject}` : `Neue Kontaktanfrage von ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
    });

    return { success: true };
  } catch (err) {
    console.error('[Contact] Resend error:', err);
    return { success: false, error: 'Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.' };
  }
}
