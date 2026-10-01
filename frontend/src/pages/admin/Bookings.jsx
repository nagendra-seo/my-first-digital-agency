import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../../components/admin/TopBar.jsx";
import { StatusBadge } from "../../components/admin/StatusBadge.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Select, TextInput } from "../../components/ui/FormField.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { formatBookingDate, formatBookingTime } from "../../lib/format.js";
import { listBookings, exportBookingsUrl } from "../../api/admin.js";

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "RESCHEDULED", "CANCELLED", "COMPLETED"];

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams = useMemo(() => {
    const params = { status, sort, page: String(page), pageSize: String(pageSize) };
    if (debouncedSearch) params.search = debouncedSearch;
    return params;
  }, [status, sort, page, debouncedSearch]);

  useEffect(() => {
    setLoading(true);
    listBookings(queryParams).then((result) => {
      if (result.ok) {
        setRows(result.data.items ?? []);
        setTotal(result.data.total ?? 0);
        setStatusCounts(result.data.statusCounts ?? {});
      }
      setLoading(false);
    });
  }, [queryParams]);

  useEffect(() => setPage(1), [debouncedSearch, status, sort]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <TopBar title="Bookings" />
      <Container className="max-w-none px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-charcoal-900/10 bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <TextInput placeholder="Search name, email, business or reference…" value={search} onChange={(e) => setSearch(e.target.value)} className="md:max-w-xs" />
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="md:max-w-[180px]">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === "ALL" ? `All statuses (${total})` : `${s.charAt(0)}${s.slice(1).toLowerCase()} (${statusCounts[s] ?? 0})`}</option>
              ))}
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="md:max-w-[180px]">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="appointment">Appointment date</option>
            </Select>
          </div>
          <a href={exportBookingsUrl(queryParams)} target="_blank" rel="noreferrer">
            <Button variant="outline" className="whitespace-nowrap text-sm">Export CSV</Button>
          </a>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-charcoal-900/10 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-charcoal-900/10 text-left text-xs font-bold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Business / Client</th>
                <th className="px-5 py-3">Requested</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-900/5">
              {loading && <tr><td colSpan={5} className="px-5 py-8 text-center text-ink-faint">Loading…</td></tr>}
              {!loading && rows.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-ink-faint">No bookings match these filters.</td></tr>}
              {!loading && rows.map((b) => (
                <tr key={b._id} className="hover:bg-cream-100">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-charcoal-900">{b.bookingReference}</td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-charcoal-900">{b.businessName}</p>
                    <p className="text-xs text-ink-faint">{b.name} &middot; {b.email}</p>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {formatBookingDate(b.preferredDate)}<br />
                    <span className="text-xs text-ink-faint">{formatBookingTime(b.preferredTime)} IST</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/admin/bookings/${b._id}`} className="text-sm font-bold text-gold-700">Open →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between text-sm text-ink-soft">
            <span>Page {page} of {totalPages} &middot; {total} total</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-charcoal-900/15 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-lg border border-charcoal-900/15 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
