import { useCallback, useEffect, useState } from "react";
import { TopBar } from "../../components/admin/TopBar.jsx";
import { TwoFactorSetup } from "../../components/admin/TwoFactorSetup.jsx";
import { ActiveSessions } from "../../components/admin/ActiveSessions.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { getOverview, toggleTimeSlot } from "../../api/admin.js";

export default function Settings() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getOverview();
    if (result.ok) setOverview(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleSlot(id) {
    await toggleTimeSlot(id);
    load();
  }

  return (
    <>
      <TopBar title="Settings" />
      <Container className="max-w-none px-6 py-8 lg:px-8">
        {loading || !overview ? (
          <p className="text-ink-faint">Loading…</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <h2 className="font-display text-base font-bold text-charcoal-900">Admin profile</h2>
              <p className="mt-3 text-sm text-ink-soft">{overview.email}</p>
            </section>

            <section className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <h2 className="font-display text-base font-bold text-charcoal-900">Two-factor authentication</h2>
              <div className="mt-3">
                {overview.twoFactorEnabled ? (
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Enabled</p>
                    <p className="mt-1 text-xs text-ink-faint">{overview.recoveryCodesRemaining} recovery code{overview.recoveryCodesRemaining === 1 ? "" : "s"} remaining.</p>
                  </div>
                ) : (
                  <TwoFactorSetup onEnabled={load} />
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <h2 className="font-display text-base font-bold text-charcoal-900">Business timezone</h2>
              <p className="mt-3 text-sm text-ink-soft">{overview.businessTimezone} (fixed for now)</p>
            </section>

            <section className="rounded-2xl border border-charcoal-900/10 bg-white p-6">
              <h2 className="font-display text-base font-bold text-charcoal-900">Email notifications</h2>
              <p className="mt-3 text-sm text-ink-soft">
                New-booking alerts are sent to <span className="font-semibold text-charcoal-900">{overview.adminNotificationEmail}</span>.
              </p>
            </section>

            <section className="rounded-2xl border border-charcoal-900/10 bg-white p-6 lg:col-span-2">
              <h2 className="font-display text-base font-bold text-charcoal-900">Active sessions</h2>
              <p className="mt-1 text-sm text-ink-soft">Every device currently signed in to this account. Revoke anything you don&rsquo;t recognize.</p>
              <div className="mt-4">
                <ActiveSessions />
              </div>
            </section>

            <section className="rounded-2xl border border-charcoal-900/10 bg-white p-6 lg:col-span-2">
              <h2 className="font-display text-base font-bold text-charcoal-900">Booking availability</h2>
              <p className="mt-1 text-sm text-ink-soft">Toggle which time slots clients can request on the free-audit form.</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {overview.timeSlots.map((slot) => (
                  <button
                    key={slot._id}
                    type="button"
                    onClick={() => handleToggleSlot(slot._id)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      slot.isActive ? "border-gold-400 bg-gold-50 text-charcoal-900" : "border-charcoal-900/10 bg-cream-100 text-ink-faint line-through"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
                {overview.timeSlots.length === 0 && <p className="text-sm text-ink-faint">No time slots seeded yet — run the database seed script.</p>}
              </div>
            </section>
          </div>
        )}
      </Container>
    </>
  );
}
