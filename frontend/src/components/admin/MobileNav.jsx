import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/activity", label: "Activity Log" },
  { href: "/admin/settings", label: "Settings" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="relative flex items-center justify-between border-b border-charcoal-900/10 bg-charcoal-900 px-4 py-3 lg:hidden">
      <img src="/brand/logo-light.png" alt="My First Digital Agency" width={130} height={34} className="h-7 w-auto" />
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Toggle admin menu" className="rounded-md border border-cream-100/20 px-3 py-1.5 text-xs font-semibold text-cream-100">
        Menu
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[52px] z-40 border-b border-cream-100/10 bg-charcoal-900 px-4 py-3">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link key={link.href} to={link.href} className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${location.pathname.startsWith(link.href) ? "bg-gold-400 text-charcoal-900" : "text-cream-100/80"}`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
