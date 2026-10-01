import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label, TextInput } from "../../components/ui/FormField.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { login } from "../../api/admin.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAdminAuth();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const result = await login(email, password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Something went wrong. Please try again.");
      return;
    }

    if (result.data.requires2fa) {
      navigate("/admin/login/verify-2fa");
    } else {
      await refresh();
      navigate("/admin/dashboard");
    }
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-2xl">
      <h1 className="font-display text-2xl font-bold text-charcoal-900">Admin sign in</h1>
      <p className="mt-1 text-sm text-ink-soft">Sign in to manage audit bookings.</p>

      {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <TextInput id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <TextInput id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <Button type="submit" variant="dark" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
