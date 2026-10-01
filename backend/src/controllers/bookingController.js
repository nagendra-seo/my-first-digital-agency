import { Booking } from "../models/Booking.js";
import { verifyTurnstileToken } from "../services/turnstile.js";
import { generateBookingReference } from "../utils/bookingReference.js";
import { buildDedupeKey } from "../utils/dedupeKey.js";
import { recordAuditLog } from "../utils/auditLog.js";
import { sendBookingReceivedEmail, sendAdminNewBookingEmail } from "../services/email/send.js";

export async function createBooking(req, res) {
  const data = req.body; // already validated + typed by validateBody(createBookingSchema)
  const ip = req.ip;

  // Honeypot: a real visitor never sees or fills this field. Return a
  // success-shaped response so bots don't learn their submission was
  // rejected, without creating anything.
  if (data.website) {
    return res.status(201).json({ bookingReference: "MFA-0000-00000", status: "PENDING" });
  }

  const humanVerified = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!humanVerified) {
    return res.status(400).json({ error: "We couldn't verify you're human. Please try again." });
  }

  const preferredDate = new Date(`${data.preferredDate}T00:00:00.000Z`);
  const dedupeKey = buildDedupeKey({
    email: data.email,
    businessName: data.businessName,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
  });

  const existing = await Booking.findOne({ dedupeKey });
  if (existing) {
    // Same person, same business, same slot, submitted twice — treat as
    // idempotent rather than erroring.
    return res.status(200).json({
      bookingReference: existing.bookingReference,
      status: existing.status,
      preferredDate: data.preferredDate,
      preferredTime: existing.preferredTime,
    });
  }

  const bookingReference = await generateBookingReference();

  const booking = await Booking.create({
    bookingReference,
    name: data.name,
    email: data.email,
    businessName: data.businessName,
    websiteUrl: data.websiteUrl,
    phone: data.phone,
    message: data.message,
    preferredDate,
    preferredTime: data.preferredTime,
    dedupeKey,
  });

  await recordAuditLog({
    action: "BOOKING_CREATED",
    bookingId: booking._id,
    bookingReference: booking.bookingReference,
    ipAddress: ip,
    metadata: { businessName: booking.businessName },
  });

  // Best-effort notification emails — failures are logged on the booking
  // itself and never roll back the booking.
  await Promise.all([sendBookingReceivedEmail(booking), sendAdminNewBookingEmail(booking)]);

  res.status(201).json({
    bookingReference: booking.bookingReference,
    status: booking.status,
    preferredDate: data.preferredDate,
    preferredTime: booking.preferredTime,
  });
}
