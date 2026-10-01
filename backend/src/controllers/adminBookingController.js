import { Booking } from "../models/Booking.js";
import { AuditLog } from "../models/AuditLog.js";
import { recordAuditLog } from "../utils/auditLog.js";
import { formatBookingDate, formatBookingTime } from "../utils/format.js";
import {
  sendBookingConfirmedEmail,
  sendBookingCancelledEmail,
  sendBookingRescheduledEmail,
} from "../services/email/send.js";

function buildFilter({ search, status, dateFrom, dateTo }) {
  const filter = {};
  if (status && status !== "ALL") filter.status = status;
  if (search) {
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: re }, { email: re }, { businessName: re }, { bookingReference: re }];
  }
  if (dateFrom || dateTo) {
    filter.preferredDate = {};
    if (dateFrom) filter.preferredDate.$gte = new Date(`${dateFrom}T00:00:00.000Z`);
    if (dateTo) filter.preferredDate.$lte = new Date(`${dateTo}T23:59:59.999Z`);
  }
  return filter;
}

export async function listBookings(req, res) {
  const { search, status, dateFrom, dateTo, sort, page, pageSize } = req.query;
  const filter = buildFilter({ search, status, dateFrom, dateTo });

  const sortMap = { oldest: { createdAt: 1 }, appointment: { preferredDate: 1 }, newest: { createdAt: -1 } };
  const sortSpec = sortMap[sort] || sortMap.newest;

  const [items, total, statusCountsRaw] = await Promise.all([
    Booking.find(filter).sort(sortSpec).skip((page - 1) * pageSize).limit(pageSize),
    Booking.countDocuments(filter),
    Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const statusCounts = Object.fromEntries(statusCountsRaw.map((s) => [s._id, s.count]));
  res.json({ items, total, page, pageSize, statusCounts });
}

export async function getBooking(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });

  const auditLogs = await AuditLog.find({ bookingId: booking._id }).sort({ createdAt: -1 });
  res.json({ booking, auditLogs });
}

export async function confirmBooking(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  if (!["PENDING", "RESCHEDULED"].includes(booking.status)) {
    return res.status(409).json({ error: `Can't confirm a booking that is already ${booking.status.toLowerCase()}.` });
  }

  booking.status = "CONFIRMED";
  booking.confirmedAt = new Date();
  await booking.save();

  await recordAuditLog({ action: "BOOKING_CONFIRMED", admin: req.admin, bookingId: booking._id, bookingReference: booking.bookingReference, ipAddress: req.ip });
  await sendBookingConfirmedEmail(booking);

  res.json({ booking });
}

export async function cancelBooking(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  if (["CANCELLED", "COMPLETED"].includes(booking.status)) {
    return res.status(409).json({ error: `Can't cancel a booking that is already ${booking.status.toLowerCase()}.` });
  }

  const reason = req.body?.reason?.trim() || null;
  booking.status = "CANCELLED";
  booking.cancelledAt = new Date();
  booking.cancellationReason = reason;
  await booking.save();

  await recordAuditLog({ action: "BOOKING_CANCELLED", admin: req.admin, bookingId: booking._id, bookingReference: booking.bookingReference, ipAddress: req.ip, metadata: { reason } });
  await sendBookingCancelledEmail(booking);

  res.json({ booking });
}

export async function rescheduleBooking(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  if (["CANCELLED", "COMPLETED"].includes(booking.status)) {
    return res.status(409).json({ error: `Can't reschedule a booking that is already ${booking.status.toLowerCase()}.` });
  }

  const { preferredDate, preferredTime, note } = req.body;
  const previous = { date: booking.preferredDate, time: booking.preferredTime };

  booking.status = "RESCHEDULED";
  booking.preferredDate = new Date(`${preferredDate}T00:00:00.000Z`);
  booking.preferredTime = preferredTime;
  booking.rescheduledFromDate = previous.date;
  booking.rescheduledFromTime = previous.time;
  booking.rescheduleNote = note?.trim() || null;
  await booking.save();

  await recordAuditLog({
    action: "BOOKING_RESCHEDULED", admin: req.admin, bookingId: booking._id, bookingReference: booking.bookingReference, ipAddress: req.ip,
    metadata: { from: previous, to: { date: preferredDate, time: preferredTime } },
  });
  await sendBookingRescheduledEmail(booking, previous);

  res.json({ booking });
}

export async function completeBooking(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  if (booking.status !== "CONFIRMED") {
    return res.status(409).json({ error: "Only a confirmed audit can be marked completed." });
  }

  booking.status = "COMPLETED";
  booking.completedAt = new Date();
  await booking.save();

  // No client email is sent for this transition, by design.
  await recordAuditLog({ action: "BOOKING_COMPLETED", admin: req.admin, bookingId: booking._id, bookingReference: booking.bookingReference, ipAddress: req.ip });

  res.json({ booking });
}

export async function updateNotes(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });

  booking.adminNotes = req.body.adminNotes;
  await booking.save();

  await recordAuditLog({ action: "BOOKING_NOTES_UPDATED", admin: req.admin, bookingId: booking._id, bookingReference: booking.bookingReference, ipAddress: req.ip });
  res.json({ booking });
}

function csvCell(value) {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function exportBookings(req, res) {
  const { search, status, dateFrom, dateTo, sort } = req.query;
  const filter = buildFilter({ search, status, dateFrom, dateTo });
  const sortMap = { oldest: { createdAt: 1 }, appointment: { preferredDate: 1 }, newest: { createdAt: -1 } };

  const bookings = await Booking.find(filter).sort(sortMap[sort] || sortMap.newest).limit(5000);

  const header = ["Booking Reference", "Status", "Name", "Email", "Phone", "Business", "Website", "Requested Date", "Requested Time", "Message", "Admin Notes", "Cancellation Reason", "Created At"];
  const rows = bookings.map((b) =>
    [
      b.bookingReference, b.status, b.name, b.email, b.phone || "", b.businessName, b.websiteUrl || "",
      formatBookingDate(b.preferredDate), formatBookingTime(b.preferredTime), b.message,
      b.adminNotes || "", b.cancellationReason || "", b.createdAt.toISOString(),
    ].map(csvCell).join(",")
  );
  const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");

  await recordAuditLog({ action: "BOOKINGS_EXPORTED", admin: req.admin, ipAddress: req.ip, metadata: { count: bookings.length } });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="bookings-export-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
}
