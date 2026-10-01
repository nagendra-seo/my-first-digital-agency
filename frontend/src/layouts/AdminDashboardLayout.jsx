import { Navigate, Outlet, Link } from "react-router-dom";
import { Sidebar } from "../components/admin/Sidebar.jsx";
import { MobileNav } from "../components/admin/MobileNav.jsx";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

export function AdminDashboardLayout() {
  const { loading, authenticated, admin } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-ink-faint">Loading…</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const needsTwoFactorSetup = !admin?.twoFactorEnabled;

  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        {needsTwoFactorSetup && (
          <div className="bg-gold-400 px-6 py-3 text-center text-sm font-semibold text-charcoal-900">
            Two-factor authentication isn&rsquo;t set up yet.{" "}
            <Link to="/admin/settings" className="underline">Finish setup in Settings</Link> to secure this account.
          </div>
        )}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
