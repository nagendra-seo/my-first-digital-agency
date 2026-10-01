import { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { TextArea, Label } from "../ui/FormField.jsx";
import { cancelBooking } from "../../api/admin.js";

export function CancelDialog({ bookingId, open, onClose, onDone }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleCancel() {
    setSubmitting(true);
    setError(null);
    const result = await cancelBooking(bookingId, reason);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }
    onDone();
  }

  return (
    <Modal open={open} onClose={onClose} title="Cancel this audit?">
      <Label htmlFor="cancel-reason">Reason (optional)</Label>
      <TextArea id="cancel-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Shown to the client. Leave blank to use our default message." />
      <p className="mt-2 text-xs text-ink-faint">
        If left blank, the client will see: &ldquo;Unfortunately, we&rsquo;re unable to confirm your requested audit at this time. We apologize for the inconvenience.&rdquo;
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={submitting}>Never mind</Button>
        <Button variant="dark" onClick={handleCancel} disabled={submitting}>{submitting ? "Cancelling…" : "Cancel audit"}</Button>
      </div>
    </Modal>
  );
}
