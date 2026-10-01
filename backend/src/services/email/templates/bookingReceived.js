import { emailLayout, detailTable, detailRow, escapeHtml } from "./layout.js";
import { formatBookingDate, formatBookingTime } from "../../../utils/format.js";

export function bookingReceivedEmail({ name, businessName, bookingReference, preferredDate, preferredTime }) {
  const body = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thanks for reaching out to <strong>My First Digital Agency</strong>. We've received your free audit request for <strong>${escapeHtml(businessName)}</strong>.</p>
    ${detailTable(
      detailRow("Booking reference", bookingReference) +
        detailRow("Requested date", formatBookingDate(preferredDate)) +
        detailRow("Requested time", `${formatBookingTime(preferredTime)} (IST)`) +
        detailRow("Status", "Pending review")
    )}
    <p>This slot is a <strong>request</strong>, not a confirmed appointment yet. Our team reviews every request and will follow up shortly to confirm, or suggest an alternative time if needed.</p>
    <p>Talk soon,<br/>My First Digital Agency</p>
  `;
  return {
    subject: "Your Free Audit Request - My FirstDIGITAL AGENCY",
    html: emailLayout({ previewText: `We've received your audit request, ${name}.`, bodyHtml: body }),
  };
}
