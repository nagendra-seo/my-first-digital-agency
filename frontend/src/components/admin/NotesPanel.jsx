import { useState } from "react";
import { TextArea } from "../ui/FormField.jsx";
import { Button } from "../ui/Button.jsx";
import { updateNotes } from "../../api/admin.js";

export function NotesPanel({ bookingId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const result = await updateNotes(bookingId, notes);
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div>
      <TextArea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes about this booking — not visible to the client." />
      <div className="mt-2 flex items-center gap-3">
        <Button variant="outline" onClick={handleSave} disabled={saving} className="text-sm">{saving ? "Saving…" : "Save notes"}</Button>
        {saved && <span className="text-xs font-semibold text-emerald-700">Saved.</span>}
      </div>
    </div>
  );
}
