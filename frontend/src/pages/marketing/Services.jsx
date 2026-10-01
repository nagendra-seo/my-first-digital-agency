import { Seo } from "../../components/Seo.jsx";
import { Container } from "../../components/ui/Container.jsx";
import { Eyebrow } from "../../components/ui/Eyebrow.jsx";
import { ServicesGrid } from "../../components/marketing/ServicesGrid.jsx";
import { CTASection } from "../../components/marketing/CTASection.jsx";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export default function Services() {
  return (
    <>
      <Seo title="Services" description="SEO, website optimization, content strategy, local SEO, lead generation and growth strategy — explore how My First Digital Agency approaches each one." />
      <section className="section-py bg-cream-100">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow index="01" label="Services" />
              <h1 className="font-display text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl">
                Every channel your growth <span className="text-gold-600">needs, in one place.</span>
              </h1>
              <p className="mt-5 max-w-xl text-ink-soft">One senior team across strategy, media, web and creative — so every part of your marketing pulls in the same direction. Pick a service below to see exactly how we approach it.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-charcoal-900/10 bg-white shadow-xl shadow-charcoal-900/10">
              <img src="/gallery/promo-2.jpg" alt="Own your growth — SEO, SEM, website, content and design services" width={1374} height={1145} className="h-auto w-full" />
            </div>
          </div>
          <div className="mt-16">
            <ServicesGrid />
          </div>
        </Container>
      </section>
      <CTASection siteKey={TURNSTILE_SITE_KEY} />
    </>
  );
}
