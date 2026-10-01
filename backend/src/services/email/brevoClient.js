import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

/** Sends one transactional email via Brevo's REST API. Returns true/false
 *  rather than throwing — callers decide how to record a failure (see
 *  services/email/send.js), and a failed email must never take down the
 *  request that triggered it. */
export async function sendViaBrevo({ to, subject, html }) {
  try {
    const res = await fetch(BREVO_SEND_URL, {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: env.BREVO_SENDER_NAME, email: env.BREVO_SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.error(`Brevo send failed (${res.status}):`, body);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("Brevo request threw:", err.message);
    return false;
  }
}
