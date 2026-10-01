import { emailLayout, detailTable, detailRow, escapeHtml } from "./layout.js";
import { formatBookingDate, formatBookingTime } from "../../../utils/format.js";
import { DEFAULT_CANCELLATION_MESSAGE } from "../../../utils/constants.js";

export function bookingCancelledEmail({ name, businessName, bookingReference, preferredDate, preferredTime, reason }) {
  const body = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>We're writing about your free audit request for <strong>${escapeHtml(businessName)}</strong>.</p>
    ${detailTable(
      detailRow("Originally requested", `${formatBookingDate(preferredDate)}, ${formatBookingTime(preferredTime)} (IST)`) +
        detailRow("Reference", bookingReference) +
        detailRow("Status", "Cancelled")
    )}
    <p>${escapeHtml((reason && reason.trim()) || DEFAULT_CANCELLATION_MESSAGE)}</p>
    <p>If you'd like to request a different time, you're welcome to submit a new audit request whenever suits you.</p>
    <p>Thanks for your understanding,<br/>My First Digital Agency</p>
  `;
  return {
    subject: "Update on your Free Audit request - My FirstDIGITAL AGENCY",
    html: emailLayout({ previewText: "An update on your free audit request.", bodyHtml: body }),
  };
}
