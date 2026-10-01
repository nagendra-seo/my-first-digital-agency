import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    adminEmail: { type: String, default: null }, // denormalized for fast display, even if admin is later deleted
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    bookingReference: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ adminId: 1 });
auditLogSchema.index({ bookingId: 1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
