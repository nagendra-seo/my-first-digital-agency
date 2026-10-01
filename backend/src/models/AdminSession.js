import mongoose from "mongoose";

// Server-side session record backing the httpOnly session cookie. The
// cookie only ever carries an opaque random token; this collection is the
// source of truth, which is what makes instant revocation possible (see
// the "active sessions" list + revoke feature in Settings).
const adminSessionSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true }, // sha256 of the raw token
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    twoFactorPassed: { type: Boolean, default: false },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Mongo TTL auto-cleanup
adminSessionSchema.index({ adminId: 1 });

export const AdminSession = mongoose.model("AdminSession", adminSessionSchema);
