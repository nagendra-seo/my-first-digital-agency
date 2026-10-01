import { AdminSession } from "../../models/AdminSession.js";
import { randomToken, sha256Hex } from "./crypto.js";
import { env } from "../../config/env.js";

export const SESSION_COOKIE = "mfa_admin_session";
const PENDING_SESSION_MINUTES = 10;
const FULL_SESSION_HOURS = 12;
const isProd = env.NODE_ENV === "production";

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeMs,
  };
}

/** Creates the first-stage session immediately after a correct password.
 *  twoFactorPassed starts true only for an account that hasn't finished
 *  2FA setup yet (so it can reach the forced setup screen); otherwise the
 *  session stays "pending" until the TOTP/recovery code is verified. */
export async function createPendingOrFullSession(admin, res, meta) {
  const token = randomToken();
  const tokenHash = sha256Hex(token);
  const twoFactorPassed = !admin.twoFactorEnabled;
  const ms = (twoFactorPassed ? FULL_SESSION_HOURS * 60 : PENDING_SESSION_MINUTES) * 60_000;

  await AdminSession.create({
    tokenHash,
    adminId: admin._id,
    twoFactorPassed,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    expiresAt: new Date(Date.now() + ms),
  });

  res.cookie(SESSION_COOKIE, token, cookieOptions(ms));
  return { twoFactorPassed };
}

export async function upgradeSessionAfter2fa(token, res) {
  const tokenHash = sha256Hex(token);
  const ms = FULL_SESSION_HOURS * 60 * 60_000;
  await AdminSession.updateOne({ tokenHash }, { twoFactorPassed: true, expiresAt: new Date(Date.now() + ms) });
  res.cookie(SESSION_COOKIE, token, cookieOptions(ms));
}

/** Reads and validates the session cookie against the database — the
 *  single source of truth for "is this request authenticated." */
export async function getSession(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return { status: "none" };

  const tokenHash = sha256Hex(token);
  const session = await AdminSession.findOne({ tokenHash }).populate("adminId");
  if (!session) return { status: "none" };

  if (session.expiresAt.getTime() < Date.now()) {
    await AdminSession.deleteOne({ _id: session._id });
    return { status: "expired" };
  }

  const admin = session.adminId; // populated document
  return session.twoFactorPassed
    ? { status: "active", admin, session }
    : { status: "pending-2fa", admin, session };
}

export async function destroySession(req, res) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    await AdminSession.deleteOne({ tokenHash: sha256Hex(token) });
  }
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}
