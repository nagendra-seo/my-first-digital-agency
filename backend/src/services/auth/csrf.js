import { randomToken } from "./crypto.js";
import { env } from "../../config/env.js";

// Double-submit-cookie CSRF protection for admin mutations. The session
// cookie is already SameSite=Lax + httpOnly (blocking classic cross-site
// form-post CSRF); this token is defense-in-depth on top of that.
export const CSRF_COOKIE = "mfa_csrf";
const isProd = env.NODE_ENV === "production";

export function ensureCsrfCookie(req, res) {
  const existing = req.cookies?.[CSRF_COOKIE];
  if (existing) return existing;
  const token = randomToken(24);
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false, // must be readable by frontend JS to echo back as a header
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60 * 1000,
  });
  return token;
}

export function verifyCsrf(req) {
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers["x-csrf-token"];
  return Boolean(cookieToken) && Boolean(headerToken) && cookieToken === headerToken;
}
