import { getSession } from "../services/auth/session.js";
import { verifyCsrf } from "../services/auth/csrf.js";

/** Guards every admin route: requires a fully authenticated (2FA-passed)
 *  session, and — for anything other than GET — a matching CSRF token.
 *  Attaches req.admin and req.session for downstream handlers. */
export function requireAdmin({ requireCsrf = true } = {}) {
  return async (req, res, next) => {
    const session = await getSession(req);
    if (session.status !== "active") {
      return res.status(401).json({ error: "Please log in again." });
    }
    if (requireCsrf && req.method !== "GET" && !verifyCsrf(req)) {
      return res.status(403).json({ error: "Your session looks out of date — please refresh and try again." });
    }
    req.admin = session.admin;
    req.session = session.session;
    next();
  };
}
