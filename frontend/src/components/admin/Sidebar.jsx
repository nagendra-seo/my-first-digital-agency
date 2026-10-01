import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z" },
  { href: "/admin/bookings", label: "Bookings", icon: "M6 4h12a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1zM8 2v4M16 2v4M5 9h14M8.5 13h.01M12 13h4M8.5 16h.01M12 16h4" },
  { href: "/admin/activity", label: "Activity Log", icon: "M12 8v4l3 3M12 21a9 9 0 100-18 9 9 0 000 18z" },
  { href: "/admin/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-cream-100/10 bg-charcoal-900 text-cream-100 lg:flex">
      <div className="flex h-20 items-center px-6">
        <img src="/brand/logo-light.png" alt="My First Digital Agency" width={150} height={40} className="h-8 w-auto" />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
        {LINKS.map((link) => {
          const active = location.pathname === link.href || location.pathname.startsWith(link.href + "/");
          return (
            <Link key={link.href} to={link.href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-gold-400 text-charcoal-900" : "text-cream-100/70 hover:bg-cream-100/5 hover:text-cream-100"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={link.icon} />
              </svg>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <Link to="/" className="block rounded-lg border border-cream-100/10 px-3 py-2.5 text-center text-xs font-semibold text-cream-100/60 hover:text-cream-100">
          ← Back to website
        </Link>
      </div>
    </aside>
  );
}
