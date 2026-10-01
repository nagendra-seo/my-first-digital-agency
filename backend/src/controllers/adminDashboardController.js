import { Booking } from "../models/Booking.js";
import { AuditLog } from "../models/AuditLog.js";

export async function getDashboardStats(req, res) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setUTCDate(endOfToday.getUTCDate() + 1);

  const [total, pending, confirmed, cancelled, completed, todaysRequests, upcomingConfirmed, recentBookings, recentActivity] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "PENDING" }),
      Booking.countDocuments({ status: "CONFIRMED" }),
      Booking.countDocuments({ status: "CANCELLED" }),
      Booking.countDocuments({ status: "COMPLETED" }),
      Booking.countDocuments({ createdAt: { $gte: startOfToday, $lt: endOfToday } }),
      Booking.find({ status: "CONFIRMED", preferredDate: { $gte: startOfToday } }).sort({ preferredDate: 1 }).limit(5),
      Booking.find().sort({ createdAt: -1 }).limit(6),
      AuditLog.find().sort({ createdAt: -1 }).limit(6),
    ]);

  res.json({
    counts: { total, pending, confirmed, cancelled, completed, todaysRequests, upcomingConfirmedCount: upcomingConfirmed.length },
    recentBookings,
    recentActivity,
  });
}
