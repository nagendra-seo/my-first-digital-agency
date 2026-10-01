import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Verifies a Cloudflare Turnstile token server-side — the frontend
 *  widget's own "success" state is never trusted on its own. */
export async function verifyTurnstileToken(token, remoteIp) {
  // Cloudflare's documented "always passes" test secret — lets local dev
  // work without real Turnstile keys.
  if (env.TURNSTILE_SECRET_KEY === "1x0000000000000000000000000000000AA") {
    return true;
  }

  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    logger.error("Turnstile verification request failed:", err.message);
    return false;
  }
}
