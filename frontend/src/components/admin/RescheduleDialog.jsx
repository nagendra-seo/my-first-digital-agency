import { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Label, TextInput, TextArea, Select } from "../ui/FormField.jsx";
import { DEFAULT_TIME_SLOTS } from "../../lib/constants.js";
import { rescheduleBooking } from "../../api/admin.js";

export function RescheduleDialog({ bookingId, open, onClose, onDone }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState(DEFAULT_TIME_SLOTS[0]?.value ?? "10:00");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleReschedule() {
    if (!date) {
      setError("Choose a new date.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await rescheduleBooking(bookingId, { preferredDate: date, preferredTime: time, note });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }
    onDone();
  }

  return (
    <Modal open={open} onClose={onClose} title="Reschedule this audit">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="reschedule-date">New date</Label>
          <TextInput id="reschedule-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="reschedule-time">New time (IST)</Label>
          <Select id="reschedule-time" value={time} onChange={(e) => setTime(e.target.value)}>
            {DEFAULT_TIME_SLOTS.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
          </Select>
        </div>
      </div>
      <div className="mt-3">
        <Label htmlFor="reschedule-note">Note to client (optional)</Label>
        <TextArea id="reschedule-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Apologies for the change — this time works better for our specialist." />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={submitting}>Never mind</Button>
        <Button variant="primary" onClick={handleReschedule} disabled={submitting}>{submitting ? "Rescheduling…" : "Reschedule audit"}</Button>
      </div>
    </Modal>
  );
}
