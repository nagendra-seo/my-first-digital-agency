import { emailLayout, detailTable, detailRow, escapeHtml } from "./layout.js";
import { formatBookingDate, formatBookingTime } from "../../../utils/format.js";

export function bookingConfirmedEmail({ name, businessName, bookingReference, preferredDate, preferredTime }) {
  const body = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Good news — your free audit for <strong>${escapeHtml(businessName)}</strong> is confirmed.</p>
    ${detailTable(
      detailRow("Date", formatBookingDate(preferredDate)) +
        detailRow("Time", `${formatBookingTime(preferredTime)} (IST)`) +
        detailRow("Reference", bookingReference) +
        detailRow("Status", "Confirmed")
    )}
    <p>We'll call you at the scheduled time. If anything comes up beforehand, just reply to this email and we'll sort out a new time.</p>
    <p>Looking forward to it,<br/>My First Digital Agency</p>
  `;
  return {
    subject: "Your Free Audit is Confirmed - My FirstDIGITAL AGENCY",
    html: emailLayout({ previewText: `Your audit is confirmed for ${formatBookingDate(preferredDate)}.`, bodyHtml: body }),
  };
}
