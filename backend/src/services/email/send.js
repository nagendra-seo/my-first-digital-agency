import { sendViaBrevo } from "./brevoClient.js";
import { env } from "../../config/env.js";
import { Booking } from "../../models/Booking.js";
import { recordAuditLog } from "../../utils/auditLog.js";
import { bookingReceivedEmail } from "./templates/bookingReceived.js";
import { adminNewBookingEmail } from "./templates/adminNewBooking.js";
import { bookingConfirmedEmail } from "./templates/bookingConfirmed.js";
import { bookingCancelledEmail } from "./templates/bookingCancelled.js";
import { bookingRescheduledEmail } from "./templates/bookingRescheduled.js";
import { adminLoginAlertEmail } from "./templates/adminLoginAlert.js";

// A booking that already exists in the database is NEVER deleted or hidden
// just because Brevo hiccups. On failure we log it and stamp a "*FailedAt"
// field the admin dashboard can surface — the lead is never lost.

export async function sendBookingReceivedEmail(booking) {
  const { subject, html } = bookingReceivedEmail(booking);
  const ok = await sendViaBrevo({ to: booking.email, subject, html });
  await Booking.updateOne(
    { _id: booking._id },
    ok ? { clientEmailSentAt: new Date() } : { clientEmailFailedAt: new Date() }
  );
  if (!ok) {
    await recordAuditLog({ action: "BOOKING_EMAIL_FAILED", bookingId: booking._id, bookingReference: booking.bookingReference, metadata: { template: "booking-received" } });
  }
}

export async function sendAdminNewBookingEmail(booking) {
  const { subject, html } = adminNewBookingEmail({
    ...booking.toObject(),
    dashboardUrl: `${env.FRONTEND_URL}/admin/bookings/${booking._id}`,
  });
  const ok = await sendViaBrevo({ to: env.ADMIN_NOTIFICATION_EMAIL, subject, html });
  await Booking.updateOne(
    { _id: booking._id },
    ok ? { adminNotifiedAt: new Date() } : { adminNotifyFailedAt: new Date() }
  );
  if (!ok) {
    await recordAuditLog({ action: "BOOKING_EMAIL_FAILED", bookingId: booking._id, bookingReference: booking.bookingReference, metadata: { template: "admin-new-booking" } });
  }
}

export async function sendBookingConfirmedEmail(booking) {
  const { subject, html } = bookingConfirmedEmail(booking);
  const ok = await sendViaBrevo({ to: booking.email, subject, html });
  if (!ok) {
    await recordAuditLog({ action: "BOOKING_EMAIL_FAILED", bookingId: booking._id, bookingReference: booking.bookingReference, metadata: { template: "booking-confirmed" } });
  }
}

export async function sendBookingCancelledEmail(booking) {
  const { subject, html } = bookingCancelledEmail({ ...booking.toObject(), reason: booking.cancellationReason });
  const ok = await sendViaBrevo({ to: booking.email, subject, html });
  if (!ok) {
    await recordAuditLog({ action: "BOOKING_EMAIL_FAILED", bookingId: booking._id, bookingReference: booking.bookingReference, metadata: { template: "booking-cancelled" } });
  }
}

export async function sendBookingRescheduledEmail(booking, previous) {
  const { subject, html } = bookingRescheduledEmail({
    ...booking.toObject(),
    previousDate: previous.date,
    previousTime: previous.time,
    newDate: booking.preferredDate,
    newTime: booking.preferredTime,
    note: booking.rescheduleNote,
  });
  const ok = await sendViaBrevo({ to: booking.email, subject, html });
  if (!ok) {
    await recordAuditLog({ action: "BOOKING_EMAIL_FAILED", bookingId: booking._id, bookingReference: booking.bookingReference, metadata: { template: "booking-rescheduled" } });
  }
}

export async function sendAdminLoginAlertEmail({ email, ipAddress, userAgent }) {
  const { subject, html } = adminLoginAlertEmail({
    email,
    ipAddress,
    userAgent,
    when: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }),
  });
  // Best-effort — a failed security alert should never block a legitimate login.
  await sendViaBrevo({ to: env.ADMIN_NOTIFICATION_EMAIL, subject, html });
}
