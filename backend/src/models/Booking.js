import mongoose from "mongoose";

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "RESCHEDULED", "COMPLETED"];

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, required: true, unique: true }, // e.g. MFA-2026-00124

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    businessName: { type: String, required: true, trim: true },
    websiteUrl: { type: String, default: null },
    phone: { type: String, default: null },
    message: { type: String, required: true },

    preferredDate: { type: Date, required: true }, // UTC midnight of the IST calendar date
    preferredTime: { type: String, required: true }, // "14:00"
    timezone: { type: String, default: "Asia/Kolkata" },

    status: { type: String, enum: STATUSES, default: "PENDING" },

    rescheduledFromDate: { type: Date, default: null },
    rescheduledFromTime: { type: String, default: null },
    rescheduleNote: { type: String, default: null },

    adminNotes: { type: String, default: "" },
    cancellationReason: { type: String, default: null },

    // Fingerprint of (email + businessName + date + time) — blocks accidental
    // duplicate submissions from a double-click or resubmit.
    dedupeKey: { type: String, required: true, unique: true },

    confirmedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },

    clientEmailSentAt: { type: Date, default: null },
    clientEmailFailedAt: { type: Date, default: null },
    adminNotifiedAt: { type: Date, default: null },
    adminNotifyFailedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1 });
bookingSchema.index({ preferredDate: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ name: "text", email: "text", businessName: "text", bookingReference: "text" });

export const BOOKING_STATUSES = STATUSES;
export const Booking = mongoose.model("Booking", bookingSchema);
