import { emailLayout, detailTable, detailRow, escapeHtml } from "./layout.js";
import { formatBookingDate, formatBookingTime } from "../../../utils/format.js";

export function bookingRescheduledEmail({
  name, businessName, bookingReference, previousDate, previousTime, newDate, newTime, note,
}) {
  const body = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>We need to move your free audit for <strong>${escapeHtml(businessName)}</strong> to a new time.</p>
    ${detailTable(
      detailRow("Previous time", `${formatBookingDate(previousDate)}, ${formatBookingTime(previousTime)} (IST)`) +
        detailRow("New time", `${formatBookingDate(newDate)}, ${formatBookingTime(newTime)} (IST)`) +
        detailRow("Reference", bookingReference) +
        detailRow("Status", "Rescheduled")
    )}
    ${note ? `<p style="color:#4B5468;"><strong>Note from our team:</strong><br/>${escapeHtml(note)}</p>` : ""}
    <p>Sorry for the shuffle — if the new time doesn't work, just reply to this email and we'll find one that does.</p>
    <p>Thanks for your flexibility,<br/>My First Digital Agency</p>
  `;
  return {
    subject: "Your Free Audit Has Been Rescheduled",
    html: emailLayout({ previewText: `Your audit has moved to ${formatBookingDate(newDate)}.`, bodyHtml: body }),
  };
}
