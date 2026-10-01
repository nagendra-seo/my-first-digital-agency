import { emailLayout, detailTable, detailRow, escapeHtml } from "./layout.js";

/** "Stronger admin panel" feature: an email fires on every successful full
 *  login, so an admin notices immediately if it wasn't them. */
export function adminLoginAlertEmail({ email, ipAddress, userAgent, when }) {
  const body = `
    <p>A successful sign-in just happened on your admin account.</p>
    ${detailTable(
      detailRow("Account", escapeHtml(email)) +
        detailRow("Time", when) +
        detailRow("IP address", escapeHtml(ipAddress || "unknown")) +
        detailRow("Device / browser", escapeHtml(userAgent || "unknown"))
    )}
    <p>If this was you, no action is needed. If you don't recognize this sign-in, change your password immediately and review Active Sessions in Settings.</p>
  `;
  return {
    subject: "New sign-in to your My First Digital Agency admin account",
    html: emailLayout({ previewText: "New admin sign-in detected.", bodyHtml: body }),
  };
}
