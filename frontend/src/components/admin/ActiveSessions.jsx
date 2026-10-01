import { useEffect, useState, useCallback } from "react";
import { listSessions, revokeSession } from "../../api/admin.js";
import { formatDateTimeShort } from "../../lib/format.js";

/** "Stronger admin panel" feature: shows every device currently signed in
 *  (IP, browser, last activity) so a compromised session can be spotted
 *  and revoked immediately — without waiting for it to expire on its own. */
export function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listSessions();
    if (result.ok) setSessions(result.data.sessions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRevoke(id) {
    setRevokingId(id);
    await revokeSession(id);
    await load();
    setRevokingId(null);
  }

  if (loading) return <p className="text-sm text-ink-faint">Loading…</p>;
  if (sessions.length === 0) return <p className="text-sm text-ink-faint">No active sessions.</p>;

  return (
    <div className="space-y-3">
      {sessions.map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-charcoal-900/10 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-charcoal-900">{s.userAgent || "Unknown device"}</p>
            <p className="text-xs text-ink-faint">{s.ipAddress || "Unknown IP"} &middot; signed in {formatDateTimeShort(s.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={() => handleRevoke(s.id)}
            disabled={revokingId === s.id}
            className="shrink-0 rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {revokingId === s.id ? "Revoking…" : "Revoke"}
          </button>
        </div>
      ))}
    </div>
  );
}
