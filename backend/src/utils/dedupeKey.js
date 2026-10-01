import { createHash } from "crypto";

/** Stable fingerprint so the same request can't accidentally create
 *  duplicate PENDING bookings via a double-click or resubmit. */
export function buildDedupeKey({ email, businessName, preferredDate, preferredTime }) {
  const raw = [email.trim().toLowerCase(), businessName.trim().toLowerCase(), preferredDate, preferredTime].join("|");
  return createHash("sha256").update(raw).digest("hex");
}
