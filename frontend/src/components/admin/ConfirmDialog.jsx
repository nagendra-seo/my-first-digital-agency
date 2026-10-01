import { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { confirmBooking } from "../../api/admin.js";

export function ConfirmDialog({ bookingId, open, onClose, onDone }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    const result = await confirmBooking(bookingId);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }
    onDone();
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirm this audit?">
      <p className="text-sm text-ink-soft">The client will receive a confirmation email with their scheduled date and time.</p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="primary" onClick={handleConfirm} disabled={submitting}>{submitting ? "Confirming…" : "Yes, confirm audit"}</Button>
      </div>
    </Modal>
  );
}
