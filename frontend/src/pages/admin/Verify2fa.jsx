import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label, TextInput } from "../../components/ui/FormField.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { verify2fa } from "../../api/admin.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function Verify2fa() {
  const navigate = useNavigate();
  const { refresh } = useAdminAuth();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const code = String(formData.get("code") || "").trim();

    const result = await verify2fa(code);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || "That code didn't work. Please try again.");
      return;
    }

    await refresh();
    navigate("/admin/dashboard");
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-2xl">
      <h1 className="font-display text-2xl font-bold text-charcoal-900">Two-factor verification</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {useRecoveryCode ? "Enter one of your saved recovery codes." : "Enter the 6-digit code from your authenticator app."}
      </p>

      {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="code">{useRecoveryCode ? "Recovery code" : "Authentication code"}</Label>
          <TextInput id="code" name="code" required autoFocus autoComplete="one-time-code" placeholder={useRecoveryCode ? "XXXX-XXXX" : "123456"} maxLength={useRecoveryCode ? 9 : 6} />
        </div>
        <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
          {submitting ? "Verifying..." : "Verify and continue"}
        </Button>
      </form>

      <button type="button" onClick={() => setUseRecoveryCode((v) => !v)} className="mt-5 text-sm font-semibold text-ink-soft underline decoration-gold-400">
        {useRecoveryCode ? "Use authenticator code instead" : "Use a recovery code instead"}
      </button>
    </div>
  );
}
