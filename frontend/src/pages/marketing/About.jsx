import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export default function About() {
  return (
    <>
      <Seo title="About" description="My First Digital Agency was built on one idea: businesses deserve more than a monthly report and a rotating account manager." />
      <section className="section-py bg-cream-100">
        <Container>
          <Eyebrow index="06" label="About Us" />
          <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
            <div className="mx-auto w-full max-w-[280px] lg:mx-0">
              <div className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl shadow-charcoal-900/10">
                <img src="/brand/founder.jpg" alt="Founder of My First Digital Agency" width={280} height={400} className="h-auto w-full object-cover" />
              </div>
              <p className="mt-4 text-center text-sm font-bold text-charcoal-900 lg:text-left">Founder, My First Digital Agency</p>
            </div>

            <div>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">
                Big-agency thinking. <span className="text-gold-600">Founder-level care.</span>
              </h1>
              <div className="mt-8 space-y-5 text-lg text-ink-soft">
                <p>My First Digital Agency was started on a simple belief: growing businesses deserve more than a monthly report and a rotating account manager.</p>
                <p>We work as one senior team across strategy, SEO, paid media, websites and content — so nothing gets lost in translation between specialists who never talk to each other. When you work with us, you get people who know your business and care about what happens next.</p>
                <p>We&rsquo;re upfront about what marketing can and can&rsquo;t promise. No guaranteed rankings, no inflated case studies, no locking you into a contract that outlasts the results. Just clear strategy, honest reporting, and consistent execution.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 overflow-hidden rounded-2xl border border-charcoal-900/10 bg-white shadow-xl shadow-charcoal-900/10">
            <img src="/gallery/promo-3.jpg" alt="Digital marketing lead with the SEO, content and paid media teams at work" width={1374} height={1145} className="h-auto w-full" />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {["Strategy", "Traffic", "Leads", "Revenue"].map((label) => (
              <div key={label} className="rounded-xl border border-charcoal-900/10 bg-white p-5 text-center">
                <p className="font-display text-sm font-bold text-charcoal-900">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
