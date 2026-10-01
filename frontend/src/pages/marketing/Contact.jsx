import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Get in touch with My First Digital Agency, or book a free audit to start with a clear, no-obligation look at your current marketing." />
      <section className="section-py bg-cream-100">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow index="07" label="Contact" />
            <h1 className="font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">
              Let&rsquo;s talk about <span className="text-gold-600">your growth.</span>
            </h1>
            <p className="mt-5 text-ink-soft">
              The fastest way to reach us is the free audit form below — it goes straight into our booking system and we&rsquo;ll follow up by email to confirm a time. Prefer email directly? Reach us at{" "}
              <a href="mailto:hello@myfirstdigitalagency.example" className="font-semibold text-charcoal-900 underline decoration-gold-400">hello@myfirstdigitalagency.example</a>.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-charcoal-900/10 bg-white shadow-xl shadow-charcoal-900/10">
            <img src="/gallery/promo-5.jpg" alt="My First Digital Agency — organic traffic growth dashboard" width={1536} height={1024} className="h-auto w-full" />
          </div>
        </Container>
      </section>
      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
