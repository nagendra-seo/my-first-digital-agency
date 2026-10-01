import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    twoFactorEnabled: { type: Boolean, default: false },
    // AES-256-GCM encrypted TOTP secret — never stored in plaintext.
    twoFactorSecretEncrypted: { type: String, default: null },
    // bcrypt hashes of one-time recovery codes.
    recoveryCodeHashes: { type: [String], default: [] },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
