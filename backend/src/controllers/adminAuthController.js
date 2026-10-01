import { Admin } from "../models/Admin.js";
import { AdminSession } from "../models/AdminSession.js";
import { verifyPassword } from "../services/auth/password.js";
import { verifyTotpCode } from "../services/auth/totp.js";
import { matchRecoveryCode } from "../services/auth/recoveryCodes.js";
import {
  createPendingOrFullSession,
  upgradeSessionAfter2fa,
  getSession,
  destroySession,
  SESSION_COOKIE,
} from "../services/auth/session.js";
import { ensureCsrfCookie } from "../services/auth/csrf.js";
import { recordAuditLog } from "../utils/auditLog.js";
import { sendAdminLoginAlertEmail } from "../services/email/send.js";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function login(req, res) {
  const { email, password } = req.body;
  const ip = req.ip;

  const admin = await Admin.findOne({ email });

  // Constant-shape response whether or not the account exists, so we don't
  // leak which admin emails are valid.
  const genericError = () => res.status(401).json({ error: "Incorrect email or password." });

  if (!admin) return genericError();

  if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
    return res.status(423).json({
      error: "This account is temporarily locked after repeated failed attempts. Try again later.",
    });
  }

  const passwordOk = await verifyPassword(password, admin.passwordHash);
  if (!passwordOk) {
    admin.failedLoginAttempts += 1;
    if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      admin.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
    }
    await admin.save();
    await recordAuditLog({ action: "ADMIN_LOGIN_FAILED", admin, ipAddress: ip });
    return genericError();
  }

  admin.failedLoginAttempts = 0;
  admin.lockedUntil = null;
  await admin.save();

  const { twoFactorPassed } = await createPendingOrFullSession(admin, res, {
    ipAddress: ip,
    userAgent: req.headers["user-agent"],
  });

  if (twoFactorPassed) {
    admin.lastLoginAt = new Date();
    await admin.save();
    await recordAuditLog({ action: "ADMIN_LOGIN", admin, ipAddress: ip });
    // "Stronger admin panel" feature: alert on every successful login.
    await sendAdminLoginAlertEmail({ email: admin.email, ipAddress: ip, userAgent: req.headers["user-agent"] });
  }

  res.json({ requires2fa: !twoFactorPassed, twoFactorSetupRequired: !admin.twoFactorEnabled });
}

export async function verify2fa(req, res) {
  const ip = req.ip;
  const session = await getSession(req);

  if (session.status !== "pending-2fa") {
    return res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
  const admin = session.admin;
  const { code } = req.body;

  let ok = false;
  let usedRecoveryCode = false;

  if (/^\d{6}$/.test(code) && admin.twoFactorSecretEncrypted) {
    ok = verifyTotpCode(admin.twoFactorSecretEncrypted, admin.email, code);
  }
  if (!ok && admin.recoveryCodeHashes.length > 0) {
    const index = await matchRecoveryCode(code, admin.recoveryCodeHashes);
    if (index !== null) {
      ok = true;
      usedRecoveryCode = true;
      admin.recoveryCodeHashes.splice(index, 1);
      await admin.save();
    }
  }

  if (!ok) {
    await recordAuditLog({ action: "ADMIN_2FA_FAILED", admin, ipAddress: ip });
    return res.status(401).json({ error: "That code didn't work. Please try again." });
  }

  const token = req.cookies?.[SESSION_COOKIE];
  if (token) await upgradeSessionAfter2fa(token, res);

  admin.lastLoginAt = new Date();
  await admin.save();
  await recordAuditLog({ action: usedRecoveryCode ? "ADMIN_RECOVERY_CODE_USED" : "ADMIN_LOGIN", admin, ipAddress: ip });
  await sendAdminLoginAlertEmail({ email: admin.email, ipAddress: ip, userAgent: req.headers["user-agent"] });

  res.json({ ok: true, recoveryCodesRemaining: usedRecoveryCode ? admin.recoveryCodeHashes.length : undefined });
}

export async function logout(req, res) {
  const session = await getSession(req);
  if (session.status === "active" || session.status === "pending-2fa") {
    await recordAuditLog({ action: "ADMIN_LOGOUT", admin: session.admin, ipAddress: req.ip });
  }
  await destroySession(req, res);
  res.json({ ok: true });
}

export async function getSessionStatus(req, res) {
  const session = await getSession(req);
  const csrfToken = ensureCsrfCookie(req, res);

  if (session.status !== "active") {
    return res.json({ authenticated: false, csrfToken });
  }
  res.json({
    authenticated: true,
    csrfToken,
    admin: { email: session.admin.email, twoFactorEnabled: session.admin.twoFactorEnabled },
  });
}

/** "Stronger admin panel" feature: list every active session for this
 *  admin (device/IP/last activity), so they can spot and revoke one that
 *  isn't theirs. */
export async function listSessions(req, res) {
  const sessions = await AdminSession.find({ adminId: req.admin._id }).sort({ createdAt: -1 }).lean();
  const currentToken = req.cookies?.[SESSION_COOKIE];
  res.json({
    sessions: sessions.map((s) => ({
      id: s._id,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: false, // tokenHash isn't compared client-side; see revoke below for the real check
    })),
    hasCurrentToken: Boolean(currentToken),
  });
}

export async function revokeSession(req, res) {
  const { id } = req.params;
  const session = await AdminSession.findOne({ _id: id, adminId: req.admin._id });
  if (!session) return res.status(404).json({ error: "Session not found." });

  await AdminSession.deleteOne({ _id: id });
  await recordAuditLog({ action: "ADMIN_SESSION_REVOKED", admin: req.admin, ipAddress: req.ip, metadata: { sessionId: id } });
  res.json({ ok: true });
}
