import { useState } from "react";
import { Label, ErrorText, TextInput, TextArea, Select } from "../ui/FormField.jsx";
import { Button } from "../ui/Button.jsx";
import { TurnstileWidget } from "./TurnstileWidget.jsx";
import { DEFAULT_TIME_SLOTS } from "../../lib/constants.js";
import { formatBookingDate, formatBookingTime, todayIsoInIst } from "../../lib/format.js";
import { createBooking } from "../../api/bookings.js";

export function AuditForm({ siteKey }) {
  const [submitting, setSubmitting] = useState(false);
  const [topError, setTopError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setTopError(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      businessName: String(formData.get("businessName") || ""),
      websiteUrl: String(formData.get("websiteUrl") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      preferredDate: String(formData.get("preferredDate") || ""),
      preferredTime: String(formData.get("preferredTime") || ""),
      turnstileToken,
      website: String(formData.get("website") || ""), // honeypot
    };

    if (!turnstileToken) {
      setTopError("Please complete the verification challenge before submitting.");
      return;
    }

    setSubmitting(true);
    const result = await createBooking(payload);
    setSubmitting(false);

    if (!result.ok) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      setTopError(result.error || "Something went wrong. Please check the form and try again.");
      setTurnstileResetKey((k) => k + 1);
      setTurnstileToken("");
      return;
    }

    setSuccess({
      bookingReference: result.data.bookingReference,
      preferredDate: result.data.preferredDate,
      preferredTime: result.data.preferredTime,
    });
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#1A1612" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal-900">Your audit request has been received.</h3>
        <p className="mt-3 text-sm text-ink-soft">We&rsquo;ll review your requested slot and confirm by email shortly. This is not yet a confirmed appointment.</p>
        <dl className="mt-6 space-y-2 rounded-xl bg-cream-100 p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-faint">Booking reference</dt>
            <dd className="font-bold text-charcoal-900">{success.bookingReference}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-faint">Requested date</dt>
            <dd className="font-bold text-charcoal-900">{formatBookingDate(`${success.preferredDate}T00:00:00.000Z`)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-faint">Requested time</dt>
            <dd className="font-bold text-charcoal-900">{formatBookingTime(success.preferredTime)} IST</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-faint">Status</dt>
            <dd className="font-bold text-gold-700">Pending review</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative rounded-2xl bg-white p-6 shadow-xl sm:p-8">
      <h3 className="font-display text-2xl font-bold text-charcoal-900">Get your free audit</h3>

      {topError && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{topError}</div>}

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <TextInput id="name" name="name" required placeholder="Your name" error={fieldErrors.name?.[0]} />
          <ErrorText>{fieldErrors.name?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <TextInput id="email" name="email" type="email" required placeholder="you@business.com" error={fieldErrors.email?.[0]} />
          <ErrorText>{fieldErrors.email?.[0]}</ErrorText>
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="businessName">Business name</Label>
        <TextInput id="businessName" name="businessName" required placeholder="Your business" error={fieldErrors.businessName?.[0]} />
        <ErrorText>{fieldErrors.businessName?.[0]}</ErrorText>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="websiteUrl">Website URL (optional)</Label>
          <TextInput id="websiteUrl" name="websiteUrl" placeholder="https://example.com" error={fieldErrors.websiteUrl?.[0]} />
          <ErrorText>{fieldErrors.websiteUrl?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="phone">Phone / WhatsApp (optional)</Label>
          <TextInput id="phone" name="phone" placeholder="+91 90000 00000" error={fieldErrors.phone?.[0]} />
          <ErrorText>{fieldErrors.phone?.[0]}</ErrorText>
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="message">What would you like to improve?</Label>
        <TextArea id="message" name="message" required rows={3} placeholder="More visibility, better leads, a website that converts..." error={fieldErrors.message?.[0]} />
        <ErrorText>{fieldErrors.message?.[0]}</ErrorText>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="preferredDate">Preferred date</Label>
          <TextInput id="preferredDate" name="preferredDate" type="date" required min={todayIsoInIst()} error={fieldErrors.preferredDate?.[0]} />
          <ErrorText>{fieldErrors.preferredDate?.[0]}</ErrorText>
        </div>
        <div>
          <Label htmlFor="preferredTime">Preferred time (IST)</Label>
          <Select id="preferredTime" name="preferredTime" required error={fieldErrors.preferredTime?.[0]}>
            {DEFAULT_TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>{slot.label}</option>
            ))}
          </Select>
          <ErrorText>{fieldErrors.preferredTime?.[0]}</ErrorText>
        </div>
      </div>

      <div className="mt-5">
        <TurnstileWidget siteKey={siteKey} onVerify={setTurnstileToken} resetKey={turnstileResetKey} />
      </div>

      <Button type="submit" variant="primary" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Submitting..." : "Book my free audit"}
        {!submitting && (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-ink-faint">We&rsquo;ll only use your details to reply to this enquiry.</p>
    </form>
  );
}
