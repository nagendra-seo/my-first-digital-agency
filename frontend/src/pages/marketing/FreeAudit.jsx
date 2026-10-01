import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { AuditForm } from "../../components/marketing/AuditForm.jsx";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export default function FreeAudit() {
  return (
    <>
      <Seo title="Get Your Free Audit" description="Book a free, no-obligation audit of your SEO, website and campaigns with My First Digital Agency." />
      <section className="section-py bg-cream-100">
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Start Here / Free Audit</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">
              Get your <span className="text-gold-600">free audit.</span>
            </h1>
            <p className="mt-5 max-w-md text-ink-soft">Tell us a little about where you are now. We&rsquo;ll review your request and follow up by email to confirm a time — no payment, no obligation.</p>
            <ul className="mt-8 space-y-3 text-sm text-ink-soft">
              <li>Submit the form with your preferred date and time (IST).</li>
              <li>We review every request personally — this is not an instant booking.</li>
              <li>You&rsquo;ll get an email confirming, cancelling, or proposing a new time.</li>
            </ul>
          </div>
          <AuditForm siteKey={TURNSTILE_SITE_KEY} />
        </Container>
      </section>
    </>
  );
}
