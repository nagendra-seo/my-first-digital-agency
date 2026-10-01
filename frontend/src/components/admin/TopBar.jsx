import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/admin.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export function TopBar({ title }) {
  const navigate = useNavigate();
  const { admin, refresh } = useAdminAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    await refresh();
    navigate("/admin/login");
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-charcoal-900/10 bg-white px-6 lg:px-8">
      <h1 className="font-display text-xl font-bold text-charcoal-900">{title}</h1>
      <div className="flex items-center gap-4">
        {admin?.email && <span className="hidden text-sm text-ink-soft sm:inline">{admin.email}</span>}
        <button type="button" onClick={handleLogout} disabled={loggingOut} className="rounded-full border border-charcoal-900/15 px-4 py-2 text-sm font-semibold text-charcoal-900 hover:bg-cream-100">
          {loggingOut ? "Signing out..." : "Log out"}
        </button>
      </div>
    </header>
  );
}
