import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../../components/admin/TopBar.jsx";
import { StatCard } from "../../components/admin/StatCard.jsx";
import { StatusBadge } from "../../components/admin/StatusBadge.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { getDashboardStats } from "../../api/admin.js";
import { formatBookingDate, formatBookingTime, formatDateTimeShort } from "../../lib/format.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDashboardStats().then((result) => {
      if (active && result.ok) setStats(result.data);
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <TopBar title="Dashboard" />
      <Container className="max-w-none px-6 py-8 lg:px-8">
        {loading || !stats ? (
          <p className="text-ink-faint">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label="Total Bookings" value={stats.counts.total} />
              <StatCard label="Pending" value={stats.counts.pending} accent />
              <StatCard label="Confirmed" value={stats.counts.confirmed} />
              <StatCard label="Cancelled" value={stats.counts.cancelled} />
              <StatCard label="Completed" value={stats.counts.completed} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard label="Today's requests" value={stats.counts.todaysRequests} />
              <StatCard label="Upcoming confirmed audits" value={stats.counts.upcomingConfirmedCount} />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-charcoal-900">Recent bookings</h2>
                  <Link to="/admin/bookings" className="text-sm font-semibold text-gold-700">View all →</Link>
                </div>
                <div className="divide-y divide-charcoal-900/10 rounded-2xl border border-charcoal-900/10 bg-white">
                  {stats.recentBookings.length === 0 && <p className="p-5 text-sm text-ink-faint">No bookings yet.</p>}
                  {stats.recentBookings.map((b) => (
                    <Link key={b._id} to={`/admin/bookings/${b._id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-cream-100">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-charcoal-900">{b.businessName}</p>
                        <p className="truncate text-xs text-ink-faint">{b.bookingReference} &middot; {formatBookingDate(b.preferredDate)}, {formatBookingTime(b.preferredTime)}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-charcoal-900">Recent activity</h2>
                  <Link to="/admin/activity" className="text-sm font-semibold text-gold-700">View all →</Link>
                </div>
                <div className="divide-y divide-charcoal-900/10 rounded-2xl border border-charcoal-900/10 bg-white">
                  {stats.recentActivity.length === 0 && <p className="p-5 text-sm text-ink-faint">No activity recorded yet.</p>}
                  {stats.recentActivity.map((log) => (
                    <div key={log._id} className="p-4">
                      <p className="text-sm font-semibold text-charcoal-900">{log.action.replaceAll("_", " ")}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {log.adminEmail || "System"}{log.bookingReference ? ` · ${log.bookingReference}` : ""} · {formatDateTimeShort(log.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
}
