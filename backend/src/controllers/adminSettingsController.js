import { Admin } from "../models/Admin.js";
import { TimeSlot } from "../models/TimeSlot.js";
import { generateTotpSecret, generateOtpAuthQrDataUrl, verifyTotpCode } from "../services/auth/totp.js";
import { generateRecoveryCodes } from "../services/auth/recoveryCodes.js";
import { recordAuditLog } from "../utils/auditLog.js";
import { BUSINESS_TIMEZONE } from "../utils/constants.js";
import { env } from "../config/env.js";

export async function getOverview(req, res) {
  const admin = req.admin;
  const timeSlots = await TimeSlot.find().sort({ sortOrder: 1 });

  res.json({
    email: admin.email,
    twoFactorEnabled: admin.twoFactorEnabled,
    recoveryCodesRemaining: admin.recoveryCodeHashes.length,
    lastLoginAt: admin.lastLoginAt,
    businessTimezone: BUSINESS_TIMEZONE,
    adminNotificationEmail: env.ADMIN_NOTIFICATION_EMAIL,
    timeSlots,
  });
}

export async function setup2fa(req, res) {
  const admin = req.admin;
  if (admin.twoFactorEnabled) {
    return res.status(409).json({ error: "Two-factor authentication is already enabled." });
  }

  const { base32, encrypted } = generateTotpSecret();
  admin.twoFactorSecretEncrypted = encrypted;
  await admin.save();

  const qrDataUrl = await generateOtpAuthQrDataUrl(base32, admin.email);
  res.json({ qrDataUrl, secret: base32 });
}

export async function verify2faSetup(req, res) {
  const admin = req.admin;
  if (admin.twoFactorEnabled) {
    return res.status(409).json({ error: "Two-factor authentication is already enabled." });
  }
  if (!admin.twoFactorSecretEncrypted) {
    return res.status(400).json({ error: "Start setup first." });
  }

  const ok = verifyTotpCode(admin.twoFactorSecretEncrypted, admin.email, req.body.code);
  if (!ok) {
    return res.status(400).json({ error: "That code didn't work. Please try again." });
  }

  const { plaintext, hashes } = await generateRecoveryCodes();
  admin.twoFactorEnabled = true;
  admin.recoveryCodeHashes = hashes;
  await admin.save();

  await recordAuditLog({ action: "ADMIN_2FA_ENABLED", admin, ipAddress: req.ip });
  res.json({ recoveryCodes: plaintext });
}

export async function toggleTimeSlot(req, res) {
  const slot = await TimeSlot.findById(req.params.id);
  if (!slot) return res.status(404).json({ error: "Time slot not found." });

  slot.isActive = !slot.isActive;
  await slot.save();
  res.json({ timeSlot: slot });
}
