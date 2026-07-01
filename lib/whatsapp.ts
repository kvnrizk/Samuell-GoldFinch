// ---------------------------------------------------------------------------
// WhatsApp Business API — Twilio REST integration
// Lightweight: uses fetch() directly instead of the Twilio SDK.
// ---------------------------------------------------------------------------

import { getEnv } from './env';

const TWILIO_ACCOUNT_SID = getEnv('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = getEnv('TWILIO_AUTH_TOKEN');
const TWILIO_WHATSAPP_FROM = getEnv('TWILIO_WHATSAPP_FROM'); // e.g. "whatsapp:+14155238886"

/**
 * Send a WhatsApp message via the Twilio REST API.
 *
 * @param to   - Recipient phone number. The "whatsapp:" prefix is added automatically if missing.
 * @param message - Plain-text message body (max 1600 chars for template-free messages).
 * @returns `true` on success, `false` on failure. Never throws.
 */
export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  // ---- Guard: missing env vars ----
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.warn(
      '[whatsapp] Missing Twilio env vars (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM). Skipping send.',
    );
    return false;
  }

  // ---- Normalise the "to" number ----
  const normalisedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  // ---- Build request ----
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

  const body = new URLSearchParams({
    From: TWILIO_WHATSAPP_FROM,
    To: normalisedTo,
    Body: message,
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[whatsapp] Twilio API error ${res.status}: ${errorBody}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[whatsapp] Failed to send WhatsApp message:', err);
    return false;
  }
}
