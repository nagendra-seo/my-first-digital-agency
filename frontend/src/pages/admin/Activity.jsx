import { useEffect, useState } from "react";
import { TopBar } from "../../components/admin/TopBar.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { listActivity } from "../../api/admin.js";
import { formatDateTimeShort } from "../../lib/format.js";

export default function Activity() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 40;

  useEffect(() => {
    setLoading(true);
    listActivity(page).then((result) => {
      if (result.ok) {
        setItems(result.data.items ?? []);
        setTotal(result.data.total ?? 0);
      }
      setLoading(false);
    });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <TopBar title="Activity Log" />
      <Container className="max-w-none px-6 py-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-charcoal-900/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-900/10 text-left text-xs font-bold uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Admin</th>
                <th className="px-5 py-3">Booking</th>
                <th className="px-5 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-900/5">
              {loading && <tr><td colSpan={4} className="px-5 py-8 text-center text-ink-faint">Loading…</td></tr>}
              {!loading && items.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-ink-faint">No activity recorded yet.</td></tr>}
              {!loading && items.map((item) => (
                <tr key={item._id}>
                  <td className="px-5 py-3 font-semibold text-charcoal-900">{item.action.replaceAll("_", " ")}</td>
                  <td className="px-5 py-3 text-ink-soft">{item.adminEmail || "System"}</td>
                  <td className="px-5 py-3 text-ink-soft">{item.bookingReference || "—"}</td>
                  <td className="px-5 py-3 text-ink-faint">{formatDateTimeShort(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between text-sm text-ink-soft">
            <span>Page {page} of {totalPages}</span>
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
