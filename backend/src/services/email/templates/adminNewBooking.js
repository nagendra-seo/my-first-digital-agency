import { emailLayout, detailTable, detailRow, button, escapeHtml } from "./layout.js";
import { formatBookingDate, formatBookingTime } from "../../../utils/format.js";

export function adminNewBookingEmail({
  name, email, phone, businessName, websiteUrl, message,
  bookingReference, preferredDate, preferredTime, dashboardUrl,
}) {
  const body = `
    <p>A new free-audit request just came in.</p>
    ${detailTable(
      detailRow("Name", escapeHtml(name)) +
        detailRow("Email", escapeHtml(email)) +
        detailRow("Phone", phone ? escapeHtml(phone) : "&mdash;") +
        detailRow("Business", escapeHtml(businessName)) +
        detailRow("Website", websiteUrl ? escapeHtml(websiteUrl) : "&mdash;") +
        detailRow("Requested date", formatBookingDate(preferredDate)) +
        detailRow("Requested time", `${formatBookingTime(preferredTime)} (IST)`) +
        detailRow("Reference", bookingReference)
    )}
    <p style="color:#4B5468;"><strong>What they'd like to improve:</strong><br/>${escapeHtml(message)}</p>
    <p>${button("Open in dashboard", dashboardUrl)}</p>
  `;
  return {
    subject: `New audit request: ${businessName} (${bookingReference})`,
    html: emailLayout({ previewText: `New request from ${name} at ${businessName}`, bodyHtml: body }),
  };
}
