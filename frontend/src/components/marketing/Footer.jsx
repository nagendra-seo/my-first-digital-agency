import { Link } from "react-router-dom";
import { Container } from "../ui/Container.jsx";
import { Button } from "../ui/Button.jsx";
import { NAV_LINKS, SITE_TAGLINE } from "../../lib/constants.js";

function SocialIcon({ label, path }) {
  return (
    <a href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/20 text-cream-100/80 transition-colors hover:border-gold-400 hover:text-gold-400">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100">
      <Container className="py-16">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <img src="/brand/logo-light.png" alt="My First Digital Agency" width={168} height={44} className="h-9 w-auto md:h-10" />
            <p className="mt-3 text-sm text-cream-100/60">{SITE_TAGLINE}</p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="text-xl font-display font-bold md:text-2xl">
              Let&rsquo;s make your next <span className="text-gold-400">chapter count.</span>
            </p>
            <Button href="/free-audit" variant="primary">
              Book a free audit
            </Button>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-cream-100/10" />

        <div className="flex flex-col-reverse items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="text-xs text-cream-100/50">&copy; {new Date().getFullYear()} My First Digital Agency. Built for ambitious businesses.</p>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className="text-xs font-semibold text-cream-100/70 hover:text-gold-400">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-3">
            <SocialIcon label="LinkedIn" path="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.85-3-1.85 0-2.13 1.4-2.13 2.9V21h-4V9z" />
            <SocialIcon label="Instagram" path="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.25.07 1.63.07 4.81s-.01 3.56-.07 4.81c-.15 3.22-1.66 4.77-4.92 4.92-1.25.06-1.63.07-4.85.07s-3.6-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.56 2.16 15.18 2.16 12s.01-3.56.07-4.81C2.38 3.97 3.9 2.42 7.15 2.27 8.4 2.21 8.78 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.74.07-2.27.1-3.34 1.19-3.44 3.44-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.1 2.25 1.16 3.34 3.44 3.44 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c2.27-.1 3.34-1.18 3.44-3.44.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.1-2.25-1.17-3.34-3.44-3.44A62.6 62.6 0 0012 4zm0 3.55a4.45 4.45 0 110 8.9 4.45 4.45 0 010-8.9zm0 1.8a2.65 2.65 0 100 5.3 2.65 2.65 0 000-5.3zm5.66-1.98a1.04 1.04 0 11-2.08 0 1.04 1.04 0 012.08 0z" />
            <SocialIcon label="Facebook" path="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.3c-.26-.04-1.14-.11-2.17-.11-2.15 0-3.63 1.31-3.63 3.72v2.08H8.25v3h2.45V21h2.8z" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
