import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Label, TextInput } from "../ui/FormField.jsx";
import { setup2fa, verify2faSetup } from "../../api/admin.js";

export function TwoFactorSetup({ onEnabled }) {
  const [step, setStep] = useState("start");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [secret, setSecret] = useState(null);
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function startSetup() {
    setBusy(true);
    setError(null);
    const result = await setup2fa();
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "Couldn't start setup.");
      return;
    }
    setQrDataUrl(result.data.qrDataUrl);
    setSecret(result.data.secret);
    setStep("scan");
  }

  async function verifyCode() {
    setBusy(true);
    setError(null);
    const result = await verify2faSetup(code);
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "That code didn't work.");
      return;
    }
    setRecoveryCodes(result.data.recoveryCodes);
    setStep("done");
  }

  if (step === "start") {
    return (
      <div>
        <p className="text-sm text-ink-soft">Two-factor authentication isn&rsquo;t set up yet. We strongly recommend enabling it before using this dashboard day-to-day.</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button variant="primary" className="mt-4" onClick={startSetup} disabled={busy}>{busy ? "Starting…" : "Set up two-factor authentication"}</Button>
      </div>
    );
  }

  if (step === "scan") {
    return (
      <div>
        <p className="text-sm text-ink-soft">Scan this QR code with your authenticator app (Google Authenticator, 1Password, Authy…), then enter the 6-digit code it shows.</p>
        {qrDataUrl && <img src={qrDataUrl} alt="Scan this QR code in your authenticator app" className="mt-4 h-40 w-40" />}
        {secret && <p className="mt-2 break-all text-xs text-ink-faint">Can&rsquo;t scan? Enter this key manually: <span className="font-mono">{secret}</span></p>}
        <div className="mt-4 max-w-[200px]">
          <Label htmlFor="totp-code">6-digit code</Label>
          <TextInput id="totp-code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} placeholder="123456" />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button variant="primary" className="mt-4" onClick={verifyCode} disabled={busy}>{busy ? "Verifying…" : "Verify and enable"}</Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-emerald-700">Two-factor authentication is now enabled.</p>
      <p className="mt-2 text-sm text-ink-soft">Save these one-time recovery codes somewhere safe — each can be used once if you lose access to your authenticator app. They won&rsquo;t be shown again.</p>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-cream-100 p-4 font-mono text-sm">
        {recoveryCodes?.map((c) => <div key={c}>{c}</div>)}
      </div>
      <Button variant="dark" className="mt-4" onClick={onEnabled}>Done</Button>
    </div>
  );
}
