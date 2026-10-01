import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container } from "../ui/Container.jsx";
import { Button } from "../ui/Button.jsx";
import { NAV_LINKS } from "../../lib/constants.js";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-900/10 bg-cream-100/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="My First Digital Agency — home">
          <img src="/brand/logo-full.png" alt="My First Digital Agency" width={168} height={44} className="h-9 w-auto md:h-10" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-semibold transition-colors hover:text-gold-600 ${
                location.pathname === link.href ? "text-charcoal-900" : "text-ink-soft"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/free-audit" variant="primary" className="text-sm">
            Get Your Free Audit
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-900/15 lg:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-charcoal-900 transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-charcoal-900 transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-charcoal-900 transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </span>
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={`fixed inset-x-0 top-20 z-40 origin-top border-b border-charcoal-900/10 bg-cream-100 shadow-xl transition-all duration-200 lg:hidden ${
          open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        }`}
      >
        <Container className="flex flex-col gap-1 py-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-cream-200">
              {link.label}
            </Link>
          ))}
          <div className="mt-3">
            <Button href="/free-audit" variant="primary" className="w-full">
              Get Your Free Audit
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
