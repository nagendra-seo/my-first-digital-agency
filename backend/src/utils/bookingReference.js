import { Booking } from "../models/Booking.js";

/** Generates a human-readable, non-guessable reference like MFA-2026-00124.
 *  Never derived from Mongo's internal _id, which is never exposed. */
export async function generateBookingReference(now = new Date()) {
  const year = now.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const countThisYear = await Booking.countDocuments({ createdAt: { $gte: start, $lt: end } });
  const sequence = String(countThisYear + 1).padStart(5, "0");
  return `MFA-${year}-${sequence}`;
}
