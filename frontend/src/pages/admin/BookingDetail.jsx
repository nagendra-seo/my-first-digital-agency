import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopBar } from "../../components/admin/TopBar.jsx";
import { StatusBadge } from "../../components/admin/StatusBadge.jsx";
import { NotesPanel } from "../../components/admin/NotesPanel.jsx";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog.jsx";
import { CancelDialog } from "../../components/admin/CancelDialog.jsx";
import { RescheduleDialog } from "../../components/admin/RescheduleDialog.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { getBooking, completeBooking } from "../../api/admin.js";
import { formatBookingDate, formatBookingTime, formatDateTimeShort } from "../../lib/format.js";

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-charcoal-900/5 py-2.5 text-sm last:border-0">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-right font-semibold text-charcoal-900">{value}</dd>
    </div>
  );
}

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getBooking(id);
    if (result.ok) {
      setBooking(result.data.booking);
      setAuditLogs(result.data.auditLogs ?? []);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function handleDialogDone() {
    setDialog(null);
    load();
  }

  if (loading) {
    return (<><TopBar title="Booking" /><Container className="max-w-none px-6 py-8 lg:px-8"><p className="text-ink-faint">Loading…</p></Container></>);
  }
  if (!booking) {
    return (<><TopBar title="Booking" /><Container className="max-w-none px-6 py-8 lg:px-8"><p className="text-ink-faint">Booking not found.</p></Container></>);
  }

  const canConfirm = booking.status === "PENDING" || booking.status === "RESCHEDULED";
  const canCancel = booking.status !== "CANCELLED" && booking.status !== "COMPLETED";
  const canReschedule = booking.status !== "CANCELLED" && booking.status !== "COMPLETED";
  const canComplete = booking.status === "CONFIRMED";

  return (
    <>
      <TopBar title={`Audit Request #${booking.bookingReference}`} />
      <Container className="max-w-none px-6 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-ink-faint">{booking.bookingReference}</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-charcoal-900">{booking.businessName}</h2>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <dl className="mt-5">
                <DetailRow label="Client name" value={booking.name} />
                <DetailRow label="Email" value={booking.email} />
                <DetailRow label="Phone" value={booking.phone ?? "—"} />
                <DetailRow label="Website" value={booking.websiteUrl ?? "—"} />
                <DetailRow label="Preferred appointment" value={`${formatBookingDate(booking.preferredDate)}, ${formatBookingTime(booking.preferredTime)} IST`} />
                {booking.rescheduledFromDate && booking.rescheduledFromTime && (
                  <DetailRow label="Originally requested" value={`${formatBookingDate(booking.rescheduledFromDate)}, ${formatBookingTime(booking.rescheduledFromTime)} IST`} />
                )}
                <DetailRow label="Submitted" value={formatDateTimeShort(booking.createdAt)} />
                {booking.cancellationReason && <DetailRow label="Cancellation reason" value={booking.cancellationReason} />}
              </dl>
            </div>

            <div className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <h3 className="font-display text-base font-bold text-charcoal-900">What they&rsquo;d like to improve</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink-soft">{booking.message}</p>
            </div>

            <div className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <h3 className="font-display text-base font-bold text-charcoal-900">Admin notes</h3>
              <div className="mt-3">
                <NotesPanel bookingId={booking._id} initialNotes={booking.adminNotes ?? ""} />
              </div>
            </div>

            {(booking.clientEmailFailedAt || booking.adminNotifyFailedAt) && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                One or more notification emails failed to send for this booking. The booking itself is safe — nothing was lost — but you may want to follow up with the client directly.
              </div>
            )}

            <div className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <h3 className="font-display text-base font-bold text-charcoal-900">History</h3>
              <div className="mt-3 space-y-3">
                {auditLogs.length === 0 && <p className="text-sm text-ink-faint">No actions recorded yet.</p>}
                {auditLogs.map((log) => (
                  <div key={log._id} className="text-sm">
                    <span className="font-semibold text-charcoal-900">{log.action.replaceAll("_", " ")}</span>{" "}
                    <span className="text-ink-faint">&middot; {log.adminEmail || "System"} &middot; {formatDateTimeShort(log.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-charcoal-900/10 bg-white p-5">
              <h3 className="mb-3 font-display text-sm font-bold text-charcoal-900">Actions</h3>
              <div className="flex flex-col gap-2">
                <Button variant="primary" disabled={!canConfirm} onClick={() => setDialog("confirm")}>Confirm</Button>
                <Button variant="outline" disabled={!canReschedule} onClick={() => setDialog("reschedule")}>Reschedule</Button>
                <Button variant="outline" disabled={!canCancel} onClick={() => setDialog("cancel")}>Cancel</Button>
                <Button variant="dark" disabled={!canComplete} onClick={async () => { await completeBooking(booking._id); load(); }}>Mark Completed</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <ConfirmDialog bookingId={booking._id} open={dialog === "confirm"} onClose={() => setDialog(null)} onDone={handleDialogDone} />
      <CancelDialog bookingId={booking._id} open={dialog === "cancel"} onClose={() => setDialog(null)} onDone={handleDialogDone} />
      <RescheduleDialog bookingId={booking._id} open={dialog === "reschedule"} onClose={() => setDialog(null)} onDone={handleDialogDone} />
    </>
  );
}
