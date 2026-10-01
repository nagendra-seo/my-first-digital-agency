import { Container } from "../ui/Container.jsx";
import { AuditForm } from "./AuditForm.jsx";

const points = ["30-minute clarity call", "Practical recommendations", "Zero awkward sales pitch"];

export function CTASection({ siteKey }) {
  return (
    <section className="section-py bg-charcoal-900 text-cream-100">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Ready to own <span className="text-gold-400">your growth?</span>
          </h2>
          <p className="mt-5 max-w-md text-cream-100/70">
            Tell us a little about where you are now. We&rsquo;ll show you where you could go next &mdash; with a free, no-pressure audit.
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm font-semibold">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10.5l3.5 3.5L16 6" stroke="#F5C319" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <AuditForm siteKey={siteKey} />
      </Container>
    </section>
  );
}
