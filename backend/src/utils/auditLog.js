import { AuditLog } from "../models/AuditLog.js";
import { logger } from "./logger.js";

/** Records one row per sensitive action. Never breaks the action it's
 *  describing if logging itself fails. */
export async function recordAuditLog({ action, admin, bookingId, bookingReference, metadata, ipAddress }) {
  try {
    await AuditLog.create({
      action,
      adminId: admin?._id ?? null,
      adminEmail: admin?.email ?? null,
      bookingId: bookingId ?? null,
      bookingReference: bookingReference ?? null,
      metadata: metadata ?? null,
      ipAddress: ipAddress ?? null,
    });
  } catch (err) {
    logger.error("Failed to write audit log entry:", err.message);
  }
}
